package com.gramarogya.gramarogya_backend.dto.visit;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CreateVisitRequestDto {

    @NotBlank(message = "Beneficiary ID is required")
    private String beneficiaryId;

    @NotBlank(message = "Visit type is required")
    private String visitType;

    @NotBlank(message = "Status is required")
    private String status;

    private LocalDate scheduledDate;

    private String notes;

    private LocalDate nextVisitDate;
}