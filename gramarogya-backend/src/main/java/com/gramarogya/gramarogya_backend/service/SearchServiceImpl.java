package com.gramarogya.gramarogya_backend.service;

import com.gramarogya.gramarogya_backend.dto.SearchResultDto;
import com.gramarogya.gramarogya_backend.entity.Beneficiary;
import com.gramarogya.gramarogya_backend.entity.User;
import com.gramarogya.gramarogya_backend.repository.BeneficiaryRepository;
import com.gramarogya.gramarogya_backend.repository.HealthRecordRepository;
import com.gramarogya.gramarogya_backend.repository.UserRepository;
import com.gramarogya.gramarogya_backend.repository.VisitRepository;
import com.gramarogya.gramarogya_backend.repository.medicine.MedicineRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SearchServiceImpl implements SearchService {

    private final BeneficiaryRepository beneficiaryRepository;
    private final VisitRepository visitRepository;
    private final HealthRecordRepository healthRecordRepository;
    private final MedicineRepository medicineRepository;
    private final UserRepository userRepository;


    // =====================================================
    // CURRENT USER
    // =====================================================

    private User getCurrentUser(
            Authentication authentication) {

        return userRepository
                .findByEmail(authentication.getName())
                .orElseThrow(() ->
                        new RuntimeException("User not found")
                );
    }


    // =====================================================
    // SEARCH
    // =====================================================

    @Override
    public List<SearchResultDto> search(
            Authentication authentication,
            String keyword) {

        User user =
                getCurrentUser(authentication);

        List<SearchResultDto> results =
                new ArrayList<>();


        // =================================================
        // BENEFICIARIES
        // =================================================

        beneficiaryRepository
                .findByUserIdAndNameContainingIgnoreCase(
                        user.getId(),
                        keyword
                )
                .forEach(beneficiary ->

                        results.add(
                                SearchResultDto.builder()
                                        .id(beneficiary.getId())
                                        .title(beneficiary.getName())
                                        .subtitle(
                                                beneficiary.getCategory()
                                                        + " • "
                                                        + beneficiary.getVillage()
                                        )
                                        .type("BENEFICIARY")
                                        .route(
                                                "/app/beneficiaries/"
                                                        + beneficiary.getId()
                                        )
                                        .build()
                        )
                );


        // =================================================
        // VISITS
        // =================================================

        visitRepository
                .findByUserIdAndVisitTypeContainingIgnoreCase(
                        user.getId(),
                        keyword
                )
                .forEach(visit -> {

                    String beneficiaryName =
                            beneficiaryRepository
                                    .findById(
                                            visit.getBeneficiaryId()
                                    )
                                    .map(Beneficiary::getName)
                                    .orElse("Unknown");


                    results.add(
                            SearchResultDto.builder()
                                    .id(visit.getId())
                                    .title(visit.getVisitType())
                                    .subtitle(
                                            beneficiaryName
                                                    + " • "
                                                    + visit.getStatus()
                                    )
                                    .type("VISIT")
                                    .route(
                                            "/app/visit/"
                                                    + visit.getId()
                                    )
                                    .build()
                    );
                });


        // =================================================
        // HEALTH RECORDS
        // =================================================

        /*
         * Search only health records belonging to
         * beneficiaries managed by the current user.
         */
        List<String> beneficiaryIds =
                beneficiaryRepository
                        .findByUserId(user.getId())
                        .stream()
                        .map(Beneficiary::getId)
                        .toList();


        if (!beneficiaryIds.isEmpty()) {

            healthRecordRepository
                    .findByDiagnosisContainingIgnoreCaseOrderByCreatedAtDesc(
                            keyword
                    )
                    .forEach(record -> {

                        if (beneficiaryIds.contains(
                                record.getBeneficiaryId()
                        )) {

                            beneficiaryRepository
                                    .findById(
                                            record.getBeneficiaryId()
                                    )
                                    .ifPresent(beneficiary ->

                                            results.add(
                                                    SearchResultDto.builder()
                                                            .id(record.getId())
                                                            .title(
                                                                    record.getDiagnosis()
                                                            )
                                                            .subtitle(
                                                                    beneficiary.getName()
                                                                            + " • Health Record"
                                                            )
                                                            .type("HEALTH_RECORD")
                                                            .route(
                                                                    "/app/health-records/"
                                                                            + record.getId()
                                                            )
                                                            .build()
                                            )
                                    );
                        }
                    });
        }


        // =================================================
        // MEDICINES
        // =================================================

        medicineRepository
                .findByNameContainingIgnoreCase(keyword)
                .forEach(medicine ->

                        results.add(
                                SearchResultDto.builder()
                                        .id(medicine.getId())
                                        .title(medicine.getName())
                                        .subtitle(
                                                medicine.getType()
                                                        + " • Stock: "
                                                        + medicine.getStock()
                                        )
                                        .type("MEDICINE")
                                        .route(
                                                "/app/inventory/"
                                                        + medicine.getId()
                                        )
                                        .build()
                        )
                );


        return results;
    }
}