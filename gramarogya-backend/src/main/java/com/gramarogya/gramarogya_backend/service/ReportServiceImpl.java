package com.gramarogya.gramarogya_backend.service;

import com.gramarogya.gramarogya_backend.dto.BeneficiaryReportDto;
import com.gramarogya.gramarogya_backend.dto.Health_Records.HealthRecordReportDto;
import com.gramarogya.gramarogya_backend.dto.Role;
import com.gramarogya.gramarogya_backend.dto.medicine.InventoryReportDto;
import com.gramarogya.gramarogya_backend.dto.medicine.MedicineStatus;
import com.gramarogya.gramarogya_backend.dto.report.ReportSummaryDto;
import com.gramarogya.gramarogya_backend.dto.report.VisitReportDto;
import com.gramarogya.gramarogya_backend.entity.Beneficiary;
import com.gramarogya.gramarogya_backend.entity.HealthRecord;
import com.gramarogya.gramarogya_backend.entity.User;
import com.gramarogya.gramarogya_backend.entity.Visit;
import com.gramarogya.gramarogya_backend.entity.medicine.Medicine;
import com.gramarogya.gramarogya_backend.exception.AuthenticationRequiredException;
import com.gramarogya.gramarogya_backend.exception.ResourceNotFoundException;
import com.gramarogya.gramarogya_backend.exception.UnauthorizedException;
import com.gramarogya.gramarogya_backend.repository.BeneficiaryRepository;
import com.gramarogya.gramarogya_backend.repository.HealthRecordRepository;
import com.gramarogya.gramarogya_backend.repository.UserRepository;
import com.gramarogya.gramarogya_backend.repository.VisitRepository;
import com.gramarogya.gramarogya_backend.repository.medicine.MedicineRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReportServiceImpl implements ReportService {

    private final BeneficiaryRepository beneficiaryRepository;
    private final VisitRepository visitRepository;
    private final MedicineRepository medicineRepository;
    private final HealthRecordRepository healthRecordRepository;
    private final UserRepository userRepository;


    // =====================================================
    // CURRENT USER
    // =====================================================

    private User getCurrentUser(Authentication authentication) {

        if (authentication == null || !authentication.isAuthenticated()) {
            throw new AuthenticationRequiredException("Please sign in to continue.");
        }

        String email = authentication.getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found.")
                );
    }


    // =====================================================
    // ADMIN CHECK
    // Medicine inventory is ADMIN-only
    // =====================================================

    private void requireAdmin(Authentication authentication) {

        User currentUser = getCurrentUser(authentication);

        if (currentUser.getRole() != Role.ADMIN) {
            throw new UnauthorizedException(
                    "Medicine inventory reports are available only to administrators."
            );
        }
    }


    // =====================================================
    // SUMMARY
    // =====================================================

    @Override
    public ReportSummaryDto getSummary(
            Authentication authentication
    ) {

        User currentUser = getCurrentUser(authentication);

        long beneficiaries;
        long visits;
        long healthRecords;

        /*
         * ADMIN and ANM can see all data.
         * ASHA sees only their own assigned data.
         */

        if (currentUser.getRole() == Role.ASHA) {

            beneficiaries =
                    beneficiaryRepository.countByUserId(
                            currentUser.getId()
                    );

            visits =
                    visitRepository.countByUserId(
                            currentUser.getId()
                    );

            List<String> beneficiaryIds =
                    beneficiaryRepository
                            .findByUserId(currentUser.getId())
                            .stream()
                            .map(Beneficiary::getId)
                            .collect(Collectors.toList());

            healthRecords = beneficiaryIds.isEmpty()
                    ? 0
                    : healthRecordRepository
                    .findByBeneficiaryIdIn(
                            beneficiaryIds,
                            Pageable.unpaged()
                    )
                    .getTotalElements();

        } else {

            beneficiaries = beneficiaryRepository.count();
            visits = visitRepository.count();
            healthRecords = healthRecordRepository.count();
        }


        // =================================================
        // MEDICINE INVENTORY
        // ADMIN ONLY
        // =================================================

        long medicines = 0;
        long lowStock = 0;
        long outOfStock = 0;

        if (currentUser.getRole() == Role.ADMIN) {

            medicines = medicineRepository.count();

            lowStock =
                    medicineRepository
                            .findByStatus(MedicineStatus.LOW_STOCK)
                            .size();

            outOfStock =
                    medicineRepository
                            .findByStatus(MedicineStatus.OUT_OF_STOCK)
                            .size();
        }


        return ReportSummaryDto.builder()
                .totalBeneficiaries(beneficiaries)
                .totalVisits(visits)
                .totalHealthRecords(healthRecords)
                .totalMedicines(medicines)
                .lowStockMedicines(lowStock)
                .outOfStockMedicines(outOfStock)
                .build();
    }


    // =====================================================
    // BENEFICIARY REPORT
    // =====================================================

    @Override
    public List<BeneficiaryReportDto> getBeneficiaryReport(
            Authentication authentication
    ) {

        User currentUser = getCurrentUser(authentication);

        List<Beneficiary> beneficiaries;

        /*
         * ASHA sees only their beneficiaries.
         * ADMIN and ANM see all beneficiaries.
         */

        if (currentUser.getRole() == Role.ASHA) {

            beneficiaries =
                    beneficiaryRepository.findByUserId(
                            currentUser.getId()
                    );

        } else {

            beneficiaries =
                    beneficiaryRepository.findAll();
        }


        return beneficiaries.stream()
                .map(this::mapBeneficiary)
                .collect(Collectors.toList());
    }


    private BeneficiaryReportDto mapBeneficiary(
            Beneficiary beneficiary
    ) {

        return BeneficiaryReportDto.builder()
                .id(beneficiary.getId())
                .name(beneficiary.getName())
                .age(beneficiary.getAge())
                .gender(beneficiary.getGender())
                .village(beneficiary.getVillage())
                .category(beneficiary.getCategory())
                .mobileNumber(beneficiary.getPhone())
                .build();
    }


    // =====================================================
    // VISIT REPORT
    // =====================================================

    @Override
    public List<VisitReportDto> getVisitReport(
            Authentication authentication
    ) {

        User currentUser = getCurrentUser(authentication);

        List<Visit> visits;

        /*
         * ASHA sees only their visits.
         * ADMIN and ANM see all visits.
         */

        if (currentUser.getRole() == Role.ASHA) {

            visits =
                    visitRepository.findByUserId(
                            currentUser.getId()
                    );

        } else {

            visits = visitRepository.findAll();
        }


        return visits.stream()
                .map(this::mapVisit)
                .collect(Collectors.toList());
    }


    private VisitReportDto mapVisit(
            Visit visit
    ) {

        String beneficiaryName =
                beneficiaryRepository
                        .findById(visit.getBeneficiaryId())
                        .map(Beneficiary::getName)
                        .orElse("-");


        String ashaWorker = visit.getUserId();

        /*
         * Display ASHA name instead of user ID.
         */

        if (visit.getUserId() != null) {

            ashaWorker =
                    userRepository
                            .findById(visit.getUserId())
                            .map(User::getName)
                            .orElse(visit.getUserId());
        }


        return VisitReportDto.builder()
                .id(visit.getId())
                .beneficiaryId(visit.getBeneficiaryId())
                .beneficiaryName(beneficiaryName)
                .visitDate(visit.getVisitDate())
                .visitType(visit.getVisitType())
                .status(visit.getStatus())
                .notes(visit.getNotes())
                .nextVisitDate(visit.getNextVisitDate())
                .ashaWorker(ashaWorker)
                .build();
    }


    // =====================================================
    // INVENTORY REPORT
    // ADMIN ONLY
    // =====================================================

    @Override
    public List<InventoryReportDto> getInventoryReport(
            Authentication authentication
    ) {

        requireAdmin(authentication);

        return medicineRepository.findAll()
                .stream()
                .map(this::mapMedicine)
                .collect(Collectors.toList());
    }


    private InventoryReportDto mapMedicine(
            Medicine medicine
    ) {

        return InventoryReportDto.builder()
                .id(medicine.getId())
                .name(medicine.getName())
                .type(medicine.getType())
                .batch(medicine.getBatch())
                .stock(medicine.getStock())
                .status(medicine.getStatus())
                .expiryDate(
                        medicine.getExpiryDate() == null
                                ? ""
                                : medicine.getExpiryDate().toString()
                )
                .build();
    }


    // =====================================================
    // HEALTH RECORD REPORT
    // =====================================================

    @Override
    public List<HealthRecordReportDto> getHealthRecordReport(
            Authentication authentication
    ) {

        User currentUser = getCurrentUser(authentication);

        List<HealthRecord> records;

        /*
         * ASHA sees health records of their beneficiaries.
         * ADMIN and ANM see all health records.
         */

        if (currentUser.getRole() == Role.ASHA) {

            List<String> beneficiaryIds =
                    beneficiaryRepository
                            .findByUserId(currentUser.getId())
                            .stream()
                            .map(Beneficiary::getId)
                            .collect(Collectors.toList());

            if (beneficiaryIds.isEmpty()) {
                return List.of();
            }

            records =
                    healthRecordRepository
                            .findByBeneficiaryIdIn(
                                    beneficiaryIds,
                                    Pageable.unpaged()
                            )
                            .getContent();

        } else {

            records = healthRecordRepository.findAll();
        }


        return records.stream()
                .map(this::mapHealthRecord)
                .collect(Collectors.toList());
    }


    private HealthRecordReportDto mapHealthRecord(
            HealthRecord record
    ) {

        String beneficiaryName =
                beneficiaryRepository
                        .findById(record.getBeneficiaryId())
                        .map(Beneficiary::getName)
                        .orElse("-");


        return HealthRecordReportDto.builder()
                .id(record.getId())
                .beneficiaryName(beneficiaryName)
                .bloodPressure(record.getBloodPressure())
                .weight(record.getWeight())
                .temperature(record.getTemperature())
                .hemoglobin(record.getHemoglobin())
                .diagnosis(record.getDiagnosis())
                .prescription(record.getPrescription())
                .notes(record.getNotes())
                .createdAt(
                        record.getCreatedAt() == null
                                ? ""
                                : record.getCreatedAt().toString()
                )
                .build();
    }


    // =====================================================
    // LOW STOCK REPORT
    // ADMIN ONLY
    // =====================================================

    @Override
    public List<InventoryReportDto> getLowStockReport(
            Authentication authentication
    ) {

        requireAdmin(authentication);

        return medicineRepository
                .findByStatus(MedicineStatus.LOW_STOCK)
                .stream()
                .map(this::mapMedicine)
                .collect(Collectors.toList());
    }


    // =====================================================
    // OUT OF STOCK REPORT
    // ADMIN ONLY
    // =====================================================

    @Override
    public List<InventoryReportDto> getOutOfStockReport(
            Authentication authentication
    ) {

        requireAdmin(authentication);

        return medicineRepository
                .findByStatus(MedicineStatus.OUT_OF_STOCK)
                .stream()
                .map(this::mapMedicine)
                .collect(Collectors.toList());
    }
}
