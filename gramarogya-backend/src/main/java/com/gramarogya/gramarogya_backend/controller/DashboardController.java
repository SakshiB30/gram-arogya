package com.gramarogya.gramarogya_backend.controller;

import com.gramarogya.gramarogya_backend.dto.DashboardResponseDto;
import com.gramarogya.gramarogya_backend.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping
    public DashboardResponseDto dashboard(Authentication authentication) {
        return dashboardService.getDashboard(authentication);
    }

    @GetMapping("/recent-activities")
    public List<com.gramarogya.gramarogya_backend.dto.dashboard.ActivityDto> recentActivities(Authentication authentication) {
        return dashboardService.getRecentActivities(authentication);
    }

    @GetMapping("/alerts")
    public List<com.gramarogya.gramarogya_backend.dto.dashboard.AlertDto> alerts(Authentication authentication) {
        return dashboardService.getAlerts(authentication);
    }

    @GetMapping("/pending-verifications")
    public List<com.gramarogya.gramarogya_backend.dto.dashboard.PendingVerificationDto> pendingVerifications(
            Authentication authentication) {

        return dashboardService.getPendingVerifications(authentication);
    }
}
