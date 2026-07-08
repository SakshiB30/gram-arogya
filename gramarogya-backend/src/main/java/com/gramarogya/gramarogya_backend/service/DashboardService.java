package com.gramarogya.gramarogya_backend.service;

import com.gramarogya.gramarogya_backend.dto.DashboardResponseDto;
import org.springframework.security.core.Authentication;

import java.util.List;

public interface DashboardService {
    DashboardResponseDto getDashboard(Authentication authentication);

    List<com.gramarogya.gramarogya_backend.dto.dashboard.PendingVerificationDto> getPendingVerifications(Authentication authentication);

    List<com.gramarogya.gramarogya_backend.dto.dashboard.AlertDto> getAlerts(Authentication authentication);

    List<com.gramarogya.gramarogya_backend.dto.dashboard.ActivityDto> getRecentActivities(Authentication authentication);
}
