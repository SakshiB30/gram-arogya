package com.gramarogya.gramarogya_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HealthRecordResponseDto {

    private String id;

    // Beneficiary
    private String beneficiaryId;
    private String beneficiaryName;

    // Visit
    private String visitId;
    private String visitType;

    // Vital Signs
    private String bloodPressure;
    private Double weight;
    private Double temperature;
    private Double hemoglobin;

    // Medical Details
    private String diagnosis;
    private String prescription;
    private String notes;

    // Timestamps
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}