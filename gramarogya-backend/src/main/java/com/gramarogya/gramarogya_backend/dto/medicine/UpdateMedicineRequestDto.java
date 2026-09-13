package com.gramarogya.gramarogya_backend.dto.medicine;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class UpdateMedicineRequestDto {

    @NotBlank(message = "Medicine name is required.")
    private String name;

    @NotBlank(message = "Medicine type is required.")
    private String type;

    @NotBlank(message = "Batch is required.")
    private String batch;

    @Min(value = 0, message = "Stock cannot be negative.")
    private Integer stock;

    @NotNull(message = "Expiry date is required.")
    private LocalDate expiryDate;

    @Min(value = 0, message = "Minimum stock cannot be negative.")
    private Integer minimumStock;

}
