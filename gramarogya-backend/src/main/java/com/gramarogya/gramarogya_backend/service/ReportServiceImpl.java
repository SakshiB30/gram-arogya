package com.gramarogya.gramarogya_backend.service;

import com.gramarogya.gramarogya_backend.dto.*;
import com.gramarogya.gramarogya_backend.entity.Beneficiary;
import com.gramarogya.gramarogya_backend.entity.User;
import com.gramarogya.gramarogya_backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;


@RequiredArgsConstructor
@Service
public class ReportServiceImpl implements ReportService{

    private final BeneficiaryRepository beneficiaryRepository;
    private final VisitRepository visitRepository;
    private final MedicineRepository medicineRepository;
    private final HealthRecordRepository healthRecordRepository;
    private final UserRepository userRepository;

    private User getCurrentUser() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @Override
    public ReportSummaryDto getSummary() {
        long beneficiaries = beneficiaryRepository.count();
        long visits = visitRepository.count();
        long medicines = medicineRepository.count();
        long healthRecords = healthRecordRepository.count();

        long lowStock = medicineRepository
                .findByStatus("Low Stock")
                .size();

        long outOfStock = medicineRepository
                .findByStatus("Out of Stock")
                .size();

        return ReportSummaryDto.builder()
                .totalBeneficiaries(beneficiaries)
                .totalVisits(visits)
                .totalMedicines(medicines)
                .totalHealthRecords(healthRecords)
                .lowStockMedicines(lowStock)
                .outOfStockMedicines(outOfStock)
                .build();
    }

    @Override
    public List<BeneficiaryReportDto> getBeneficiaryReport() {

        User currentUser = getCurrentUser();

        List<Beneficiary> beneficiaries;

        if (currentUser.getRole() == Role.ADMIN) {

            beneficiaries = beneficiaryRepository.findAll();

        } else if (currentUser.getRole() == Role.ANM) {

            // For now ANM can see all beneficiaries.
            beneficiaries = beneficiaryRepository.findAll();

        } else {

            // ASHA sees only beneficiaries created by them
            beneficiaries = beneficiaryRepository.findByUserId(currentUser.getId());

        }

        return beneficiaries.stream()
                .map(b -> BeneficiaryReportDto.builder()
                        .id(b.getId())
                        .name(b.getName())
                        .age(b.getAge())
                        .gender(b.getGender())
                        .village(b.getVillage())
                        .category(b.getCategory())
                        .mobileNumber(b.getPhone())
                        .build())
                .collect(Collectors.toList());
    }

    @Override
    public List<VisitReportDto> getVisitReport() {

        return visitRepository.findAll()
                .stream()
                .map(v -> {

                    String beneficiaryName = beneficiaryRepository
                            .findById(v.getBeneficiaryId())
                            .map(Beneficiary::getName)
                            .orElse("-");

                    return VisitReportDto.builder()
                            .id(v.getId())
                            .beneficiaryName(beneficiaryName)
                            .visitType(v.getVisitType())
                            .visitDate(
                                    v.getVisitDate() == null
                                            ? ""
                                            : v.getVisitDate().toString()
                            )
                            .status(v.getStatus())
                            .ashaWorker(v.getUserId())
                            .build();
                })
                .collect(Collectors.toList());
    }


    @Override
    public List<InventoryReportDto> getInventoryReport() {

        return medicineRepository.findAll()
                .stream()
                .map(m -> InventoryReportDto.builder()
                        .id(m.getId())
                        .name(m.getName())
                        .type(m.getType())
                        .batch(m.getBatch())
                        .stock(m.getStock())
                        .expiryDate(
                                m.getExpiryDate() == null
                                        ? ""
                                        : m.getExpiryDate().toString()
                        )
                        .status(m.getStatus())
                        .build())
                .collect(Collectors.toList());
    }

    @Override
    public List<HealthRecordReportDto> getHealthRecordReport() {

        return healthRecordRepository.findAll()
                .stream()
                .map(record -> {

                    String beneficiaryName = beneficiaryRepository
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
                })
                .collect(Collectors.toList());
    }

    @Override
    public List<InventoryReportDto> getLowStockReport() {

        return medicineRepository.findByStatus("Low Stock")
                .stream()
                .map(m -> InventoryReportDto.builder()
                        .id(m.getId())
                        .name(m.getName())
                        .type(m.getType())
                        .batch(m.getBatch())
                        .stock(m.getStock())
                        .expiryDate(
                                m.getExpiryDate() == null
                                        ? ""
                                        : m.getExpiryDate().toString()
                        )
                        .status(m.getStatus())
                        .build())
                .collect(Collectors.toList());
    }

    @Override
    public List<InventoryReportDto> getOutOfStockReport() {

        return medicineRepository.findByStatus("Out of Stock")
                .stream()
                .map(m -> InventoryReportDto.builder()
                        .id(m.getId())
                        .name(m.getName())
                        .type(m.getType())
                        .batch(m.getBatch())
                        .stock(m.getStock())
                        .expiryDate(
                                m.getExpiryDate() == null
                                        ? ""
                                        : m.getExpiryDate().toString()
                        )
                        .status(m.getStatus())
                        .build())
                .collect(Collectors.toList());
    }
}