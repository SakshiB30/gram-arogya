package com.gramarogya.gramarogya_backend.service;

import com.gramarogya.gramarogya_backend.dto.BeneficiaryReportDto;
import com.gramarogya.gramarogya_backend.dto.Health_Records.HealthRecordReportDto;
import com.gramarogya.gramarogya_backend.dto.Role;
import com.gramarogya.gramarogya_backend.dto.medicine.InventoryReportDto;
import com.gramarogya.gramarogya_backend.dto.medicine.MedicineStatus;
import com.gramarogya.gramarogya_backend.dto.report.ReportSummaryDto;
import com.gramarogya.gramarogya_backend.dto.visit.VisitReportDto;
import com.gramarogya.gramarogya_backend.entity.Beneficiary;
import com.gramarogya.gramarogya_backend.entity.User;
import com.gramarogya.gramarogya_backend.entity.Visit;
import com.gramarogya.gramarogya_backend.entity.HealthRecord;
import com.gramarogya.gramarogya_backend.entity.medicine.Medicine;
import com.gramarogya.gramarogya_backend.repository.BeneficiaryRepository;
import com.gramarogya.gramarogya_backend.repository.HealthRecordRepository;
import com.gramarogya.gramarogya_backend.repository.UserRepository;
import com.gramarogya.gramarogya_backend.repository.VisitRepository;
import com.gramarogya.gramarogya_backend.repository.medicine.MedicineRepository;
import lombok.RequiredArgsConstructor;
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
            throw new RuntimeException("User is not authenticated");
        }

        String email = authentication.getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found")
                );
    }


    // =====================================================
    // SUMMARY
    // =====================================================

    @Override
    public ReportSummaryDto getSummary(Authentication authentication) {

        User currentUser = getCurrentUser(authentication);

        long beneficiaries;
        long visits;
        long healthRecords;

        /*
         * ADMIN and ANM can see all data.
         * ASHA sees only data created by them.
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
                            org.springframework.data.domain.Pageable.unpaged()
                    )
                    .getTotalElements();

        } else {

            beneficiaries = beneficiaryRepository.count();
            visits = visitRepository.count();
            healthRecords = healthRecordRepository.count();
        }


        /*
         * Medicine inventory is currently global.
         * Therefore all roles receive the same inventory
         * statistics.
         */

        long medicines = medicineRepository.count();

        long lowStock =
                medicineRepository
                        .findByStatus(MedicineStatus.LOW_STOCK)
                        .size();

        long outOfStock =
                medicineRepository
                        .findByStatus(MedicineStatus.OUT_OF_STOCK)
                        .size();


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

        if (currentUser.getRole() == Role.ASHA) {

            beneficiaries =
                    beneficiaryRepository.findByUserId(
                            currentUser.getId()
                    );

        } else {

            /*
             * ADMIN and ANM
             */
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


    private VisitReportDto mapVisit(Visit visit) {

        String beneficiaryName =
                beneficiaryRepository
                        .findById(visit.getBeneficiaryId())
                        .map(Beneficiary::getName)
                        .orElse("-");


        String ashaWorker = visit.getUserId();

        /*
         * Try to display worker name instead of ID.
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
                .beneficiaryName(beneficiaryName)
                .visitType(visit.getVisitType())
                .visitDate(
                        visit.getVisitDate() == null
                                ? ""
                                : visit.getVisitDate().toString()
                )
                .status(visit.getStatus())
                .ashaWorker(ashaWorker)
                .build();
    }


    // =====================================================
    // INVENTORY REPORT
    // =====================================================

    @Override
    public List<InventoryReportDto> getInventoryReport(
            Authentication authentication
    ) {

        getCurrentUser(authentication);

        return medicineRepository.findAll()
                .stream()
                .map(this::mapMedicine)
                .collect(Collectors.toList());
    }


    private InventoryReportDto mapMedicine(Medicine medicine) {

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
                                    org.springframework.data.domain.Pageable.unpaged()
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
    // LOW STOCK
    // =====================================================

    @Override
    public List<InventoryReportDto> getLowStockReport(
            Authentication authentication
    ) {

        getCurrentUser(authentication);

        return medicineRepository
                .findByStatus(MedicineStatus.LOW_STOCK)
                .stream()
                .map(this::mapMedicine)
                .collect(Collectors.toList());
    }


    // =====================================================
    // OUT OF STOCK
    // =====================================================

    @Override
    public List<InventoryReportDto> getOutOfStockReport(
            Authentication authentication
    ) {

        getCurrentUser(authentication);

        return medicineRepository
                .findByStatus(MedicineStatus.OUT_OF_STOCK)
                .stream()
                .map(this::mapMedicine)
                .collect(Collectors.toList());
    }
}