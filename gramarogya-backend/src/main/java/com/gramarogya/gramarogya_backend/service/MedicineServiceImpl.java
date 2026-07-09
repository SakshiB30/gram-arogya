package com.gramarogya.gramarogya_backend.service;


import com.gramarogya.gramarogya_backend.dto.CreateMedicineRequestDto;
import com.gramarogya.gramarogya_backend.dto.MedicineResponseDto;
import com.gramarogya.gramarogya_backend.dto.RestockMedicineRequestDto;
import com.gramarogya.gramarogya_backend.dto.UpdateMedicineRequestDto;
import com.gramarogya.gramarogya_backend.entity.Medicine;
import com.gramarogya.gramarogya_backend.mapper.MedicineMapper;
import com.gramarogya.gramarogya_backend.repository.MedicineRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MedicineServiceImpl implements MedicineService{
    private final MedicineRepository medicineRepository;
    private final MedicineMapper medicineMapper;

    @Override
    public List<MedicineResponseDto> getAllMedicines() {
        return medicineRepository.findAll()
                .stream()
                .map(medicineMapper::toResponseDto)
                .toList();
    }

    @Override
    public MedicineResponseDto getMedicineById(String id) {
        Medicine medicine = medicineRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Medicine not found"));

        return medicineMapper.toResponseDto(medicine);
    }

    @Override
    public MedicineResponseDto addMedicine(CreateMedicineRequestDto request) {
        if (medicineRepository.existsByBatch(request.getBatch())) {
            throw new RuntimeException("Batch number already exists.");
        }

        Medicine medicine = medicineMapper.toEntity(request);

        updateStatus(medicine);

        Medicine savedMedicine = medicineRepository.save(medicine);

        return medicineMapper.toResponseDto(savedMedicine);
    }

    @Override
    public MedicineResponseDto updateMedicine(String id, UpdateMedicineRequestDto request) {
        Medicine medicine = medicineRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Medicine not found"));

        if (!medicine.getBatch().equals(request.getBatch())
                && medicineRepository.existsByBatch(request.getBatch())) {

            throw new RuntimeException("Batch number already exists.");
        }

        medicineMapper.updateEntity(request, medicine);

        medicine.setUpdatedAt(LocalDateTime.now());

        updateStatus(medicine);

        Medicine updatedMedicine = medicineRepository.save(medicine);

        return medicineMapper.toResponseDto(updatedMedicine);
    }

    @Override
    public MedicineResponseDto restockMedicine(String id, RestockMedicineRequestDto request) {
        Medicine medicine = medicineRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Medicine not found"));

        if (request.getQuantity() == null || request.getQuantity() <= 0) {
            throw new RuntimeException("Restock quantity must be greater than zero.");
        }

        medicine.setStock(medicine.getStock() + request.getQuantity());

        medicine.setUpdatedAt(LocalDateTime.now());

        updateStatus(medicine);

        Medicine updatedMedicine = medicineRepository.save(medicine);

        return medicineMapper.toResponseDto(updatedMedicine);
    }

    @Override
    public void deleteMedicine(String id) {
        Medicine medicine = medicineRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Medicine not found"));

        medicineRepository.delete(medicine);
    }

    private void updateStatus(Medicine medicine) {

        if (medicine.getStock() == null || medicine.getStock() == 0) {
            medicine.setStatus("Out of Stock");
        } else if (medicine.getStock() <= 50) {
            medicine.setStatus("Low Stock");
        } else {
            medicine.setStatus("Available");
        }
    }
}
