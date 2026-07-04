package com.gramarogya.gramarogya_backend.service;

import com.gramarogya.gramarogya_backend.dto.UpdateProfileRequestDto;
import com.gramarogya.gramarogya_backend.dto.UserResponseDto;

public interface UserService {

    UserResponseDto getCurrentUser(String email);

    UserResponseDto updateProfile(String email,
                                  UpdateProfileRequestDto request);

}