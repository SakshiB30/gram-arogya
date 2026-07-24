package com.gramarogya.gramarogya_backend.entity;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder

@Document(collection = "medicines")
public class Medicine {

    @Id
    private String id;

    private String name;

    private String type;

    private String batch;

    private Integer stock;

    private LocalDate expiryDate;

    private String status;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}