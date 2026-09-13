package com.gramarogya.gramarogya_backend.service;

import com.gramarogya.gramarogya_backend.dto.*;
import com.gramarogya.gramarogya_backend.entity.User;
import com.gramarogya.gramarogya_backend.exception.AccountStateException;
import com.gramarogya.gramarogya_backend.exception.AuthenticationFailedException;
import com.gramarogya.gramarogya_backend.exception.BusinessValidationException;
import com.gramarogya.gramarogya_backend.exception.ConflictException;
import com.gramarogya.gramarogya_backend.exception.ErrorCodes;
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
            throw new ConflictException(
                    ErrorCodes.DUPLICATE_EMAIL,
                    "This email is already registered."
            );
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
            throw new ConflictException(
                    ErrorCodes.DUPLICATE_EMAIL,
                    "This email is already registered."
            );
        }

        // Find ANM using Employee ID
        User anm = userRepository
                .findByEmployeeId(request.getAnmEmployeeId())
                .orElseThrow(() ->
                        new BusinessValidationException(
                                "Please enter a valid ANM Employee ID."
                        ));

        // Ensure the supervisor is actually an ANM
        if (anm.getRole() != Role.ANM) {
            throw new BusinessValidationException(
                    "Please enter a valid ANM Employee ID."
            );
        }

        // ANM must be approved
        if (anm.getVerificationStatus() != VerificationStatus.APPROVED) {
            throw new BusinessValidationException(
                    "The assigned ANM is not approved yet."
            );
        }

        // ANM must be active
        if (anm.getAccountStatus() != AccountStatus.ACTIVE) {
            throw new BusinessValidationException(
                    "The assigned ANM account is currently blocked."
            );
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
                        new AuthenticationFailedException(
                                "Invalid email or password."
                        ));

        // Check password
        if (!passwordEncoder.matches(
                request.getPassword(),
                user.getPassword())) {

            throw new AuthenticationFailedException(
                    "Invalid email or password."
            );
        }

        // Verification Check
        if (user.getVerificationStatus() != VerificationStatus.APPROVED) {

            switch (user.getVerificationStatus()) {

                case PENDING:
                    throw new AccountStateException(
                            ErrorCodes.VERIFICATION_PENDING,
                            getPendingVerificationMessage(user));

                case REJECTED:
                    throw new AccountStateException(
                            ErrorCodes.REGISTRATION_REJECTED,
                            "Your registration has been rejected. Please contact your supervisor or administrator for more information.");

                default:
                    throw new AccountStateException(
                            ErrorCodes.ACCESS_DENIED,
                            "Your account is not verified.");
            }
        }

        // Account Status Check
        if (user.getAccountStatus() != AccountStatus.ACTIVE) {
            throw new AccountStateException(
                    ErrorCodes.ACCOUNT_BLOCKED,
                    "Your account has been blocked. Please contact the administrator for assistance.");
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

    private String getPendingVerificationMessage(User user) {

        if (user.getRole() == Role.ASHA) {
            return "Your registration is waiting for ANM verification. You will be able to log in after your ANM approves your account.";
        }

        if (user.getRole() == Role.ANM) {
            return "Your registration is waiting for Admin verification. You will be able to log in after your account is approved.";
        }

        return "Your registration is waiting for verification. You will be able to log in after your account is approved.";
    }
}
