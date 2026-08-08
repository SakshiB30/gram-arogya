package com.gramarogya.gramarogya_backend.service;

import com.gramarogya.gramarogya_backend.dto.AnmDashboardDto;
import com.gramarogya.gramarogya_backend.dto.UserResponseDto;
import org.springframework.security.core.Authentication;

import java.util.List;

public interface AnmService {

    List<UserResponseDto> getPendingAshas(Authentication authentication);

    UserResponseDto approveAsha(String ashaId, Authentication authentication);

    UserResponseDto rejectAsha(String ashaId, Authentication authentication);

    List<UserResponseDto> getMyAshas(Authentication authentication);

    AnmDashboardDto getDashboard(Authentication authentication);

    UserResponseDto blockAsha(
            String ashaId,
            Authentication authentication);

    UserResponseDto unblockAsha(
            String ashaId,
            Authentication authentication);

    List<UserResponseDto> getAllAshas(Authentication authentication);
}