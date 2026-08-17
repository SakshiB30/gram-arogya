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

    @NotBlank
    private String beneficiaryId;

    @NotBlank
    private String visitId;

    @NotNull
    @PastOrPresent
    private LocalDateTime recordedAt;

    @NotBlank
    private String bloodPressure;

    @NotNull
    private Double weight;

    @NotNull
    private Double temperature;

    @NotNull
    private Double hemoglobin;

    @NotBlank
    private String diagnosis;

    private String prescription;

    private String notes;
}