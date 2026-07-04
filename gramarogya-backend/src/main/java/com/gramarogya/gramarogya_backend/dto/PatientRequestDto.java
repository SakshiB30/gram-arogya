package com.gramarogya.gramarogya_backend.dto;


import com.gramarogya.gramarogya_backend.entity.Patient;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PatientRequestDto {


    @NotBlank(message = "Full name is required")
    private String name;

    @NotNull(message = "Age is required")
    private Integer age;

    @NotBlank(message = "Gender is required")
    private String gender;

    @NotBlank(message = "Village is required")
    private String village;

    @NotBlank(message = "Mobile number is required")
    private String mobile;

    @NotBlank(message = "Health category is required")
    private String healthCategory;


    private LocalDateTime createdAt;

    public Patient toEntity() {
        return new Patient(null, this.name, this.age, this.gender, this.mobile, this.village, this.healthCategory, this.createdAt);
    }
}
