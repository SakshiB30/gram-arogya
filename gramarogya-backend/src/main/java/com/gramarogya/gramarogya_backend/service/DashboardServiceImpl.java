package com.gramarogya.gramarogya_backend.service;

import com.gramarogya.gramarogya_backend.dto.DashboardResponseDto;
import com.gramarogya.gramarogya_backend.dto.dashboard.ActivityDto;
import com.gramarogya.gramarogya_backend.dto.dashboard.AlertDto;
import com.gramarogya.gramarogya_backend.dto.dashboard.PendingVerificationDto;
import com.gramarogya.gramarogya_backend.entity.Beneficiary;
import com.gramarogya.gramarogya_backend.entity.HealthRecord;
import com.gramarogya.gramarogya_backend.entity.User;
import com.gramarogya.gramarogya_backend.entity.Visit;
import com.gramarogya.gramarogya_backend.exception.ResourceNotFoundException;
import com.gramarogya.gramarogya_backend.repository.BeneficiaryRepository;
import com.gramarogya.gramarogya_backend.repository.HealthRecordRepository;
import com.gramarogya.gramarogya_backend.repository.UserRepository;
import com.gramarogya.gramarogya_backend.repository.VisitRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

    private final BeneficiaryRepository beneficiaryRepository;
    private final VisitRepository visitRepository;
    private final UserRepository userRepository;
    private final HealthRecordRepository healthRecordRepository;


    private User getCurrentUser(Authentication authentication) {

        String email = authentication.getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));
    }

    @Override
    public DashboardResponseDto getDashboard(Authentication authentication) {

        User currentUser = getCurrentUser(authentication);

        String userId = currentUser.getId();

        return DashboardResponseDto.builder()
                .userName(currentUser.getName())   // <-- Add this
                .totalBeneficiaries(
                        beneficiaryRepository.countByUserId(userId)
                )
                .totalVisits(
                        visitRepository.countByUserId(userId)
                )
                .todayVisits(
                        visitRepository.countByUserIdAndVisitDate(
                                userId,
                                LocalDate.now()
                        )
                )
                .upcomingVisits(
                        visitRepository.countByUserIdAndNextVisitDateAfter(
                                userId,
                                LocalDate.now()
                        )
                )
                .pregnantWomen(
                        beneficiaryRepository.countByUserIdAndCategory(
                                userId,
                                "Pregnant Woman"
                        )
                )
                .children(
                        beneficiaryRepository.countByUserIdAndCategory(
                                userId,
                                "Child"
                        )
                )
                .tbPatients(
                        beneficiaryRepository.countByUserIdAndCategory(
                                userId,
                                "TB Patient"
                        )
                )
                .elderly(
                        beneficiaryRepository.countByUserIdAndCategory(
                                userId,
                                "Elderly"
                        )
                )
                .build();
    }

    @Override
    public List<PendingVerificationDto> getPendingVerifications(
            Authentication authentication) {

        User user = userRepository
                .findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Visit> pendingVisits =
                visitRepository.findByUserIdAndStatus(
                        user.getId(),
                        "Pending"
                );

        return pendingVisits.stream()
                .map(visit -> {

                    Beneficiary beneficiary =
                            beneficiaryRepository.findById(
                                    visit.getBeneficiaryId()
                            ).orElse(null);

                    return PendingVerificationDto.builder()
                            .id(visit.getId())
                            .beneficiaryName(
                                    beneficiary != null
                                            ? beneficiary.getName()
                                            : "Unknown"
                            )
                            .visitType(visit.getVisitType())
                            .visitDate(
                                    visit.getVisitDate().toString()
                            )
                            .status(visit.getStatus())
                            .build();

                })
                .toList();
    }

    @Override
    public List<AlertDto> getAlerts(Authentication authentication) {

        User user = userRepository
                .findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<AlertDto> alerts = new ArrayList<>();

        /*
         * High Risk Beneficiaries
         */
        List<Beneficiary> highRisk =
                beneficiaryRepository.findByUserIdAndStatusIgnoreCase(
                        user.getId(),
                        "High Risk"
                );

        for (Beneficiary beneficiary : highRisk) {

            alerts.add(
                    AlertDto.builder()
                            .id(beneficiary.getId())
                            .title("High Risk Beneficiary")
                            .description(
                                    beneficiary.getName() +
                                            " requires immediate follow-up."
                            )
                            .priority("HIGH")
                            .type("HIGH_RISK")
                            .build()
            );
        }

        /*
         * Upcoming Visits (Next 3 Days)
         */

        List<Visit> upcomingVisits =
                visitRepository.findByUserIdAndNextVisitDateBetween(
                        user.getId(),
                        LocalDate.now(),
                        LocalDate.now().plusDays(3)
                );

        for (Visit visit : upcomingVisits) {

            Beneficiary beneficiary =
                    beneficiaryRepository.findById(
                            visit.getBeneficiaryId()
                    ).orElse(null);

            alerts.add(
                    AlertDto.builder()
                            .id(visit.getId())
                            .title("Upcoming Visit")
                            .description(
                                    (beneficiary != null
                                            ? beneficiary.getName()
                                            : "Unknown")
                                            + " has a scheduled visit on "
                                            + visit.getNextVisitDate()
                            )
                            .priority("MEDIUM")
                            .type("UPCOMING_VISIT")
                            .build()
            );
        }

        /*
         * TB Patients
         */

        List<Beneficiary> tbPatients =
                beneficiaryRepository.findByUserIdAndCategoryIgnoreCase(
                        user.getId(),
                        "TB PATIENT"
                );

        for (Beneficiary beneficiary : tbPatients) {

            alerts.add(
                    AlertDto.builder()
                            .id(beneficiary.getId())
                            .title("TB Patient Monitoring")
                            .description(
                                    beneficiary.getName() +
                                            " requires regular monitoring."
                            )
                            .priority("MEDIUM")
                            .type("TB PATIENT")
                            .build()
            );
        }

        return alerts;
    }

    @Override
    public List<ActivityDto> getRecentActivities(Authentication authentication) {

        User user = userRepository
                .findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<ActivityDto> activities = new ArrayList<>();

        // Latest Visits
        List<Visit> visits =
                visitRepository.findTop5ByUserIdOrderByVisitDateDesc(user.getId());

        for (Visit visit : visits) {

            Beneficiary beneficiary =
                    beneficiaryRepository.findById(visit.getBeneficiaryId())
                            .orElse(null);

            activities.add(
                    ActivityDto.builder()
                            .id(visit.getId())
                            .title("Visit Completed")
                            .description(
                                    (beneficiary != null
                                            ? beneficiary.getName()
                                            : "Unknown")
                                            + " - " +
                                            visit.getVisitType()
                            )
                            .time(visit.getVisitDate().toString())
                            .type("VISIT")
                            .build()
            );
        }

        // Latest Health Records
        List<HealthRecord> records =
                healthRecordRepository.findTop5ByOrderByCreatedAtDesc();

        for (HealthRecord record : records) {

            Beneficiary beneficiary =
                    beneficiaryRepository.findById(record.getBeneficiaryId())
                            .orElse(null);

            activities.add(
                    ActivityDto.builder()
                            .id(record.getId())
                            .title("Health Record Updated")
                            .description(
                                    (beneficiary != null
                                            ? beneficiary.getName()
                                            : "Unknown")
                                            + " - Diagnosis: "
                                            + record.getDiagnosis()
                            )
                            .time(record.getCreatedAt().toLocalDate().toString())
                            .type("HEALTH_RECORD")
                            .build()
            );
        }

        activities.sort((a, b) -> b.getTime().compareTo(a.getTime()));

        return activities.stream()
                .limit(5)
                .toList();
    }
}