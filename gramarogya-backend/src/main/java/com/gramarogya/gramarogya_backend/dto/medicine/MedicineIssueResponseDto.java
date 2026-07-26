package com.gramarogya.gramarogya_backend.dto.medicine;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class MedicineIssueResponseDto {

    private String id;

    private String medicineId;

    private String medicineName;

    private String beneficiaryId;

    private String beneficiaryName;

    private Integer quantity;

    private String reason;

    private String issuedBy;

    private String issuedByRole;

    private LocalDateTime issuedAt;
}
