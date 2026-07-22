package com.gramarogya.gramarogya_backend.dto.dashboard;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardResponseDto {

    private DashboardStatsDto stats;

    private List<ActivityDto> recentActivities;

    private List<AlertDto> alerts;

    private List<UpcomingVisitDto> upcomingVisits;

    private List<MedicineAlertDto> lowStockMedicines;

    private List<PendingVerificationDto> pendingVerifications;

}