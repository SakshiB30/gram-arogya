package com.gramarogya.gramarogya_backend.dto.dashboard;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MedicineAlertDto {

    private String id;

    private String name;

    private String batch;

    private Integer stock;

    private String status;
}