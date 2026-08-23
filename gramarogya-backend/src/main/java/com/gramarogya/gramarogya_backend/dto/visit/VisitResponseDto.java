package com.gramarogya.gramarogya_backend.dto.visit;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

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

    private LocalDate scheduledDate;


    private LocalDate nextVisitDate;

    private String status;

    private String notes;
}