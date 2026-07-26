package com.gramarogya.gramarogya_backend.service.medicine;

import com.gramarogya.gramarogya_backend.dto.medicine.IssueMedicineRequestDto;
import com.gramarogya.gramarogya_backend.dto.medicine.MedicineResponseDto;
import org.springframework.security.core.Authentication;

public interface MedicineIssueService {
    MedicineResponseDto issueMedicine(
            String id,
            IssueMedicineRequestDto request,
            Authentication authentication
    );
}
