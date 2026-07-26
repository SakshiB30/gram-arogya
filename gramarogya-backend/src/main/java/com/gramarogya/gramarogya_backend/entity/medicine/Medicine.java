package com.gramarogya.gramarogya_backend.entity.medicine;

import com.gramarogya.gramarogya_backend.dto.medicine.MedicineStatus;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.time.LocalDateTime;

@NoArgsConstructor
@AllArgsConstructor
@Builder
@Data
@Document(collection = "medicines")
public class Medicine {

    @Id
    private String id;

    // Basic Details
    private String name;

    private String type;

    private String batch;

    private LocalDate expiryDate;

    // Inventory
    private Integer stock;

    private Integer minimumStock;

    // Available / Low Stock / Out of Stock / Expired
    private MedicineStatus status;

    // Role Based
    private String phcId;

    // Audit
    private String createdBy;

    private String updatedBy;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

}