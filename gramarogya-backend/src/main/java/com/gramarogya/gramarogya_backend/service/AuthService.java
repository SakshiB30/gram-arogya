package com.gramarogya.gramarogya_backend.service;


import com.gramarogya.gramarogya_backend.dto.*;
import jakarta.validation.Valid;

public interface AuthService {
    UserResponseDto registerAnm(RegisterAnmRequestDto request);

    UserResponseDto registerAsha(RegisterAshaRequestDto request);

    LoginResponseDto login(@Valid LoginRequestDto request);
}
