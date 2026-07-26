package com.gramarogya.gramarogya_backend.service.medicine;

import com.gramarogya.gramarogya_backend.dto.medicine.*;
import com.gramarogya.gramarogya_backend.entity.medicine.Medicine;
import com.gramarogya.gramarogya_backend.mapper.medicine.MedicineMapper;
import com.gramarogya.gramarogya_backend.repository.medicine.MedicineRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MedicineServiceImpl implements MedicineService {

    private final MedicineRepository medicineRepository;
    private final MedicineMapper medicineMapper;
    private final MedicineStockLogService medicineStockLogService;

    // =====================================================
    // View Inventory
    // =====================================================

    @Override
    @PreAuthorize("hasAnyRole('ADMIN','ASHA','ANM')")
    public List<MedicineResponseDto> getAllMedicines(Authentication authentication) {

        return medicineRepository.findAll()
                .stream()
                .map(medicineMapper::toResponseDto)
                .toList();
    }

    @Override
    @PreAuthorize("hasAnyRole('ADMIN','ASHA','ANM')")
    public MedicineResponseDto getMedicineById(
            String id,
            Authentication authentication) {

        return medicineMapper.toResponseDto(findMedicine(id));
    }

    // =====================================================
    // Add Medicine
    // =====================================================

    @Override
    @PreAuthorize("hasAnyRole('ADMIN','ANM')")
    public MedicineResponseDto addMedicine(
            CreateMedicineRequestDto request,
            Authentication authentication) {

        validateBatch(request.getBatch());

        Medicine medicine = medicineMapper.toEntity(request);

        medicine.setCreatedAt(LocalDateTime.now());
        medicine.setUpdatedAt(LocalDateTime.now());

        updateMedicineStatus(medicine);

        Medicine savedMedicine = medicineRepository.save(medicine);

        medicineStockLogService.logMedicineAction(
                savedMedicine,
                StockAction.ADD,
                0,
                savedMedicine.getStock(),
                savedMedicine.getStock(),
                authentication.getName()
        );

        return medicineMapper.toResponseDto(savedMedicine);
    }

    // =====================================================
    // Update Medicine
    // =====================================================

    @Override
    @PreAuthorize("hasAnyRole('ADMIN','ANM')")
    public MedicineResponseDto updateMedicine(
            String id,
            UpdateMedicineRequestDto request,
            Authentication authentication) {

        Medicine medicine = findMedicine(id);

        Integer previousStock = medicine.getStock();

        validateBatchForUpdate(medicine, request.getBatch());

        medicineMapper.updateEntity(request, medicine);

        medicine.setUpdatedAt(LocalDateTime.now());

        updateMedicineStatus(medicine);

        Medicine updatedMedicine = medicineRepository.save(medicine);

        medicineStockLogService.logMedicineAction(
                updatedMedicine,
                StockAction.UPDATE,
                previousStock,
                updatedMedicine.getStock(),
                updatedMedicine.getStock() - previousStock,
                authentication.getName()
        );

        return medicineMapper.toResponseDto(updatedMedicine);
    }

    // =====================================================
    // Receive Stock
    // =====================================================

    @Override
    @PreAuthorize("hasAnyRole('ADMIN','ANM')")
    public MedicineResponseDto receiveMedicine(
            String id,
            ReceiveMedicineRequestDto request,
            Authentication authentication) {

        Medicine medicine = findMedicine(id);

        if (request.getQuantity() == null || request.getQuantity() <= 0) {
            throw new RuntimeException("Quantity must be greater than zero.");
        }

        Integer previousStock = medicine.getStock();

        medicine.setStock(previousStock + request.getQuantity());
        medicine.setUpdatedAt(LocalDateTime.now());

        updateMedicineStatus(medicine);

        Medicine updatedMedicine = medicineRepository.save(medicine);

        medicineStockLogService.logMedicineAction(
                updatedMedicine,
                StockAction.RECEIVE,
                previousStock,
                updatedMedicine.getStock(),
                request.getQuantity(),
                authentication.getName()
        );

        return medicineMapper.toResponseDto(updatedMedicine);
    }

    // =====================================================
    // Delete Medicine
    // =====================================================

    @Override
    @PreAuthorize("hasRole('ADMIN')")
    public void deleteMedicine(
            String id,
            Authentication authentication) {

        Medicine medicine = findMedicine(id);

        medicineStockLogService.logMedicineAction(
                medicine,
                StockAction.DELETE,
                medicine.getStock(),
                0,
                medicine.getStock(),
                authentication.getName()
        );

        medicineRepository.delete(medicine);
    }

    @Override
    @PreAuthorize("hasAnyRole('ADMIN','ANM')")
    public MedicineResponseDto issueMedicine(
            String id,
            IssueMedicineRequestDto request,
            Authentication authentication) {

        Medicine medicine = findMedicine(id);

        Integer previousStock = medicine.getStock();

        if (request.getQuantity() == null || request.getQuantity() <= 0) {
            throw new RuntimeException("Issue quantity must be greater than zero.");
        }

        if (previousStock < request.getQuantity()) {
            throw new RuntimeException("Insufficient stock available.");
        }

        medicine.setStock(previousStock - request.getQuantity());

        medicine.setUpdatedAt(LocalDateTime.now());

        updateMedicineStatus(medicine);

        Medicine updatedMedicine = medicineRepository.save(medicine);

        medicineStockLogService.logMedicineAction(
                updatedMedicine,
                StockAction.ISSUE,
                previousStock,
                updatedMedicine.getStock(),
                request.getQuantity(),
                authentication.getName()
        );

        return medicineMapper.toResponseDto(updatedMedicine);
    }
    // =====================================================
    // Helper Methods
    // =====================================================

    private Medicine findMedicine(String id) {

        return medicineRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Medicine not found."));
    }

    private void validateBatch(String batch) {

        if (medicineRepository.existsByBatch(batch)) {
            throw new RuntimeException("Batch already exists.");
        }
    }

    private void validateBatchForUpdate(
            Medicine medicine,
            String batch) {

        if (!medicine.getBatch().equals(batch)
                && medicineRepository.existsByBatch(batch)) {

            throw new RuntimeException("Batch already exists.");
        }
    }

    /**
     * Automatically determines medicine status.
     */
    private void updateMedicineStatus(Medicine medicine) {

        if (medicine.getExpiryDate() != null &&
                medicine.getExpiryDate().isBefore(LocalDate.now())) {

            medicine.setStatus(MedicineStatus.EXPIRED);
            return;
        }

        Integer stock = medicine.getStock() == null ? 0 : medicine.getStock();

        Integer minimumStock = medicine.getMinimumStock() == null
                ? 50
                : medicine.getMinimumStock();

        if (stock == 0) {

            medicine.setStatus(MedicineStatus.OUT_OF_STOCK);

        } else if (stock <= minimumStock) {

            medicine.setStatus(MedicineStatus.LOW_STOCK);

        } else {

            medicine.setStatus(MedicineStatus.AVAILABLE);
        }
    }

}