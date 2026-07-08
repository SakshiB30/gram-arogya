package com.gramarogya.gramarogya_backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UpdateHealthRecordRequestDto {

    @NotBlank(message = "Beneficiary ID is required")
    private String beneficiaryId;

    @NotBlank(message = "Visit ID is required")
    private String visitId;

    @NotBlank(message = "Blood Pressure is required")
    private String bloodPressure;

    @NotNull(message = "Weight is required")
    private Double weight;

    @NotNull(message = "Temperature is required")
    private Double temperature;

    @NotNull(message = "Hemoglobin is required")
    private Double hemoglobin;

    @NotBlank(message = "Diagnosis is required")
    private String diagnosis;

    private String prescription;

    private String notes;
}