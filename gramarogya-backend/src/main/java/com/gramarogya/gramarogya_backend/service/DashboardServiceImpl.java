package com.gramarogya.gramarogya_backend.service;

import com.gramarogya.gramarogya_backend.dto.VerificationStatus;
import com.gramarogya.gramarogya_backend.dto.dashboard.*;
import com.gramarogya.gramarogya_backend.dto.Role;
import com.gramarogya.gramarogya_backend.entity.Beneficiary;
import com.gramarogya.gramarogya_backend.entity.HealthRecord;
import com.gramarogya.gramarogya_backend.entity.User;
import com.gramarogya.gramarogya_backend.entity.Visit;
import com.gramarogya.gramarogya_backend.exception.ResourceNotFoundException;
import com.gramarogya.gramarogya_backend.repository.*;
import com.gramarogya.gramarogya_backend.repository.medicine.MedicineRepository;
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
    private final MedicineRepository medicineRepository;

    private User getCurrentUser(Authentication authentication) {

        String email = authentication.getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));
    }

    @Override
    public DashboardResponseDto getDashboard(Authentication authentication) {

        User currentUser = getCurrentUser(authentication);

        return switch (currentUser.getRole()) {

            case ADMIN -> getAdminDashboard(currentUser);

            case ANM -> getAnmDashboard(currentUser);

            case ASHA -> getAshaDashboard(currentUser);

        };
    }

    private DashboardResponseDto getAshaDashboard(User currentUser) {

        String userId = currentUser.getId();

        DashboardStatsDto stats = DashboardStatsDto.builder()

                .userName(currentUser.getName())

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

        return DashboardResponseDto.builder()

                .stats(stats)

                .recentActivities(
                        buildRecentActivities(currentUser)
                )

                .alerts(
                        buildAlerts(currentUser)
                )

                .upcomingVisits(
                        buildUpcomingVisits(currentUser)
                )

                .lowStockMedicines(
                        buildMedicineAlerts(currentUser)
                )

                .pendingVerifications(
                        List.of()
                )

                .build();
    }

    private DashboardResponseDto getAdminDashboard(User currentUser) {

        DashboardStatsDto stats = DashboardStatsDto.builder()

                .userName(currentUser.getName())

                .totalBeneficiaries(
                        beneficiaryRepository.count()
                )

                .totalVisits(
                        visitRepository.count()
                )

                .todayVisits(
                        visitRepository.countByVisitDate(LocalDate.now())
                )

                .upcomingVisits(
                        visitRepository.countByNextVisitDateAfter(LocalDate.now())
                )

                .totalUsers(
                        userRepository.count()
                )

                .totalAnms(
                        userRepository.countByRole(Role.ANM)
                )

                .totalAshas(
                        userRepository.countByRole(Role.ASHA)
                )

                .pendingVerifications(
                        visitRepository.countByStatus("Pending")
                )

                .build();

        return DashboardResponseDto.builder()

                .stats(stats)

                .recentActivities(
                        buildRecentActivities(currentUser)
                )

                .alerts(
                        buildAlerts(currentUser)
                )

                .upcomingVisits(
                        buildUpcomingVisits(currentUser)
                )

                .lowStockMedicines(
                        buildMedicineAlerts(currentUser)
                )

                .pendingVerifications(
                        buildPendingVerifications(currentUser)
                )

                .build();
    }

    private DashboardResponseDto getAnmDashboard(User currentUser) {

        // Get all ASHA workers under this ANM
        List<User> ashas = userRepository.findBySupervisorId(currentUser.getId());

        List<String> ashaIds = ashas.stream()
                .map(User::getId)
                .toList();

        DashboardStatsDto stats = DashboardStatsDto.builder()

                .userName(currentUser.getName())

                .assignedAshas(ashas.size())

                .totalBeneficiaries(
                        beneficiaryRepository.countByUserIdIn(ashaIds)
                )

                .totalVisits(
                        visitRepository.countByUserIdIn(ashaIds)
                )

                .todayVisits(
                        visitRepository.countByUserIdInAndVisitDate(
                                ashaIds,
                                LocalDate.now()
                        )
                )

                .upcomingVisits(
                        visitRepository.countByUserIdInAndNextVisitDateAfter(
                                ashaIds,
                                LocalDate.now()
                        )
                )

                .pregnantWomen(
                        beneficiaryRepository.countByUserIdInAndCategory(
                                ashaIds,
                                "Pregnant Woman"
                        )
                )

                .children(
                        beneficiaryRepository.countByUserIdInAndCategory(
                                ashaIds,
                                "Child"
                        )
                )

                .tbPatients(
                        beneficiaryRepository.countByUserIdInAndCategory(
                                ashaIds,
                                "TB Patient"
                        )
                )

                .elderly(
                        beneficiaryRepository.countByUserIdInAndCategory(
                                ashaIds,
                                "Elderly"
                        )
                )

                .build();

        return DashboardResponseDto.builder()

                .stats(stats)

                .recentActivities(
                        buildRecentActivities(currentUser)
                )

                .alerts(
                        buildAlerts(currentUser)
                )

                .upcomingVisits(
                        buildUpcomingVisits(currentUser)
                )

                .lowStockMedicines(
                        buildMedicineAlerts(currentUser)
                )

                .pendingVerifications(
                        buildPendingVerifications(currentUser)
                )

                .build();
    }

    private List<PendingVerificationDto> buildPendingVerifications(User currentUser) {

        // ASHA cannot verify users
        if (currentUser.getRole() == Role.ASHA) {
            return List.of();
        }

        List<User> pendingUsers;

        if (currentUser.getRole() == Role.ADMIN) {

            // Admin verifies ANMs
            pendingUsers = userRepository.findByRoleAndVerificationStatus(
                    Role.ANM,
                    VerificationStatus.PENDING
            );

        } else {

            // ANM verifies ASHAs assigned to them
            pendingUsers = userRepository.findBySupervisorIdAndVerificationStatus(
                    currentUser.getId(),
                    VerificationStatus.PENDING
            );
        }

        return pendingUsers.stream()
                .map(user -> PendingVerificationDto.builder()

                        .id(user.getId())

                        .name(user.getName())

                        .role(user.getRole().name())

                        .employeeId(user.getEmployeeId())

                        .village(user.getVillage())

                        .phone(user.getPhone())

                        .status(user.getVerificationStatus().name())

                        .build())

                .toList();
    }

    private List<ActivityDto> buildRecentActivities(User currentUser) {

        List<String> userIds = getAccessibleUserIds(currentUser);

        List<ActivityDto> activities = new ArrayList<>();

        // ==========================
        // Latest Visits
        // ==========================

        List<Visit> visits =
                visitRepository.findTop5ByUserIdInOrderByVisitDateDesc(userIds);

        for (Visit visit : visits) {

            Beneficiary beneficiary = beneficiaryRepository
                    .findById(visit.getBeneficiaryId())
                    .orElse(null);

            activities.add(
                    ActivityDto.builder()
                            .id(visit.getId())
                            .title("Visit Completed")
                            .description(
                                    (beneficiary != null
                                            ? beneficiary.getName()
                                            : "Unknown")
                                            + " • "
                                            + visit.getVisitType()
                            )
                            .time(visit.getVisitDate().toString())
                            .type("VISIT")
                            .build()
            );
        }

        // ==========================
        // Latest Health Records
        // ==========================

        List<Beneficiary> beneficiaries =
                beneficiaryRepository.findByUserIdIn(userIds);

        if (!beneficiaries.isEmpty()) {

            List<String> beneficiaryIds = beneficiaries.stream()
                    .map(Beneficiary::getId)
                    .toList();

            List<HealthRecord> records =
                    healthRecordRepository
                            .findTop5ByBeneficiaryIdInOrderByCreatedAtDesc(
                                    beneficiaryIds
                            );

            for (HealthRecord record : records) {

                Beneficiary beneficiary = beneficiaryRepository
                        .findById(record.getBeneficiaryId())
                        .orElse(null);

                activities.add(
                        ActivityDto.builder()
                                .id(record.getId())
                                .title("Health Record Updated")
                                .description(
                                        (beneficiary != null
                                                ? beneficiary.getName()
                                                : "Unknown")
                                                + " • Diagnosis: "
                                                + record.getDiagnosis()
                                )
                                .time(record.getCreatedAt()
                                        .toLocalDate()
                                        .toString())
                                .type("HEALTH_RECORD")
                                .build()
                );
            }
        }

        // ==========================
        // Sort latest first
        // ==========================

        activities.sort(
                (a, b) -> b.getTime().compareTo(a.getTime())
        );

        return activities.stream()
                .limit(5)
                .toList();
    }

    private List<String> getAccessibleUserIds(User currentUser) {

        if (currentUser.getRole() == Role.ADMIN) {

            return userRepository.findByRole(Role.ASHA)
                    .stream()
                    .map(User::getId)
                    .toList();
        }

        if (currentUser.getRole() == Role.ANM) {

            return userRepository.findBySupervisorId(currentUser.getId())
                    .stream()
                    .map(User::getId)
                    .toList();
        }

        // ASHA can access only its own data
        return List.of(currentUser.getId());
    }

    private List<UpcomingVisitDto> buildUpcomingVisits(User currentUser) {

        List<String> userIds = getAccessibleUserIds(currentUser);

        List<Visit> visits =
                visitRepository.findByUserIdInAndNextVisitDateBetween(
                        userIds,
                        LocalDate.now(),
                        LocalDate.now().plusDays(7)
                );

        return visits.stream()
                .map(visit -> {

                    Beneficiary beneficiary =
                            beneficiaryRepository
                                    .findById(visit.getBeneficiaryId())
                                    .orElse(null);

                    return UpcomingVisitDto.builder()
                            .id(visit.getId())
                            .beneficiaryName(
                                    beneficiary != null
                                            ? beneficiary.getName()
                                            : "Unknown"
                            )
                            .visitType(visit.getVisitType())
                            .nextVisitDate(
                                    visit.getNextVisitDate() != null
                                            ? visit.getNextVisitDate().toString()
                                            : ""
                            )
                            .build();
                })
                .sorted((a, b) ->
                        a.getNextVisitDate().compareTo(b.getNextVisitDate())
                )
                .limit(5)
                .toList();
    }

    private List<AlertDto> buildAlerts(User currentUser) {

        List<AlertDto> alerts = new ArrayList<>();

        if (currentUser.getRole() != Role.ASHA) {

            long pendingCount = buildPendingVerifications(currentUser).size();

            if (pendingCount > 0) {
                alerts.add(
                        AlertDto.builder()
                                .id("1")
                                .title("Pending Verifications")
                                .description(pendingCount + " users waiting for verification")
                                .priority("HIGH")
                                .type("VERIFICATION")
                                .build()
                );
            }
        }

        return alerts;
    }

    private List<MedicineAlertDto> buildMedicineAlerts(User currentUser) {

        return medicineRepository.findAll()
                .stream()
                .filter(medicine ->
                        medicine.getStock() != null &&
                                medicine.getStock() <= 10
                )
                .map(medicine ->
                        MedicineAlertDto.builder()
                                .id(medicine.getId())
                                .name(medicine.getName())
                                .batch(medicine.getBatch())
                                .stock(medicine.getStock())
                                .status(medicine.getStatus())
                                .build()
                )
                .limit(5)
                .toList();
    }

}