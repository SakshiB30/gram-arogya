package com.gramarogya.gramarogya_backend.dto;

import com.gramarogya.gramarogya_backend.entity.Beneficiary;
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

    private LocalDate dateAdded;

}
