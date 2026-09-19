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

    @NotBlank(message = "Beneficiary ID is required")
    private String beneficiaryId;

    @NotBlank(message = "Visit ID is required")
    private String visitId;

    @NotNull(message = "Recorded date is required")
    @PastOrPresent(message = "Recorded date cannot be in the future")
    private LocalDateTime recordedAt;

    @NotBlank(message = "Blood pressure is required")
    private String bloodPressure;

    @NotNull(message = "Weight is required")
    private Double weight;

    @NotNull(message = "Temperature is required")
    private Double temperature;

    @NotNull(message = "Hemoglobin is required")
    private Double hemoglobin;

    private String diagnosis;

    private String prescription;

    private String notes;
}