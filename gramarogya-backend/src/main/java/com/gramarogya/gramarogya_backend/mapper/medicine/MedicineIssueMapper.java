package com.gramarogya.gramarogya_backend.mapper.medicine;

import com.gramarogya.gramarogya_backend.dto.medicine.MedicineIssueResponseDto;
import com.gramarogya.gramarogya_backend.entity.medicine.MedicineIssue;
import org.springframework.stereotype.Component;

@Component
public class MedicineIssueMapper {
    public MedicineIssueResponseDto toResponseDto(MedicineIssue issue) {

        return MedicineIssueResponseDto.builder()
                .id(issue.getId())
                .medicineId(issue.getMedicineId())
                .medicineName(issue.getMedicineName())
                .beneficiaryId(issue.getBeneficiaryId())
                .beneficiaryName(issue.getBeneficiaryName())
                .quantity(issue.getQuantity())
                .reason(issue.getReason())
                .issuedBy(issue.getIssuedBy())
                .issuedByRole(issue.getIssuedByRole())
                .issuedAt(issue.getIssuedAt())
                .build();
    }
}
