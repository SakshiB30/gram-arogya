package com.gramarogya.gramarogya_backend.dto.Health_Records;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateHealthRecordRequestDto {

    // =====================================================
    // VITAL SIGNS
    // =====================================================

    @NotBlank(message = "Blood pressure is required")
    private String bloodPressure;

    @NotNull(message = "Weight is required")
    @DecimalMin(
            value = "1.0",
            message = "Weight must be greater than 0"
    )
    @DecimalMax(
            value = "300.0",
            message = "Weight must be less than or equal to 300 kg"
    )
    private Double weight;

    @NotNull(message = "Temperature is required")
    @DecimalMin(
            value = "30.0",
            message = "Temperature value is too low"
    )
    @DecimalMax(
            value = "45.0",
            message = "Temperature value is too high"
    )
    private Double temperature;

    @NotNull(message = "Hemoglobin is required")
    @DecimalMin(
            value = "1.0",
            message = "Hemoglobin must be greater than 0"
    )
    @DecimalMax(
            value = "30.0",
            message = "Hemoglobin value is too high"
    )
    private Double hemoglobin;


    // =====================================================
    // MEDICAL INFORMATION
    // =====================================================

    @NotBlank(message = "Diagnosis is required")
    private String diagnosis;

    private String prescription;

    private String notes;
}