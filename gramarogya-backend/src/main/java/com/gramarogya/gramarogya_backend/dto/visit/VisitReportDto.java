package com.gramarogya.gramarogya_backend.dto.visit;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VisitReportDto {

    private String id;

    private String beneficiaryName;

    private String visitType;

    private String visitDate;

    private String status;

    private String ashaWorker;
}