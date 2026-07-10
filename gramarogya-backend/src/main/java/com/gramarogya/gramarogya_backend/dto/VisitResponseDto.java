package com.gramarogya.gramarogya_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VisitResponseDto {

    private String id;

    private String beneficiaryId;

    private LocalDate visitDate;

    private String visitType;

    private String status;

    private String notes;

    private LocalDate nextVisitDate;
}