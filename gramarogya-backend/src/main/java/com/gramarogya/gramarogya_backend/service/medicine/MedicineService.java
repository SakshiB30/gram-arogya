package com.gramarogya.gramarogya_backend.service.medicine;

import com.gramarogya.gramarogya_backend.dto.medicine.*;
import org.springframework.security.core.Authentication;

import java.util.List;

public interface MedicineService {

    List<MedicineResponseDto> getAllMedicines(Authentication authentication);

    MedicineResponseDto getMedicineById(
            String id,
            Authentication authentication
    );

    MedicineResponseDto addMedicine(
            CreateMedicineRequestDto request,
            Authentication authentication
    );

    MedicineResponseDto updateMedicine(
            String id,
            UpdateMedicineRequestDto request,
            Authentication authentication
    );

    MedicineResponseDto receiveMedicine(
            String id,
            ReceiveMedicineRequestDto receiveMedicineRequestDto,
            Authentication authentication
    );

    void deleteMedicine(
            String id,
            Authentication authentication
    );

    MedicineResponseDto issueMedicine(
            String id,
            IssueMedicineRequestDto request,
            Authentication authentication
    );
}