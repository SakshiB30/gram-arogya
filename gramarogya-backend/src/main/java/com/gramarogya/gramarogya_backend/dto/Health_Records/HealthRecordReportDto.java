package com.gramarogya.gramarogya_backend.dto.Health_Records;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HealthRecordReportDto {

    // =====================================================
    // HEALTH RECORD
    // =====================================================

    private String id;


    // =====================================================
    // BENEFICIARY
    // =====================================================

    private String beneficiaryName;


    // =====================================================
    // VITAL SIGNS
    // =====================================================

    private String bloodPressure;

    private Double weight;

    private Double temperature;

    private Double hemoglobin;


    // =====================================================
    // MEDICAL INFORMATION
    // =====================================================

    private String diagnosis;

    private String prescription;

    private String notes;


    // =====================================================
    // CREATED DATE
    // =====================================================

    private String createdAt;
}