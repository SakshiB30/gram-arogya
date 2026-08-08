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

    private String beneficiaryName;

    private String category;

    private String village;

    private String phone;

    private String visitType;

    private LocalDate visitDate;

    private LocalDate nextVisitDate;

    private String status;

    private String notes;
}