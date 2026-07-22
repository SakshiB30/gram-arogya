package com.gramarogya.gramarogya_backend.service;

import com.gramarogya.gramarogya_backend.dto.dashboard.DashboardResponseDto;
import org.springframework.security.core.Authentication;

public interface DashboardService {

    DashboardResponseDto getDashboard(Authentication authentication);

}