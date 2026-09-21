package com.gramarogya.gramarogya_backend.controller;

import com.gramarogya.gramarogya_backend.dto.*;
import com.gramarogya.gramarogya_backend.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@Validated
@RequiredArgsConstructor
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register-anm")
    public UserResponseDto registerAnm(
            @Valid @RequestBody RegisterAnmRequestDto request) {

        return authService.registerAnm(request);
    }

    @PostMapping("/register-asha")
    public UserResponseDto registerAsha(
            @Valid @RequestBody RegisterAshaRequestDto request) {

        return authService.registerAsha(request);
    }

    @PostMapping("/login")
    public LoginResponseDto login(
            @Valid @RequestBody LoginRequestDto request) {

        return authService.login(request);
    }

    @PostMapping("/forgot-password/send-otp")
    public ForgotPasswordResponseDto sendForgotPasswordOtp(
            @Valid @RequestBody SendOtpRequestDto request) {

        return authService.sendForgotPasswordOtp(request);
    }

    @PostMapping("/forgot-password/verify-otp")
    public ForgotPasswordResponseDto verifyForgotPasswordOtp(
            @Valid @RequestBody VerifyOtpRequestDto request) {

        return authService.verifyForgotPasswordOtp(request);
    }

    @PostMapping("/forgot-password/reset")
    public ForgotPasswordResponseDto resetPassword(
            @Valid @RequestBody ResetPasswordRequestDto request) {

        return authService.resetPassword(request);
    }
}
