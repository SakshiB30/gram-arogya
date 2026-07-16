package com.gramarogya.gramarogya_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CreateAnmRequestDto {

    private String name;

    private String email;

    private String password;
}