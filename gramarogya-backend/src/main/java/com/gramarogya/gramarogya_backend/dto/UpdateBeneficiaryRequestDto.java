package com.gramarogya.gramarogya_backend.dto;

import lombok.Getter;
import lombok.Setter;

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
}