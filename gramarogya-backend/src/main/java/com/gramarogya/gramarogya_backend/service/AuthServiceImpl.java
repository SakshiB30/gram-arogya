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
import com.gramarogya.gramarogya_backend.entity.PasswordResetOtp;
import com.gramarogya.gramarogya_backend.repository.PasswordResetOtpRepository;
import com.gramarogya.gramarogya_backend.security.EmailOtpService;
import com.gramarogya.gramarogya_backend.security.OtpGenerator;
import com.gramarogya.gramarogya_backend.entity.PasswordResetToken;
import com.gramarogya.gramarogya_backend.repository.PasswordResetTokenRepository;
import com.gramarogya.gramarogya_backend.security.PasswordResetTokenGenerator;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final UserMapper userMapper;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final PasswordResetOtpRepository passwordResetOtpRepository;
    private final EmailOtpService emailOtpService;
    private final OtpGenerator otpGenerator;
    private final PasswordResetTokenGenerator passwordResetTokenGenerator;

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
                .verificationStatus(VerificationStatus.PENDING)
                .accountStatus(AccountStatus.BLOCKED)
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
                .supervisorId(anm.getId())
                .employeeId(null)
                .verificationStatus(VerificationStatus.PENDING)
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

    @Override
    public ForgotPasswordResponseDto sendForgotPasswordOtp(
            SendOtpRequestDto request) {

        String email = request.getEmail().trim().toLowerCase();

        /*
         * Generic response prevents revealing whether
         * this email address exists in our database.
         */
        String genericMessage =
                "If the email address is registered, an OTP has been sent.";

        User user = userRepository
                .findByEmail(email)
                .orElse(null);

        if (user == null) {
            return new ForgotPasswordResponseDto(genericMessage);
        }

        // Remove any previous OTP and reset authorization
        passwordResetOtpRepository.deleteByUserId(user.getId());
        passwordResetTokenRepository.deleteByUserId(user.getId());

        // Generate a new 6-digit OTP
        String otp = otpGenerator.generateOtp();

        // Hash the OTP before storing it
        String otpHash = passwordEncoder.encode(otp);

        PasswordResetOtp passwordResetOtp = PasswordResetOtp.builder()
                .userId(user.getId())
                .email(email)
                .otpHash(otpHash)
                .expiresAt(LocalDateTime.now().plusMinutes(10))
                .attempts(0)
                .verified(false)
                .build();

        passwordResetOtpRepository.save(passwordResetOtp);

        // Send actual OTP to user's email
        emailOtpService.sendOtp(email, otp);

        return new ForgotPasswordResponseDto(genericMessage);
    }

    @Override
    public ForgotPasswordResponseDto verifyForgotPasswordOtp(
            VerifyOtpRequestDto request) {

        String email = request.getEmail().trim().toLowerCase();

        User user = userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new BusinessValidationException(
                                "Invalid OTP or email address."
                        ));

        PasswordResetOtp passwordResetOtp =
                passwordResetOtpRepository.findByUserId(user.getId())
                        .orElseThrow(() ->
                                new BusinessValidationException(
                                        "Invalid or expired OTP."
                                ));

        // Check OTP expiry
        if (passwordResetOtp.getExpiresAt()
                .isBefore(LocalDateTime.now())) {

            throw new BusinessValidationException(
                    "This OTP has expired. Please request a new OTP."
            );
        }

        // Prevent reusing the same OTP
        if (passwordResetOtp.isVerified()) {
            throw new BusinessValidationException(
                    "This OTP has already been used."
            );
        }

        // Verify OTP against stored hash
        boolean validOtp = passwordEncoder.matches(
                request.getCode(),
                passwordResetOtp.getOtpHash()
        );

        if (!validOtp) {
            passwordResetOtp.setAttempts(
                    passwordResetOtp.getAttempts() + 1
            );

            passwordResetOtpRepository.save(passwordResetOtp);

            throw new BusinessValidationException(
                    "Invalid OTP."
            );
        }

        // Mark OTP as verified
        passwordResetOtp.setVerified(true);
        passwordResetOtpRepository.save(passwordResetOtp);

        /*
         * Delete older reset authorizations so only
         * the newest successful verification can be used.
         */
        passwordResetTokenRepository.deleteByUserId(user.getId());

        String resetTokenValue =
                passwordResetTokenGenerator.generateToken();

        PasswordResetToken resetToken = PasswordResetToken.builder()
                .token(resetTokenValue)
                .userId(user.getId())
                .expiresAt(LocalDateTime.now().plusMinutes(10))
                .used(false)
                .build();

        passwordResetTokenRepository.save(resetToken);

        return new ForgotPasswordResponseDto(
                resetTokenValue
        );
    }

    @Override
    public ForgotPasswordResponseDto resetPassword(
            ResetPasswordRequestDto request) {

        PasswordResetToken resetToken =
                passwordResetTokenRepository
                        .findByToken(request.getResetToken())
                        .orElseThrow(() ->
                                new BusinessValidationException(
                                        "Invalid or expired reset token."
                                ));

        // Token already used
        if (resetToken.isUsed()) {
            throw new BusinessValidationException(
                    "This reset token has already been used."
            );
        }

        // Token expired
        if (resetToken.getExpiresAt()
                .isBefore(LocalDateTime.now())) {

            throw new BusinessValidationException(
                    "This reset token has expired. Please request a new OTP."
            );
        }

        User user = userRepository.findById(resetToken.getUserId())
                .orElseThrow(() ->
                        new BusinessValidationException(
                                "Unable to reset the password."
                        ));

        // Update password using BCrypt
        user.setPassword(
                passwordEncoder.encode(request.getNewPassword())
        );

        userRepository.save(user);

        // Make the reset token one-time use
        resetToken.setUsed(true);
        passwordResetTokenRepository.save(resetToken);

        return new ForgotPasswordResponseDto(
                "Password reset successfully. Please log in with your new password."
        );
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