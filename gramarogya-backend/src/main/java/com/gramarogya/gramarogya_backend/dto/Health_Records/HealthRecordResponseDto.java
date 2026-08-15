package com.gramarogya.gramarogya_backend.dto.Health_Records;

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

    // =====================================================
    // HEALTH RECORD
    // =====================================================

    private String id;


    // =====================================================
    // BENEFICIARY
    // =====================================================

    private String beneficiaryId;

    private String beneficiaryName;


    // =====================================================
    // VISIT
    // =====================================================

    private String visitId;

    private String visitType;


    // =====================================================
    // RECORDED BY
    // =====================================================

    /**
     * ID of the ASHA/ANM who recorded the health record.
     */
    private String recordedBy;


    // =====================================================
    // VITAL SIGNS
    // =====================================================

    /**
     * Example: 120/80 mmHg
     */
    private String bloodPressure;

    /**
     * Weight in kilograms.
     */
    private Double weight;

    /**
     * Temperature in Celsius.
     */
    private Double temperature;

    /**
     * Hemoglobin in g/dL.
     */
    private Double hemoglobin;


    // =====================================================
    // MEDICAL INFORMATION
    // =====================================================

    private String diagnosis;

    private String prescription;

    private String notes;


    // =====================================================
    // AUDIT TIMESTAMPS
    // =====================================================

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}