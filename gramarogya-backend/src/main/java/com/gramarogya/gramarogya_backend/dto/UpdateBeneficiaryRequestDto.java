package com.gramarogya.gramarogya_backend.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class UpdateBeneficiaryRequestDto {

    private String name;

    private Integer age;

    private String gender;

    private String phone;

    private String village;

    private String address;

    private String category;

    private String disease;

    private String status;

}