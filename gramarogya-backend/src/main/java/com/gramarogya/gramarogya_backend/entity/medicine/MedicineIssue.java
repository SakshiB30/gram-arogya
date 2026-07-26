package com.gramarogya.gramarogya_backend.entity.medicine;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
@Document(collection = "medicine_issue")
public class MedicineIssue {
    @Id
    private String id;

    private String visitId;

    // Medicine Details
    private String medicineId;
    private String medicineName;

    // Beneficiary
    private String beneficiaryId;
    private String beneficiaryName;

    // Quantity
    private Integer quantity;

    // Why medicine was given
    private String reason;

    // Who issued it
    private String issuedBy;

    // ASHA / ANM
    private String issuedByRole;

    // Audit
    private LocalDateTime issuedAt;
}
