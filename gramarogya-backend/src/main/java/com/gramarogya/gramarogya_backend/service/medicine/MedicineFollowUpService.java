package com.gramarogya.gramarogya_backend.service.medicine;

import com.gramarogya.gramarogya_backend.dto.medicine.CreateMedicineFollowUpRequestDto;
import com.gramarogya.gramarogya_backend.dto.medicine.MedicineFollowUpResponseDto;
import org.springframework.security.core.Authentication;

import java.util.List;

public interface MedicineFollowUpService {

    MedicineFollowUpResponseDto createFollowUp(
            CreateMedicineFollowUpRequestDto request,
            Authentication authentication
    );

    List<MedicineFollowUpResponseDto> getFollowUpsByBeneficiary(
            String beneficiaryId,
            Authentication authentication
    );

    List<MedicineFollowUpResponseDto> getFollowUpsByVisit(
            String visitId,
            Authentication authentication
    );

    MedicineFollowUpResponseDto getFollowUpById(
            String id,
            Authentication authentication
    );
}