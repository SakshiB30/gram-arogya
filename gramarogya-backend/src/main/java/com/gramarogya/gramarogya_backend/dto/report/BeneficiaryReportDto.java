package com.gramarogya.gramarogya_backend.dto.report;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BeneficiaryReportDto {

    private String id;

    private String name;

    private Integer age;

    private String gender;

    private String village;

    private String category;

    private String mobileNumber;
}