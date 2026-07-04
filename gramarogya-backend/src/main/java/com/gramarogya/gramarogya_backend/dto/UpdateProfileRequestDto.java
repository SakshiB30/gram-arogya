package com.gramarogya.gramarogya_backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateProfileRequestDto {


    @Size(min = 2, max = 50)
    private String name;

    private String phone;

    private String village;

    private String taluka;

    private String district;

    private String state;

    private String profileImage;
}