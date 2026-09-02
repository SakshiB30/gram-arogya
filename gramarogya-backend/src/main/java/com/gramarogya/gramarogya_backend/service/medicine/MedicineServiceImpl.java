package com.gramarogya.gramarogya_backend.service.medicine;

import com.gramarogya.gramarogya_backend.dto.medicine.CreateMedicineRequestDto;
import com.gramarogya.gramarogya_backend.dto.medicine.MedicineResponseDto;
import com.gramarogya.gramarogya_backend.dto.medicine.MedicineStatus;
import com.gramarogya.gramarogya_backend.dto.medicine.ReceiveMedicineRequestDto;
import com.gramarogya.gramarogya_backend.dto.medicine.StockAction;
import com.gramarogya.gramarogya_backend.dto.medicine.UpdateMedicineRequestDto;
import com.gramarogya.gramarogya_backend.entity.User;
import com.gramarogya.gramarogya_backend.entity.medicine.Medicine;
import com.gramarogya.gramarogya_backend.exception.ResourceNotFoundException;
import com.gramarogya.gramarogya_backend.mapper.medicine.MedicineMapper;
import com.gramarogya.gramarogya_backend.repository.UserRepository;
import com.gramarogya.gramarogya_backend.repository.medicine.MedicineRepository;
import com.gramarogya.gramarogya_backend.service.ActivityService;
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
    private final ActivityService activityService;
    private final UserRepository userRepository;


    // =====================================================
    // CURRENT USER
    // =====================================================

    private User getCurrentUser(Authentication authentication) {

        String email = authentication.getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found")
                );
    }


    // =====================================================
    // VIEW INVENTORY
    // ADMIN ONLY
    // =====================================================

    @Override
    @PreAuthorize("hasRole('ADMIN')")
    public List<MedicineResponseDto> getAllMedicines(
            Authentication authentication) {

        return medicineRepository.findAll()
                .stream()
                .map(medicineMapper::toResponseDto)
                .toList();
    }


    @Override
    @PreAuthorize("hasRole('ADMIN')")
    public MedicineResponseDto getMedicineById(
            String id,
            Authentication authentication) {

        return medicineMapper.toResponseDto(
                findMedicine(id)
        );
    }


    // =====================================================
    // ADD MEDICINE
    // ADMIN ONLY
    // =====================================================

    @Override
    @PreAuthorize("hasRole('ADMIN')")
    public MedicineResponseDto addMedicine(
            CreateMedicineRequestDto request,
            Authentication authentication) {

        User currentUser = getCurrentUser(authentication);

        validateBatch(request.getBatch());

        Medicine medicine = medicineMapper.toEntity(request);

        if (medicine.getStock() == null) {
            medicine.setStock(0);
        }

        medicine.setCreatedAt(LocalDateTime.now());
        medicine.setUpdatedAt(LocalDateTime.now());

        updateMedicineStatus(medicine);

        Medicine savedMedicine =
                medicineRepository.save(medicine);


        // =================================================
        // STOCK HISTORY
        // =================================================

        medicineStockLogService.logMedicineAction(
                savedMedicine,
                StockAction.ADD,
                0,
                savedMedicine.getStock(),
                savedMedicine.getStock(),
                authentication.getName()
        );


        // =================================================
        // ACTIVITY LOG
        // =================================================

        activityService.log(
                currentUser,
                "CREATE",
                "Medicine Added",
                savedMedicine.getName()
                        + " • Stock: "
                        + savedMedicine.getStock(),
                "MEDICINE",
                savedMedicine.getId(),
                "Medicine"
        );

        return medicineMapper.toResponseDto(savedMedicine);
    }


    // =====================================================
    // UPDATE MEDICINE
    // ADMIN ONLY
    // =====================================================

    @Override
    @PreAuthorize("hasRole('ADMIN')")
    public MedicineResponseDto updateMedicine(
            String id,
            UpdateMedicineRequestDto request,
            Authentication authentication) {

        User currentUser = getCurrentUser(authentication);

        Medicine medicine = findMedicine(id);

        Integer previousStock =
                medicine.getStock() == null
                        ? 0
                        : medicine.getStock();

        validateBatchForUpdate(
                medicine,
                request.getBatch()
        );

        medicineMapper.updateEntity(
                request,
                medicine
        );

        if (medicine.getStock() == null) {
            medicine.setStock(0);
        }

        medicine.setUpdatedAt(LocalDateTime.now());

        updateMedicineStatus(medicine);

        Medicine updatedMedicine =
                medicineRepository.save(medicine);


        // =================================================
        // STOCK HISTORY
        // =================================================

        Integer updatedStock =
                updatedMedicine.getStock();

        Integer quantityChanged =
                updatedStock - previousStock;

        medicineStockLogService.logMedicineAction(
                updatedMedicine,
                StockAction.UPDATE,
                previousStock,
                updatedStock,
                quantityChanged,
                authentication.getName()
        );


        // =================================================
        // ACTIVITY LOG
        // =================================================

        activityService.log(
                currentUser,
                "UPDATE",
                "Medicine Updated",
                updatedMedicine.getName()
                        + " • Stock: "
                        + updatedMedicine.getStock(),
                "MEDICINE",
                updatedMedicine.getId(),
                "Medicine"
        );

        return medicineMapper.toResponseDto(updatedMedicine);
    }


    // =====================================================
    // RECEIVE STOCK
    // ADMIN ONLY
    // =====================================================

    @Override
    @PreAuthorize("hasRole('ADMIN')")
    public MedicineResponseDto receiveMedicine(
            String id,
            ReceiveMedicineRequestDto request,
            Authentication authentication) {

        User currentUser = getCurrentUser(authentication);

        Medicine medicine = findMedicine(id);

        if (request.getQuantity() == null
                || request.getQuantity() <= 0) {

            throw new IllegalArgumentException(
                    "Quantity must be greater than zero."
            );
        }

        Integer previousStock =
                medicine.getStock() == null
                        ? 0
                        : medicine.getStock();

        medicine.setStock(
                previousStock + request.getQuantity()
        );

        medicine.setUpdatedAt(LocalDateTime.now());

        updateMedicineStatus(medicine);

        Medicine updatedMedicine =
                medicineRepository.save(medicine);


        // =================================================
        // STOCK HISTORY
        // =================================================

        medicineStockLogService.logMedicineAction(
                updatedMedicine,
                StockAction.RECEIVE,
                previousStock,
                updatedMedicine.getStock(),
                request.getQuantity(),
                authentication.getName()
        );


        // =================================================
        // ACTIVITY LOG
        // =================================================

        activityService.log(
                currentUser,
                "UPDATE",
                "Medicine Stock Received",
                updatedMedicine.getName()
                        + " • +"
                        + request.getQuantity()
                        + " units • Stock: "
                        + updatedMedicine.getStock(),
                "MEDICINE",
                updatedMedicine.getId(),
                "Medicine"
        );

        return medicineMapper.toResponseDto(updatedMedicine);
    }


    // =====================================================
    // DELETE MEDICINE
    // ADMIN ONLY
    // =====================================================

    @Override
    @PreAuthorize("hasRole('ADMIN')")
    public void deleteMedicine(
            String id,
            Authentication authentication) {

        User currentUser = getCurrentUser(authentication);

        Medicine medicine = findMedicine(id);

        Integer previousStock =
                medicine.getStock() == null
                        ? 0
                        : medicine.getStock();


        // =================================================
        // STOCK HISTORY
        // =================================================

        medicineStockLogService.logMedicineAction(
                medicine,
                StockAction.DELETE,
                previousStock,
                0,
                previousStock,
                authentication.getName()
        );


        // =================================================
        // ACTIVITY LOG
        // =================================================

        activityService.log(
                currentUser,
                "DELETE",
                "Medicine Deleted",
                medicine.getName()
                        + " • Batch: "
                        + medicine.getBatch(),
                "MEDICINE",
                medicine.getId(),
                "Medicine"
        );

        medicineRepository.delete(medicine);
    }


    // =====================================================
    // FIND MEDICINE
    // =====================================================

    private Medicine findMedicine(String id) {

        return medicineRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Medicine not found."
                        )
                );
    }


    // =====================================================
    // VALIDATE BATCH
    // =====================================================

    private void validateBatch(String batch) {

        if (batch == null || batch.isBlank()) {
            throw new IllegalArgumentException(
                    "Batch is required."
            );
        }

        if (medicineRepository.existsByBatch(batch)) {

            throw new IllegalArgumentException(
                    "Batch already exists."
            );
        }
    }


    private void validateBatchForUpdate(
            Medicine medicine,
            String batch) {

        if (batch == null || batch.isBlank()) {
            throw new IllegalArgumentException(
                    "Batch is required."
            );
        }

        if (!batch.equals(medicine.getBatch())
                && medicineRepository.existsByBatch(batch)) {

            throw new IllegalArgumentException(
                    "Batch already exists."
            );
        }
    }


    // =====================================================
    // UPDATE MEDICINE STATUS
    // =====================================================

    private void updateMedicineStatus(
            Medicine medicine) {

        if (medicine.getExpiryDate() != null
                && medicine.getExpiryDate()
                .isBefore(LocalDate.now())) {

            medicine.setStatus(
                    MedicineStatus.EXPIRED
            );

            return;
        }

        Integer stock =
                medicine.getStock() == null
                        ? 0
                        : medicine.getStock();

        Integer minimumStock =
                medicine.getMinimumStock() == null
                        ? 50
                        : medicine.getMinimumStock();

        if (stock == 0) {

            medicine.setStatus(
                    MedicineStatus.OUT_OF_STOCK
            );

        } else if (stock <= minimumStock) {

            medicine.setStatus(
                    MedicineStatus.LOW_STOCK
            );

        } else {

            medicine.setStatus(
                    MedicineStatus.AVAILABLE
            );
        }
    }
}