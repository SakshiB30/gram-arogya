package com.gramarogya.gramarogya_backend.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateVisitRequestDto {

    private String visitType;

    private String status;

    private String notes;
}