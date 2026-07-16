package com.gramarogya.gramarogya_backend.service;

import com.gramarogya.gramarogya_backend.dto.*;
import com.gramarogya.gramarogya_backend.entity.User;
import com.gramarogya.gramarogya_backend.mapper.UserMapper;
import com.gramarogya.gramarogya_backend.repository.UserRepository;
import com.gramarogya.gramarogya_backend.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final UserMapper userMapper;

    @Override
    public UserResponseDto register(RegisterRequestDto registerRequestDto) {

        // Check if email already exists
        if (userRepository.existsByEmail(registerRequestDto.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        // Find ANM using Employee ID
        User anm = userRepository.findByEmployeeId(registerRequestDto.getAnmEmployeeId())
                .orElseThrow(() ->
                        new RuntimeException("Invalid ANM Employee ID"));

        // Ensure Employee ID belongs to an ANM
        if (anm.getRole() != Role.ANM) {
            throw new RuntimeException("Invalid ANM Employee ID");
        }

        // Ensure ANM account is approved and active
        if (anm.getVerificationStatus() != VerificationStatus.APPROVED ||
                anm.getAccountStatus() != AccountStatus.ACTIVE) {

            throw new RuntimeException(
                    "This ANM account is not active. Please contact the administrator.");
        }

        // Create ASHA user
        User user = userMapper.toEntity(registerRequestDto);

        // Encode Password
        user.setPassword(
                passwordEncoder.encode(registerRequestDto.getPassword())
        );

        // System-managed fields
        user.setRole(Role.ASHA);

        // Waiting for ANM approval
        user.setVerificationStatus(VerificationStatus.PENDING);

        // Cannot login until approved
        user.setAccountStatus(AccountStatus.BLOCKED);

        // Store supervisor's Employee ID
        user.setSupervisorId(anm.getId());

        // Employee ID will be assigned later if needed
        user.setEmployeeId(null);

        // Save user
        user = userRepository.save(user);

        return userMapper.toResponseDto(user);
    }

    @Override
    public LoginResponseDto login(LoginRequestDto request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new RuntimeException("Invalid email"));

        // Check password
        if (!passwordEncoder.matches(
                request.getPassword(),
                user.getPassword())) {

            throw new RuntimeException("Invalid password");
        }

        // Verification Check
        if (user.getVerificationStatus() != VerificationStatus.APPROVED) {

            switch (user.getVerificationStatus()) {

                case PENDING:
                    throw new RuntimeException(
                            "Your account is pending verification.");

                case REJECTED:
                    throw new RuntimeException(
                            "Your registration has been rejected.");

                default:
                    throw new RuntimeException(
                            "Your account is not verified.");
            }
        }

        // Account Status Check
        if (user.getAccountStatus() != AccountStatus.ACTIVE) {
            throw new RuntimeException(
                    "Your account has been blocked. Please contact your administrator.");
        }

        // Generate JWT Token
        String token = jwtService.generateToken(user);

        return LoginResponseDto.builder()
                .token(token)
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .build();
    }
}