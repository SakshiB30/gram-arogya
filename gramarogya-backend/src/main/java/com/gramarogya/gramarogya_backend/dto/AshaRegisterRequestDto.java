package com.gramarogya.gramarogya_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AshaRegisterRequestDto {

    private String name;

    private String email;

    private String password;

    private String phone;

    private String village;

    private String taluka;

    private String district;

    private String state;

    // Required to assign the ANM
    private String anmEmployeeId;
}