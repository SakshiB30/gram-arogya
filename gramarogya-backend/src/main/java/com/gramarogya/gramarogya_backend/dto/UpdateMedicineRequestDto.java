package com.gramarogya.gramarogya_backend.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class UpdateMedicineRequestDto {

    private String name;

    private String type;

    private String batch;

    private Integer stock;

    private LocalDate expiryDate;

    private String status;

}