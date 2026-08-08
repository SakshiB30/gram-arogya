package com.gramarogya.gramarogya_backend.service;

import com.gramarogya.gramarogya_backend.dto.Role;
import com.gramarogya.gramarogya_backend.dto.VerificationStatus;
import com.gramarogya.gramarogya_backend.dto.dashboard.*;
import com.gramarogya.gramarogya_backend.entity.Beneficiary;
import com.gramarogya.gramarogya_backend.entity.User;
import com.gramarogya.gramarogya_backend.entity.Visit;
import com.gramarogya.gramarogya_backend.exception.ResourceNotFoundException;
import com.gramarogya.gramarogya_backend.repository.BeneficiaryRepository;
import com.gramarogya.gramarogya_backend.repository.HealthRecordRepository;
import com.gramarogya.gramarogya_backend.repository.UserRepository;
import com.gramarogya.gramarogya_backend.repository.VisitRepository;
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
    private final ActivityService activityService;


    // =========================================================
    // GET CURRENT USER
    // =========================================================

    private User getCurrentUser(Authentication authentication) {

        String email = authentication.getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));
    }


    // =========================================================
    // MAIN DASHBOARD
    // =========================================================

    @Override
    public DashboardResponseDto getDashboard(
            Authentication authentication
    ) {

        User currentUser = getCurrentUser(authentication);

        return switch (currentUser.getRole()) {

            case ADMIN -> getAdminDashboard(currentUser);

            case ANM -> getAnmDashboard(currentUser);

            case ASHA -> getAshaDashboard(currentUser);

        };
    }


    // =========================================================
    // ASHA DASHBOARD
    // =========================================================

    private DashboardResponseDto getAshaDashboard(
            User currentUser
    ) {

        String userId = currentUser.getId();

        DashboardStatsDto stats =
                DashboardStatsDto.builder()

                        .userName(currentUser.getName())

                        .totalBeneficiaries(
                                beneficiaryRepository
                                        .countByUserId(userId)
                        )

                        .totalVisits(
                                visitRepository
                                        .countByUserId(userId)
                        )

                        .todayVisits(
                                visitRepository
                                        .countByUserIdAndVisitDate(
                                                userId,
                                                LocalDate.now()
                                        )
                        )

                        .upcomingVisits(
                                visitRepository
                                        .countByUserIdAndNextVisitDateAfter(
                                                userId,
                                                LocalDate.now()
                                        )
                        )

                        .pregnantWomen(
                                beneficiaryRepository
                                        .countByUserIdAndCategoryContainingIgnoreCase(
                                                userId,
                                                "pregnant"
                                        )
                        )

                        .children(
                                beneficiaryRepository
                                        .countByUserIdAndCategoryContainingIgnoreCase(
                                                userId,
                                                "child"
                                        )
                        )

                        .tbPatients(
                                beneficiaryRepository
                                        .countByUserIdAndCategoryContainingIgnoreCase(
                                                userId,
                                                "tb"
                                        )
                        )

                        .elderly(
                                beneficiaryRepository
                                        .countByUserIdAndCategoryContainingIgnoreCase(
                                                userId,
                                                "elder"
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


    // =========================================================
    // ANM DASHBOARD
    // =========================================================

    private DashboardResponseDto getAnmDashboard(
            User currentUser
    ) {

        List<User> ashas =
                userRepository.findBySupervisorId(
                        currentUser.getId()
                );

        List<String> ashaIds =
                ashas.stream()
                        .map(User::getId)
                        .toList();


        DashboardStatsDto stats =
                DashboardStatsDto.builder()

                        .userName(currentUser.getName())

                        .assignedAshas(
                                ashas.size()
                        )

                        .totalBeneficiaries(
                                beneficiaryRepository
                                        .countByUserIdIn(ashaIds)
                        )

                        .totalVisits(
                                visitRepository
                                        .countByUserIdIn(ashaIds)
                        )

                        .todayVisits(
                                visitRepository
                                        .countByUserIdInAndVisitDate(
                                                ashaIds,
                                                LocalDate.now()
                                        )
                        )

                        .upcomingVisits(
                                visitRepository
                                        .countByUserIdInAndNextVisitDateAfter(
                                                ashaIds,
                                                LocalDate.now()
                                        )
                        )

                        .pregnantWomen(
                                beneficiaryRepository
                                        .countByUserIdInAndCategoryContainingIgnoreCase(
                                                ashaIds,
                                                "pregnant"
                                        )
                        )

                        .children(
                                beneficiaryRepository
                                        .countByUserIdInAndCategoryContainingIgnoreCase(
                                                ashaIds,
                                                "child"
                                        )
                        )

                        .tbPatients(
                                beneficiaryRepository
                                        .countByUserIdInAndCategoryContainingIgnoreCase(
                                                ashaIds,
                                                "tb"
                                        )
                        )

                        .elderly(
                                beneficiaryRepository
                                        .countByUserIdInAndCategoryContainingIgnoreCase(
                                                ashaIds,
                                                "elder"
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


    // =========================================================
    // ADMIN DASHBOARD
    // =========================================================

    private DashboardResponseDto getAdminDashboard(
            User currentUser
    ) {

        DashboardStatsDto stats =
                DashboardStatsDto.builder()

                        .userName(currentUser.getName())

                        .totalBeneficiaries(
                                beneficiaryRepository.count()
                        )

                        .totalVisits(
                                visitRepository.count()
                        )

                        .todayVisits(
                                visitRepository.countByVisitDate(
                                        LocalDate.now()
                                )
                        )

                        .upcomingVisits(
                                visitRepository.countByNextVisitDateAfter(
                                        LocalDate.now()
                                )
                        )

                        .totalUsers(
                                userRepository.count()
                        )

                        .totalAnms(
                                userRepository.countByRole(
                                        Role.ANM
                                )
                        )

                        .totalAshas(
                                userRepository.countByRole(
                                        Role.ASHA
                                )
                        )

                        .pendingVerifications(
                                visitRepository.countByStatus(
                                        "Pending"
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


    // =========================================================
    // RECENT ACTIVITIES
    // =========================================================

    private List<ActivityDto> buildRecentActivities(
            User currentUser
    ) {

        /*
         * Determine which users' activities this dashboard
         * is allowed to see.
         */

        List<String> userIds =
                getAccessibleUserIds(currentUser);


        /*
         * Get latest activities from ActivityService.
         */

        return activityService.getActivities(userIds);
    }


    // =========================================================
    // ACCESSIBLE USER IDS
    // =========================================================

    private List<String> getAccessibleUserIds(
            User currentUser
    ) {

        // -----------------------------------------------------
        // ADMIN
        // -----------------------------------------------------
        //
        // Admin should see activities from ALL users.
        //

        if (currentUser.getRole() == Role.ADMIN) {

            return userRepository
                    .findAll()
                    .stream()
                    .map(User::getId)
                    .toList();
        }


        // -----------------------------------------------------
        // ANM
        // -----------------------------------------------------
        //
        // ANM sees:
        // 1. Their own activities
        // 2. Activities of ASHAs assigned to them
        //

        if (currentUser.getRole() == Role.ANM) {

            List<String> userIds =
                    new ArrayList<>();

            // ANM's own activities
            userIds.add(
                    currentUser.getId()
            );

            // ASHA activities
            List<String> ashaIds =
                    userRepository
                            .findBySupervisorId(
                                    currentUser.getId()
                            )
                            .stream()
                            .map(User::getId)
                            .toList();

            userIds.addAll(ashaIds);

            return userIds;
        }


        // -----------------------------------------------------
        // ASHA
        // -----------------------------------------------------
        //
        // ASHA sees only their own activities.
        //

        return List.of(
                currentUser.getId()
        );
    }


    // =========================================================
    // UPCOMING VISITS
    // =========================================================

    private List<UpcomingVisitDto> buildUpcomingVisits(
            User currentUser
    ) {

        List<String> userIds =
                getAccessibleUserIds(currentUser);

        LocalDate today =
                LocalDate.now();

        LocalDate threeDaysLater =
                today.plusDays(3);


        List<Visit> visits =
                visitRepository
                        .findByUserIdInAndNextVisitDateBetween(
                                userIds,
                                today,
                                threeDaysLater
                        );


        return visits.stream()

                /*
                 * Only pending visits should appear
                 * in Upcoming Visits.
                 */
                .filter(visit ->
                        visit.getStatus() != null
                                && visit.getStatus()
                                .equalsIgnoreCase("Pending")
                )

                .map(visit -> {

                    Beneficiary beneficiary =
                            beneficiaryRepository
                                    .findById(
                                            visit.getBeneficiaryId()
                                    )
                                    .orElse(null);


                    return UpcomingVisitDto.builder()

                            .id(visit.getId())

                            .beneficiaryName(
                                    beneficiary != null
                                            ? beneficiary.getName()
                                            : "Unknown"
                            )

                            .visitType(
                                    visit.getVisitType()
                            )

                            .nextVisitDate(
                                    visit.getNextVisitDate() != null
                                            ? visit.getNextVisitDate()
                                            .toString()
                                            : ""
                            )

                            .build();
                })

                .sorted(
                        (a, b) ->
                                a.getNextVisitDate()
                                        .compareTo(
                                                b.getNextVisitDate()
                                        )
                )

                .limit(5)

                .toList();
    }


    // =========================================================
    // PENDING VERIFICATIONS
    // =========================================================

    private List<PendingVerificationDto>
    buildPendingVerifications(
            User currentUser
    ) {

        // ASHA cannot verify users
        if (currentUser.getRole() == Role.ASHA) {
            return List.of();
        }


        List<User> pendingUsers;


        // ADMIN verifies ANMs
        if (currentUser.getRole() == Role.ADMIN) {

            pendingUsers =
                    userRepository
                            .findByRoleAndVerificationStatus(
                                    Role.ANM,
                                    VerificationStatus.PENDING
                            );

        } else {

            // ANM verifies ASHAs assigned to them
            pendingUsers =
                    userRepository
                            .findBySupervisorIdAndVerificationStatus(
                                    currentUser.getId(),
                                    VerificationStatus.PENDING
                            );
        }


        return pendingUsers.stream()

                .map(user ->
                        PendingVerificationDto.builder()

                                .id(user.getId())

                                .name(user.getName())

                                .role(
                                        user.getRole() != null
                                                ? user.getRole().name()
                                                : ""
                                )

                                .employeeId(
                                        user.getEmployeeId()
                                )

                                .village(
                                        user.getVillage()
                                )

                                .phone(
                                        user.getPhone()
                                )

                                .status(
                                        user.getVerificationStatus() != null
                                                ? user.getVerificationStatus()
                                                .name()
                                                : ""
                                )

                                .build()
                )

                .toList();
    }


    // =========================================================
// ALERTS
// =========================================================

    private List<AlertDto> buildAlerts(
            User currentUser
    ) {

        List<AlertDto> alerts = new ArrayList<>();

        List<String> userIds =
                getAccessibleUserIds(currentUser);


        // =====================================================
        // 1. PENDING VERIFICATIONS
        // =====================================================

        if (currentUser.getRole() != Role.ASHA) {

            long pendingCount =
                    buildPendingVerifications(currentUser).size();

            if (pendingCount > 0) {

                alerts.add(
                        AlertDto.builder()

                                .id("verification-alert")

                                .title(
                                        "Pending Verifications"
                                )

                                .description(
                                        pendingCount
                                                + " users waiting for verification"
                                )

                                .priority("HIGH")

                                .type("VERIFICATION")

                                .build()
                );
            }
        }


        // =====================================================
        // 2. LOW STOCK MEDICINES
        // =====================================================

        medicineRepository
                .findAll()
                .stream()

                .filter(medicine ->
                        medicine.getStock() != null
                                && medicine.getStock() <= 10
                )

                .limit(5)

                .forEach(medicine -> {

                    String priority =
                            medicine.getStock() == 0
                                    ? "HIGH"
                                    : "MEDIUM";

                    String description =
                            medicine.getStock() == 0
                                    ? medicine.getName()
                                    + " is out of stock."
                                    : medicine.getName()
                                    + " has only "
                                    + medicine.getStock()
                                    + " units remaining.";

                    alerts.add(
                            AlertDto.builder()

                                    .id(
                                            "medicine-"
                                                    + medicine.getId()
                                    )

                                    .title(
                                            medicine.getStock() == 0
                                                    ? "Medicine Out of Stock"
                                                    : "Low Medicine Stock"
                                    )

                                    .description(
                                            description
                                    )

                                    .priority(priority)

                                    .type("MEDICINE")

                                    .build()
                    );
                });


        // =====================================================
        // 3. UPCOMING VISITS
        // =====================================================

        LocalDate today =
                LocalDate.now();

        LocalDate threeDaysLater =
                today.plusDays(3);

        visitRepository
                .findByUserIdInAndNextVisitDateBetween(
                        userIds,
                        today,
                        threeDaysLater
                )
                .stream()

                .filter(visit ->
                        visit.getStatus() != null
                                && visit.getStatus()
                                .equalsIgnoreCase("Pending")
                )

                .limit(5)

                .forEach(visit -> {

                    Beneficiary beneficiary =
                            beneficiaryRepository
                                    .findById(
                                            visit.getBeneficiaryId()
                                    )
                                    .orElse(null);

                    String beneficiaryName =
                            beneficiary != null
                                    ? beneficiary.getName()
                                    : "Unknown";


                    alerts.add(
                            AlertDto.builder()

                                    .id(
                                            "visit-"
                                                    + visit.getId()
                                    )

                                    .title(
                                            "Upcoming Visit"
                                    )

                                    .description(
                                            "Visit scheduled for "
                                                    + beneficiaryName
                                                    + " on "
                                                    + visit.getNextVisitDate()
                                    )

                                    .priority("MEDIUM")

                                    .type("UPCOMING_VISIT")

                                    .build()
                    );
                });


        // =====================================================
        // 4. TB PATIENT ALERTS
        // =====================================================

        beneficiaryRepository
                .findByUserIdIn(userIds)
                .stream()

                .filter(beneficiary ->
                        beneficiary.getCategory() != null
                                && beneficiary.getCategory()
                                .toLowerCase()
                                .contains("tb")
                )

                .limit(5)

                .forEach(beneficiary -> {

                    alerts.add(
                            AlertDto.builder()

                                    .id(
                                            "tb-"
                                                    + beneficiary.getId()
                                    )

                                    .title(
                                            "TB Patient"
                                    )

                                    .description(
                                            beneficiary.getName()
                                                    + " requires TB follow-up."
                                    )

                                    .priority("HIGH")

                                    .type("TB_PATIENT")

                                    .build()
                    );
                });


        // =====================================================
        // SORT ALERTS
        // =====================================================

        alerts.sort((a, b) -> {

            int priorityA =
                    getPriorityValue(
                            a.getPriority()
                    );

            int priorityB =
                    getPriorityValue(
                            b.getPriority()
                    );

            return Integer.compare(
                    priorityA,
                    priorityB
            );
        });


        return alerts
                .stream()
                .limit(10)
                .toList();
    }


// =========================================================
// ALERT PRIORITY
// =========================================================

    private int getPriorityValue(
            String priority
    ) {

        if (priority == null) {
            return 3;
        }

        return switch (priority.toUpperCase()) {

            case "HIGH" -> 1;

            case "MEDIUM" -> 2;

            case "LOW" -> 3;

            default -> 3;
        };
    }


    // =========================================================
    // MEDICINE ALERTS
    // =========================================================

    private List<MedicineAlertDto>
    buildMedicineAlerts(
            User currentUser
    ) {

        return medicineRepository
                .findAll()
                .stream()

                .filter(medicine ->
                        medicine.getStock() != null
                                && medicine.getStock() <= 10
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