package com.gramarogya.gramarogya_backend.dto.report;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PendingReportDto {

    private String id;

    private String patientName;

    private String reportType;

    private String submittedAt;

}