package com.gramarogya.gramarogya_backend.dto.medicine;

import lombok.Data;

import java.time.LocalDate;

@Data
public class CreateMedicineRequestDto {

    private String name;

    private String type;

    private String batch;

    private Integer stock;

    private LocalDate expiryDate;

    private Integer minimumStock;

}