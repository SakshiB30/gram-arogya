package com.gramarogya.gramarogya_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardResponseDto {

    private String userName;

    private long totalBeneficiaries;

    private long totalVisits;

    private long todayVisits;

    private long upcomingVisits;

    private long pregnantWomen;

    private long children;

    private long tbPatients;

    private long elderly;
}
