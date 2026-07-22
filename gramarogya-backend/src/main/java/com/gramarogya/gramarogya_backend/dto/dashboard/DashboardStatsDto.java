package com.gramarogya.gramarogya_backend.dto.dashboard;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStatsDto {

    private String userName;

    // Common
    private long totalBeneficiaries;
    private long totalVisits;
    private long todayVisits;
    private long upcomingVisits;

    // ASHA
    private long pregnantWomen;
    private long children;
    private long tbPatients;
    private long elderly;

    // ADMIN
    private long totalUsers;
    private long totalAnms;
    private long totalAshas;
    private long pendingVerifications;

    // ANM
    private long assignedAshas;
}