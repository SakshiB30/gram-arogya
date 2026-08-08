package com.gramarogya.gramarogya_backend.controller;

import com.gramarogya.gramarogya_backend.dto.*;
import com.gramarogya.gramarogya_backend.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@Validated
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    // ===========================
    // Register ANM
    // ===========================

    @PostMapping("/register-anm")
    public UserResponseDto registerAnm(
            @Valid @RequestBody RegisterAnmRequestDto request) {

        return authService.registerAnm(request);
    }

    // ===========================
    // Register ASHA
    // ===========================

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
}
