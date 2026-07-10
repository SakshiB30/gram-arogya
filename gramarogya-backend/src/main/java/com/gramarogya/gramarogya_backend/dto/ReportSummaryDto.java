package com.gramarogya.gramarogya_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReportSummaryDto {

    private long totalBeneficiaries;

    private long totalVisits;

    private long totalHealthRecords;

    private long totalMedicines;

    private long lowStockMedicines;

    private long outOfStockMedicines;
}