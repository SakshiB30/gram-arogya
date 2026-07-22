package com.gramarogya.gramarogya_backend.controller;

import com.gramarogya.gramarogya_backend.dto.dashboard.DashboardResponseDto;
import com.gramarogya.gramarogya_backend.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping
    public DashboardResponseDto getDashboard(Authentication authentication) {
        return dashboardService.getDashboard(authentication);
    }
}

