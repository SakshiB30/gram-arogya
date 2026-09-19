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

import java.util.ArrayList;
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
            throw new AuthenticationRequiredException(
                    "Please sign in to continue."
            );
        }

        String email = authentication.getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found."
                        )
                );
    }


    // =====================================================
    // GET ACCESSIBLE ASHA IDS
    // =====================================================

    /*
     * ADMIN:
     *     Returns null because ADMIN can access everything.
     *
     * ANM:
     *     Returns IDs of ASHAs supervised by logged-in ANM.
     *
     * ASHA:
     *     Returns only logged-in ASHA ID.
     */
    private List<String> getAccessibleAshaIds(User currentUser) {

        if (currentUser.getRole() == Role.ADMIN) {
            return null;
        }

        if (currentUser.getRole() == Role.ASHA) {
            return List.of(currentUser.getId());
        }

        if (currentUser.getRole() == Role.ANM) {

            return userRepository
                    .findByRoleAndSupervisorId(
                            Role.ASHA,
                            currentUser.getId()
                    )
                    .stream()
                    .map(User::getId)
                    .collect(Collectors.toList());
        }

        return List.of();
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


        // =================================================
        // ADMIN
        // =================================================

        if (currentUser.getRole() == Role.ADMIN) {

            beneficiaries = beneficiaryRepository.count();

            visits = visitRepository.count();

            healthRecords = healthRecordRepository.count();

        }

        // =================================================
        // ASHA / ANM
        // =================================================

        else {

            List<String> ashaIds =
                    getAccessibleAshaIds(currentUser);

            if (ashaIds.isEmpty()) {

                beneficiaries = 0L;
                visits = 0L;
                healthRecords = 0L;

            } else {

                List<Beneficiary> accessibleBeneficiaries =
                        beneficiaryRepository.findByAshaIdIn(ashaIds);

                beneficiaries =
                        accessibleBeneficiaries.size();

                visits =
                        visitRepository
                                .findByUserIdIn(ashaIds)
                                .size();

                List<String> beneficiaryIds =
                        accessibleBeneficiaries
                                .stream()
                                .map(Beneficiary::getId)
                                .collect(Collectors.toList());

                healthRecords = beneficiaryIds.isEmpty()
                        ? 0L
                        : healthRecordRepository
                        .findByBeneficiaryIdIn(
                                beneficiaryIds,
                                Pageable.unpaged()
                        )
                        .getTotalElements();
            }
        }


        // =================================================
        // MEDICINE INVENTORY
        // ADMIN ONLY
        // =================================================

        long medicines = 0L;
        long lowStock = 0L;
        long outOfStock = 0L;

        if (currentUser.getRole() == Role.ADMIN) {

            medicines =
                    medicineRepository.count();

            lowStock =
                    medicineRepository
                            .findByStatus(
                                    MedicineStatus.LOW_STOCK
                            )
                            .size();

            outOfStock =
                    medicineRepository
                            .findByStatus(
                                    MedicineStatus.OUT_OF_STOCK
                            )
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


        // =================================================
        // ADMIN
        // =================================================

        if (currentUser.getRole() == Role.ADMIN) {

            beneficiaries =
                    beneficiaryRepository.findAll();

        }

        // =================================================
        // ASHA / ANM
        // =================================================

        else {

            List<String> ashaIds =
                    getAccessibleAshaIds(currentUser);

            if (ashaIds.isEmpty()) {
                return List.of();
            }

            beneficiaries =
                    beneficiaryRepository
                            .findByAshaIdIn(ashaIds);
        }


        return beneficiaries.stream()
                .map(this::mapBeneficiary)
                .collect(Collectors.toList());
    }


    // =====================================================
    // MAP BENEFICIARY
    // =====================================================

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


        // =================================================
        // ADMIN
        // =================================================

        if (currentUser.getRole() == Role.ADMIN) {

            visits =
                    visitRepository.findAll();

        }

        // =================================================
        // ASHA / ANM
        // =================================================

        else {

            List<String> ashaIds =
                    getAccessibleAshaIds(currentUser);

            if (ashaIds.isEmpty()) {
                return List.of();
            }

            visits =
                    visitRepository
                            .findByUserIdIn(ashaIds);
        }


        return visits.stream()
                .map(this::mapVisit)
                .collect(Collectors.toList());
    }


    // =====================================================
    // MAP VISIT
    // =====================================================

    private VisitReportDto mapVisit(
            Visit visit
    ) {

        String beneficiaryName =
                beneficiaryRepository
                        .findById(visit.getBeneficiaryId())
                        .map(Beneficiary::getName)
                        .orElse("-");


        String ashaWorker =
                visit.getUserId();


        // Display ASHA name instead of user ID

        if (visit.getUserId() != null) {

            ashaWorker =
                    userRepository
                            .findById(visit.getUserId())
                            .map(User::getName)
                            .orElse(
                                    visit.getUserId()
                            );
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


    // =====================================================
    // MAP MEDICINE
    // =====================================================

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


        // =================================================
        // ADMIN
        // =================================================

        if (currentUser.getRole() == Role.ADMIN) {

            records =
                    healthRecordRepository.findAll();

        }

        // =================================================
        // ASHA / ANM
        // =================================================

        else {

            List<String> ashaIds =
                    getAccessibleAshaIds(currentUser);

            if (ashaIds.isEmpty()) {
                return List.of();
            }

            List<Beneficiary> beneficiaries =
                    beneficiaryRepository
                            .findByAshaIdIn(ashaIds);

            List<String> beneficiaryIds =
                    beneficiaries
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
        }


        return records.stream()
                .map(this::mapHealthRecord)
                .collect(Collectors.toList());
    }


    // =====================================================
    // MAP HEALTH RECORD
    // =====================================================

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
                .findByStatus(
                        MedicineStatus.LOW_STOCK
                )
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
                .findByStatus(
                        MedicineStatus.OUT_OF_STOCK
                )
                .stream()
                .map(this::mapMedicine)
                .collect(Collectors.toList());
    }
}