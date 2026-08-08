package com.gramarogya.gramarogya_backend.service;

import com.gramarogya.gramarogya_backend.dto.AshaRegisterRequestDto;
import com.gramarogya.gramarogya_backend.dto.UserResponseDto;


public interface AshaService {

    UserResponseDto register(AshaRegisterRequestDto request);

}