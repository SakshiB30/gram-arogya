package com.gramarogya.gramarogya_backend.dto.Health_Records;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateHealthRecordRequestDto {

    // =====================================================
    // REFERENCES
    // =====================================================

    @NotBlank(message = "Beneficiary ID is required")
    private String beneficiaryId;

    @NotBlank(message = "Visit ID is required")
    private String visitId;


    // =====================================================
    // CLINICAL ASSESSMENT TIME
    // =====================================================

    @NotNull(message = "Recorded date and time is required")
    @PastOrPresent(message = "Recorded date and time cannot be in the future")
    private LocalDateTime recordedAt;


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