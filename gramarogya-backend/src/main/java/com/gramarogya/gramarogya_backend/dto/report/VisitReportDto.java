package com.gramarogya.gramarogya_backend.dto.report;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VisitReportDto {

    private String id;

    private String beneficiaryId;

    private String beneficiaryName;

    private LocalDate visitDate;

    private String visitType;

    private String status;

    private String notes;

    private LocalDate nextVisitDate;
}