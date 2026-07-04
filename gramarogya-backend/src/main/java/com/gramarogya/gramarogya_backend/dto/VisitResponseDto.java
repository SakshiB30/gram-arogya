package com.gramarogya.gramarogya_backend.dto;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VisitResponseDto {

    private String id;

    private String patientId;

    private LocalDate visitDate;

    private String symptoms;

    private String diagnosis;

    private String medicine;

    private String notes;
}
