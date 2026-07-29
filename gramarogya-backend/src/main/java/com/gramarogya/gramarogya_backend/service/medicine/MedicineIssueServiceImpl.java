package com.gramarogya.gramarogya_backend.service.medicine;

import com.gramarogya.gramarogya_backend.dto.medicine.IssueMedicineRequestDto;
import com.gramarogya.gramarogya_backend.dto.medicine.MedicineIssueResponseDto;
import com.gramarogya.gramarogya_backend.dto.medicine.MedicineStatus;
import com.gramarogya.gramarogya_backend.dto.medicine.StockAction;
import com.gramarogya.gramarogya_backend.entity.Beneficiary;
import com.gramarogya.gramarogya_backend.entity.medicine.Medicine;
import com.gramarogya.gramarogya_backend.entity.medicine.MedicineIssue;
import com.gramarogya.gramarogya_backend.mapper.medicine.MedicineIssueMapper;
import com.gramarogya.gramarogya_backend.repository.BeneficiaryRepository;
import com.gramarogya.gramarogya_backend.repository.medicine.MedicineIssueRepository;
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
public class MedicineIssueServiceImpl implements MedicineIssueService{

    private final MedicineRepository medicineRepository;

    private final BeneficiaryRepository beneficiaryRepository;

    private final MedicineIssueRepository medicineIssueRepository;

    private final MedicineIssueMapper medicineIssueMapper;

    private final MedicineStockLogService medicineStockLogService;

    @Override
    @PreAuthorize("hasAnyRole('ADMIN','ANM','ASHA')")
    public MedicineIssueResponseDto issueMedicine(
            String id,
            IssueMedicineRequestDto request,
            Authentication authentication) {

        Medicine medicine = medicineRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Medicine not found"));

        Beneficiary beneficiary = beneficiaryRepository
                .findById(request.getBeneficiaryId())
                .orElseThrow(() ->
                        new RuntimeException("Beneficiary not found"));

        validateIssueQuantity(medicine, request.getQuantity());

        Integer previousStock = medicine.getStock();

        medicine.setStock(previousStock - request.getQuantity());

        updateMedicineStatus(medicine);

        medicine.setUpdatedAt(LocalDateTime.now());

        Medicine updatedMedicine = medicineRepository.save(medicine);

        MedicineIssue issue = MedicineIssue.builder()
                .medicineId(updatedMedicine.getId())
                .medicineName(updatedMedicine.getName())
                .beneficiaryId(beneficiary.getId())
                .beneficiaryName(beneficiary.getName())
                .quantity(request.getQuantity())
                .reason(request.getReason())
                .issuedBy(authentication.getName())
                .issuedByRole(authentication.getAuthorities()
                        .iterator()
                        .next()
                        .getAuthority())
                .issuedAt(LocalDateTime.now())
                .build();

        MedicineIssue savedIssue =
                medicineIssueRepository.save(issue);

        medicineStockLogService.logMedicineAction(
                updatedMedicine,
                StockAction.ISSUE,
                previousStock,
                updatedMedicine.getStock(),
                request.getQuantity(),
                authentication.getName()
        );

        return medicineIssueMapper.toResponseDto(savedIssue);
    }

    @Override
    @PreAuthorize("hasAnyRole('ADMIN','ANM')")
    public List<MedicineIssueResponseDto> getAllIssuedMedicines(
            Authentication authentication) {

        return medicineIssueRepository
                .findAllByOrderByIssuedAtDesc()
                .stream()
                .map(medicineIssueMapper::toResponseDto)
                .toList();
    }

    @Override
    @PreAuthorize("hasAnyRole('ADMIN','ANM','ASHA')")
    public List<MedicineIssueResponseDto> getIssuedMedicinesByBeneficiary(
            String beneficiaryId,
            Authentication authentication) {

        beneficiaryRepository.findById(beneficiaryId)
                .orElseThrow(() ->
                        new RuntimeException("Beneficiary not found"));

        return medicineIssueRepository
                .findByBeneficiaryIdOrderByIssuedAtDesc(beneficiaryId)
                .stream()
                .map(medicineIssueMapper::toResponseDto)
                .toList();
    }


    private void validateIssueQuantity(
            Medicine medicine,
            Integer quantity) {

        if (quantity == null || quantity <= 0) {
            throw new RuntimeException("Quantity must be greater than zero.");
        }

        if (medicine.getStock() < quantity) {
            throw new RuntimeException("Insufficient stock available.");
        }
    }

    private void updateMedicineStatus(Medicine medicine) {

        if (medicine.getExpiryDate() != null &&
                medicine.getExpiryDate().isBefore(LocalDate.now())) {

            medicine.setStatus(MedicineStatus.EXPIRED);
            return;
        }

        Integer stock = medicine.getStock() == null
                ? 0
                : medicine.getStock();

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

