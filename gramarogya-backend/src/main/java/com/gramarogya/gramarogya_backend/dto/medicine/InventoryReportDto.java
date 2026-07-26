package com.gramarogya.gramarogya_backend.dto.medicine;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InventoryReportDto {

    private String id;

    private String name;

    private String type;

    private String batch;

    private Integer stock;

    private MedicineStatus status;

    private String expiryDate;
}