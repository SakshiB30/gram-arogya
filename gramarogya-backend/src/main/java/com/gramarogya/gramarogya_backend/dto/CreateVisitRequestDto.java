package com.gramarogya.gramarogya_backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

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

    private String notes;
}