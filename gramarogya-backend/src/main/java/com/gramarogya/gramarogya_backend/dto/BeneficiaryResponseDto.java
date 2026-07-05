package com.gramarogya.gramarogya_backend.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;

@Data
@Builder
public class BeneficiaryResponseDto {

    private String id;

    private String name;

    private Integer age;

    private String gender;

    private String phone;

    private String village;

    private String address;

    private String category;

    private String disease;

    private String status;

    private LocalDate dateAdded;

    private LocalDate lastVisitDate;

    private LocalDate nextVisitDate;
}