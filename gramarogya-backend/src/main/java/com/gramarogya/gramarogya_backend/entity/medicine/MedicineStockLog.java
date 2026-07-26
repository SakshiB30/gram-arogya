package com.gramarogya.gramarogya_backend.entity.medicine;

import com.gramarogya.gramarogya_backend.dto.medicine.StockAction;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder

@Document(collection = "medicine_stock_logs")
public class MedicineStockLog {

    @Id
    private String id;

    // Medicine ID
    private String medicineId;

    // Medicine Name (stored for history)
    private String medicineName;

    // ADD
    // UPDATE
    // RESTOCK
    // DELETE
    private StockAction action;

    // Stock before action
    private Integer previousStock;

    // Stock after action
    private Integer updatedStock;

    // Quantity changed
    private Integer quantityChanged;

    // Logged in user's email
    private String performedBy;

    private LocalDateTime performedAt;
}