package com.gramarogya.gramarogya_backend.service;

import com.gramarogya.gramarogya_backend.dto.medicine.CreateMedicineRequestDto;
import com.gramarogya.gramarogya_backend.dto.medicine.MedicineResponseDto;
import com.gramarogya.gramarogya_backend.dto.stock.RestockMedicineRequestDto;
import com.gramarogya.gramarogya_backend.dto.medicine.UpdateMedicineRequestDto;

import java.util.List;

public interface MedicineService {

    // Get all medicines
    List<MedicineResponseDto> getAllMedicines();

    // Get medicine by ID
    MedicineResponseDto getMedicineById(String id);

    // Add new medicine
    MedicineResponseDto addMedicine(CreateMedicineRequestDto request);

    // Update medicine
    MedicineResponseDto updateMedicine(
            String id,
            UpdateMedicineRequestDto request
    );

    // Restock medicine
    MedicineResponseDto restockMedicine(
            String id,
            RestockMedicineRequestDto request
    );

    // Delete medicine
    void deleteMedicine(String id);
}