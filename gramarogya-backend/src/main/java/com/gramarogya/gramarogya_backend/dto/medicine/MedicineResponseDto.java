package com.gramarogya.gramarogya_backend.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;

@Data
@Builder
public class MedicineResponseDto {

    private String id;

    private String name;

    private String type;

    private String batch;

    private Integer stock;

    private LocalDate expiryDate;

    private String status;

}