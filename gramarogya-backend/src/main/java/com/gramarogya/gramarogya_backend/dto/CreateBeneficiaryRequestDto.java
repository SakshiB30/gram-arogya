package com.gramarogya.gramarogya_backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateBeneficiaryRequestDto {
    @NotBlank(message = "Name is required")
    private String name;

    @NotNull(message = "Age is required")
    private Integer age;

    @NotBlank(message = "Gender is required")
    private String gender;

    private String phone;

    @NotBlank(message = "Village is required")
    private String village;

    private String address;

    @NotBlank(message = "Category is required")
    private String category;
}
