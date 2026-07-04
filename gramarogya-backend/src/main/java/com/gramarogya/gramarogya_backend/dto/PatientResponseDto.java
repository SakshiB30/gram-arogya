package com.gramarogya.gramarogya_backend.dto;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PatientResponseDto {
    private String id;

    private String fullName;

    private Integer age;

    private String gender;

    private String village;

    private String mobileNumber;

    private String healthCategory;

    private LocalDateTime createdAt;
}
