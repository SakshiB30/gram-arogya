package com.gramarogya.gramarogya_backend.service;


import com.gramarogya.gramarogya_backend.dto.LoginRequestDto;
import com.gramarogya.gramarogya_backend.dto.LoginResponseDto;
import com.gramarogya.gramarogya_backend.dto.RegisterRequestDto;
import com.gramarogya.gramarogya_backend.dto.UserResponseDto;
import jakarta.validation.Valid;

public interface AuthService {
    UserResponseDto register(RegisterRequestDto request);

    LoginResponseDto login(@Valid LoginRequestDto request);
}
