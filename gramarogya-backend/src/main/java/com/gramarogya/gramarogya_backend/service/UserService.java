package com.gramarogya.gramarogya_backend.service;

import com.gramarogya.gramarogya_backend.dto.UpdateProfileRequestDto;
import com.gramarogya.gramarogya_backend.dto.UserProfileDto;
import com.gramarogya.gramarogya_backend.dto.UserResponseDto;
import org.springframework.security.core.Authentication;

public interface UserService {

    UserResponseDto getCurrentUser(String email);

    UserResponseDto updateProfile(String email,
                                  UpdateProfileRequestDto request);

    UserProfileDto getProfile(Authentication authentication);

}