package com.gramarogya.gramarogya_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RegisterAnmRequestDto {

    private String name;

    private String email;

    private String password;

    private String phone;

    private String village;

    private String taluka;

    private String district;

    private String state;

}