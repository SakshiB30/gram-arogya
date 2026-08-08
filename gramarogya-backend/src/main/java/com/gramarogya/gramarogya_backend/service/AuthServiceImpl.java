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
    public UserResponseDto registerAnm(RegisterAnmRequestDto request) {

        // Email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .phone(request.getPhone())
                .village(request.getVillage())
                .taluka(request.getTaluka())
                .district(request.getDistrict())
                .state(request.getState())

                .role(Role.ANM)

                // Newly registered ANMs are not approved yet
                .verificationStatus(VerificationStatus.PENDING)
                .accountStatus(AccountStatus.BLOCKED)

                // Employee ID will be generated after admin approval
                .employeeId(null)

                .supervisorId(null)

                .build();

        user = userRepository.save(user);

        return userMapper.toResponseDto(user);
    }

    @Override
    public UserResponseDto registerAsha(RegisterAshaRequestDto request) {

        // Email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        // Find ANM using Employee ID
        User anm = userRepository
                .findByEmployeeId(request.getAnmEmployeeId())
                .orElseThrow(() ->
                        new RuntimeException("Invalid ANM Employee ID"));

        // Ensure the supervisor is actually an ANM
        if (anm.getRole() != Role.ANM) {
            throw new RuntimeException("Invalid ANM Employee ID");
        }

        // ANM must be approved
        if (anm.getVerificationStatus() != VerificationStatus.APPROVED) {
            throw new RuntimeException("Assigned ANM is not approved.");
        }

        // ANM must be active
        if (anm.getAccountStatus() != AccountStatus.ACTIVE) {
            throw new RuntimeException("Assigned ANM is blocked.");
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .phone(request.getPhone())
                .village(request.getVillage())
                .taluka(request.getTaluka())
                .district(request.getDistrict())
                .state(request.getState())

                .role(Role.ASHA)

                // Supervisor ANM
                .supervisorId(anm.getId())

                // Generated after ANM approval
                .employeeId(null)

                // Pending until ANM approves
                .verificationStatus(VerificationStatus.PENDING)

                // Cannot login yet
                .accountStatus(AccountStatus.BLOCKED)

                .build();

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