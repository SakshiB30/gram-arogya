package com.gramarogya.gramarogya_backend.service;

import com.gramarogya.gramarogya_backend.dto.UserResponseDto;

import java.util.List;

public interface AdminService {

    List<UserResponseDto> getPendingAnms();

    UserResponseDto approveAnm(String id);

    UserResponseDto rejectAnm(String id);

    UserResponseDto blockAnm(String id);

    UserResponseDto unblockAnm(String id);

    List<UserResponseDto> getAllAnms();

    List<UserResponseDto> getAllAshas();

    UserResponseDto blockAsha(String id);

    UserResponseDto unblockAsha(String id);

    List<UserResponseDto> getAllUsers();

}
