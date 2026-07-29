package com.gramarogya.gramarogya_backend.service.medicine;

import com.gramarogya.gramarogya_backend.dto.medicine.IssueMedicineRequestDto;
import com.gramarogya.gramarogya_backend.dto.medicine.MedicineIssueResponseDto;
import org.springframework.security.core.Authentication;

import java.util.List;

public interface MedicineIssueService {
    MedicineIssueResponseDto issueMedicine(
            String id,
            IssueMedicineRequestDto request,
            Authentication authentication
    );

    List<MedicineIssueResponseDto> getAllIssuedMedicines(Authentication authentication);

    List<MedicineIssueResponseDto> getIssuedMedicinesByBeneficiary(
            String beneficiaryId,
            Authentication authentication
    );
}
