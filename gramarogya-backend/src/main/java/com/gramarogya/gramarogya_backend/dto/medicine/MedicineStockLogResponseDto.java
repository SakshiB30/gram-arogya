package com.gramarogya.gramarogya_backend.dto.medicine;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MedicineStockLogResponseDto {
    private String id;

    private String medicineId;

    private String medicineName;

    // ADD, UPDATE, RESTOCK, DELETE
    private StockAction action;

    // Stock before the action
    private Integer previousStock;

    // Stock after the action
    private Integer updatedStock;

    // Quantity added/removed
    private Integer quantityChanged;

    // User who performed the action
    private String performedBy;

    // Date & Time of action
    private LocalDateTime performedAt;
}

