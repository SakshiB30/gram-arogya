package com.gramarogya.gramarogya_backend.dto.Health_Records;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HealthRecordReportDto {

    private String id;

    private String beneficiaryName;

    private String bloodPressure;

    private Double weight;

    private Double temperature;

    private Double hemoglobin;

    private String diagnosis;

    private String prescription;

    private String notes;

    private String createdAt;
}