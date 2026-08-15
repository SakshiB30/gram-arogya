package com.gramarogya.gramarogya_backend.dto.visit;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class UpdateVisitRequestDto {

    private String visitType;

    private String status;

    private String notes;

    private LocalDate nextVisitDate;
}