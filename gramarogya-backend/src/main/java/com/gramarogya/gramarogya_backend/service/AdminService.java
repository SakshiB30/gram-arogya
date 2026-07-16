package com.gramarogya.gramarogya_backend.service;

import com.gramarogya.gramarogya_backend.dto.CreateAnmRequestDto;
import com.gramarogya.gramarogya_backend.dto.UserResponseDto;

public interface AdminService {
    UserResponseDto createAnm(CreateAnmRequestDto request);
}
