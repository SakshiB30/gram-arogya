package com.gramarogya.gramarogya_backend.controller;

import com.gramarogya.gramarogya_backend.dto.LoginRequestDto;
import com.gramarogya.gramarogya_backend.dto.LoginResponseDto;
import com.gramarogya.gramarogya_backend.dto.RegisterRequestDto;
import com.gramarogya.gramarogya_backend.dto.UserResponseDto;
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

    @PostMapping("/register")
    public UserResponseDto register(
            @Valid @RequestBody RegisterRequestDto request) {

        return authService.register(request);
    }

    @PostMapping("/login")
    public LoginResponseDto login(
            @Valid @RequestBody LoginRequestDto request) {

        return authService.login(request);
    }
}
