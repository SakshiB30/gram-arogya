package com.gramarogya.gramarogya_backend.service;

import com.gramarogya.gramarogya_backend.dto.Role;
import com.gramarogya.gramarogya_backend.dto.VerificationStatus;
import com.gramarogya.gramarogya_backend.dto.dashboard.*;
import com.gramarogya.gramarogya_backend.entity.Beneficiary;
import com.gramarogya.gramarogya_backend.entity.User;
import com.gramarogya.gramarogya_backend.entity.Visit;
import com.gramarogya.gramarogya_backend.exception.ResourceNotFoundException;
import com.gramarogya.gramarogya_backend.repository.BeneficiaryRepository;
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

        /*
         * IMPORTANT:
         * The dashboard is always generated for the
         * currently authenticated ASHA.
         */
        String ashaId = currentUser.getId();

        LocalDate today = LocalDate.now();


        // =====================================================
        // ASHA BENEFICIARIES
        // =====================================================

        /*
         * Use ashaId because Beneficiary.ashaId represents
         * the ASHA assigned to the beneficiary.
         *
         * This prevents beneficiaries belonging to other
         * ASHAs from appearing on this dashboard.
         */
        List<Beneficiary> beneficiaries =
                beneficiaryRepository.findByAshaId(ashaId);


        // =====================================================
        // HEALTH PROGRAM COUNTS
        // =====================================================

        long pregnantWomen = beneficiaries.stream()

                .filter(b -> b.getCategory() != null)

                .filter(b ->
                        b.getCategory()
                                .toLowerCase()
                                .contains("pregnant")
                )

                .count();


        long children = beneficiaries.stream()

                .filter(b -> b.getCategory() != null)

                .filter(b ->
                        b.getCategory()
                                .toLowerCase()
                                .contains("child")
                )

                .count();


        long tbPatients = beneficiaries.stream()

                .filter(b -> b.getCategory() != null)

                .filter(b ->
                        b.getCategory()
                                .toLowerCase()
                                .contains("tb")
                )

                .count();


        long elderly = beneficiaries.stream()

                .filter(b -> b.getCategory() != null)

                .filter(b ->
                        b.getCategory()
                                .toLowerCase()
                                .contains("elder")
                )

                .count();


        // =====================================================
        // DEBUG
        // =====================================================

        System.out.println("========== ASHA DASHBOARD ==========");
        System.out.println("ASHA ID       : " + ashaId);
        System.out.println("ASHA NAME     : " + currentUser.getName());
        System.out.println("Beneficiaries : " + beneficiaries.size());
        System.out.println("Pregnant      : " + pregnantWomen);
        System.out.println("Children      : " + children);
        System.out.println("TB Patients   : " + tbPatients);
        System.out.println("Elderly       : " + elderly);
        System.out.println("====================================");


        // =====================================================
        // ASHA-SPECIFIC ALERTS
        // =====================================================

        List<AlertDto> alerts =
                buildAlerts(currentUser);

        long criticalAlerts =
                countCriticalAlerts(alerts);


        // =====================================================
        // ASHA DASHBOARD STATS
        // =====================================================

        DashboardStatsDto stats =
                DashboardStatsDto.builder()

                        .userName(
                                currentUser.getName()
                        )

                        // -------------------------------------
                        // BENEFICIARIES
                        // -------------------------------------

                        .totalBeneficiaries(
                                beneficiaries.size()
                        )

                        // -------------------------------------
                        // HEALTH PROGRAMS
                        // -------------------------------------

                        .pregnantWomen(
                                pregnantWomen
                        )

                        .children(
                                children
                        )

                        .tbPatients(
                                tbPatients
                        )

                        .elderly(
                                elderly
                        )

                        // -------------------------------------
                        // VISITS
                        // -------------------------------------

                        .totalVisits(
                                visitRepository
                                        .countByUserId(
                                                ashaId
                                        )
                        )

                        .todayVisits(
                                visitRepository
                                        .countByUserIdAndVisitDate(
                                                ashaId,
                                                today
                                        )
                        )

                        .pendingVisits(
                                visitRepository
                                        .countByUserIdAndVisitDateAndStatus(
                                                ashaId,
                                                today,
                                                "Pending"
                                        )
                        )

                        .upcomingVisits(
                                visitRepository
                                        .countByUserIdAndNextVisitDateAfter(
                                                ashaId,
                                                today
                                        )
                        )

                        // -------------------------------------
                        // CRITICAL ALERTS
                        // -------------------------------------

                        .criticalAlerts(
                                criticalAlerts
                        )

                        .build();


        // =====================================================
        // ASHA DASHBOARD RESPONSE
        // =====================================================

        return DashboardResponseDto.builder()

                .stats(stats)

                // Only current ASHA activities
                .recentActivities(
                        buildRecentActivities(currentUser)
                )

                // Only alerts accessible to current ASHA
                .alerts(alerts)

                .healthPrograms(
                        buildHealthPrograms(stats)
                )

                // Only current ASHA upcoming visits
                .upcomingVisits(
                        buildUpcomingVisits(currentUser)
                )

                /*
                 * Medicine data is not shown for ASHA because
                 * the current medicine model/repository does
                 * not provide ASHA ownership filtering.
                 */
                .lowStockMedicines(
                        List.of()
                )

                // ASHA cannot verify users
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

        // Get ASHAs assigned to this ANM
        List<User> ashas =
                userRepository.findBySupervisorId(
                        currentUser.getId()
                );


        // Extract ASHA IDs
        List<String> ashaIds =
                ashas.stream()
                        .map(User::getId)
                        .toList();


        LocalDate today =
                LocalDate.now();


        // Build alerts once
        List<AlertDto> alerts =
                buildAlerts(currentUser);


        // Count HIGH priority alerts
        long criticalAlerts =
                countCriticalAlerts(alerts);


        // -----------------------------------------
        // HEALTH PROGRAMS
        // -----------------------------------------
        // -----------------------------------------
        // CRITICAL ALERTS
        // -----------------------------------------
        DashboardStatsDto stats =
                DashboardStatsDto.builder()

                        .userName(
                                currentUser.getName()
                        )

                        // -----------------------------------------
                        // ASSIGNED ASHAS
                        // -----------------------------------------

                        .assignedAshas(
                                ashas.size()
                        )

                        // -----------------------------------------
                        // BENEFICIARIES
                        // -----------------------------------------

                        .totalBeneficiaries(
                                ashaIds.isEmpty()
                                        ? 0
                                        : beneficiaryRepository
                                        .countByUserIdIn(ashaIds)
                        )

                        // -----------------------------------------
                        // VISITS
                        // -----------------------------------------

                        .totalVisits(
                                ashaIds.isEmpty()
                                        ? 0
                                        : visitRepository
                                        .countByUserIdIn(ashaIds)
                        )

                        .todayVisits(
                                ashaIds.isEmpty()
                                        ? 0
                                        : visitRepository
                                        .countByUserIdInAndVisitDate(
                                                ashaIds,
                                                today
                                        )
                        )

                        .pendingVisits(
                                ashaIds.isEmpty()
                                        ? 0
                                        : visitRepository
                                        .countByUserIdInAndVisitDateAndStatus(
                                                ashaIds,
                                                today,
                                                "Pending"
                                        )
                        )

                        .upcomingVisits(
                                ashaIds.isEmpty()
                                        ? 0
                                        : visitRepository
                                        .countByUserIdInAndNextVisitDateAfter(
                                                ashaIds,
                                                today
                                        )).build();


        return DashboardResponseDto.builder()

                .stats(stats)

                .recentActivities(
                        buildRecentActivities(currentUser)
                )

                .alerts(alerts)

                .healthPrograms(
                        buildHealthPrograms(stats)
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

        LocalDate today =
                LocalDate.now();


        // Build alerts once
        List<AlertDto> alerts =
                buildAlerts(currentUser);


        // Count HIGH priority alerts
        long criticalAlerts =
                countCriticalAlerts(alerts);


        // -----------------------------------------
        // CRITICAL ALERTS
        // -----------------------------------------
        DashboardStatsDto stats =
                DashboardStatsDto.builder()

                        .userName(
                                currentUser.getName()
                        )

                        // -----------------------------------------
                        // BENEFICIARIES
                        // -----------------------------------------

                        .totalBeneficiaries(
                                beneficiaryRepository.count()
                        )

                        // -----------------------------------------
                        // VISITS
                        // -----------------------------------------

                        .totalVisits(
                                visitRepository.count()
                        )

                        .todayVisits(
                                visitRepository.countByVisitDate(
                                        today
                                )
                        )

                        .pendingVisits(
                                visitRepository.countByStatus(
                                        "Pending"
                                )
                        )

                        .upcomingVisits(
                                visitRepository.countByNextVisitDateAfter(
                                                today
                                        )).build();


        return DashboardResponseDto.builder()

                .stats(stats)

                .recentActivities(
                        buildRecentActivities(currentUser)
                )

                .alerts(alerts)

                .healthPrograms(
                        buildHealthPrograms(stats)
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

        List<String> userIds =
                getAccessibleUserIds(currentUser);


        if (userIds.isEmpty()) {
            return List.of();
        }


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

        if (currentUser.getRole() == Role.ANM) {

            List<String> userIds =
                    new ArrayList<>();


            // ANM's own activities
            userIds.add(
                    currentUser.getId()
            );


            // Assigned ASHA activities
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

        /*
         * ASHA can access only their own activities.
         */
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


        if (userIds.isEmpty()) {
            return List.of();
        }


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

                            .id(
                                    visit.getId()
                            )

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
                                            ? visit.getNextVisitDate().toString()
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


        // -----------------------------------------------------
        // ADMIN VERIFIES ANMs
        // -----------------------------------------------------

        if (currentUser.getRole() == Role.ADMIN) {

            pendingUsers =
                    userRepository
                            .findByRoleAndVerificationStatus(
                                    Role.ANM,
                                    VerificationStatus.PENDING
                            );

        }

        // -----------------------------------------------------
        // ANM VERIFIES ASHAs
        // -----------------------------------------------------

        else {

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

                                .id(
                                        user.getId()
                                )

                                .name(
                                        user.getName()
                                )

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
                                                ? user.getVerificationStatus().name()
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

        List<AlertDto> alerts =
                new ArrayList<>();


        List<String> userIds =
                getAccessibleUserIds(currentUser);


        // =====================================================
        // 1. PENDING VERIFICATIONS
        // =====================================================

        if (currentUser.getRole() != Role.ASHA) {

            long pendingCount =
                    buildPendingVerifications(currentUser)
                            .size();


            if (pendingCount > 0) {

                alerts.add(
                        AlertDto.builder()

                                .id(
                                        "verification-alert"
                                )

                                .title(
                                        "Pending Verifications"
                                )

                                .description(
                                        pendingCount
                                                + " users waiting for verification"
                                )

                                .priority(
                                        "HIGH"
                                )

                                .type(
                                        "VERIFICATION"
                                )

                                .build()
                );
            }
        }


        // =====================================================
        // 2. LOW STOCK MEDICINES
        // =====================================================

        /*
         * Medicine data is global in the current model.
         *
         * Therefore ASHA should not receive these alerts.
         * ADMIN and ANM behavior remains unchanged.
         */
        if (currentUser.getRole() != Role.ASHA) {

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

                                        .priority(
                                                priority
                                        )

                                        .type(
                                                "MEDICINE"
                                        )

                                        .build()
                        );
                    });
        }


        // =====================================================
        // 3. UPCOMING VISITS
        // =====================================================

        if (!userIds.isEmpty()) {

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

                                        .priority(
                                                "MEDIUM"
                                        )

                                        .type(
                                                "UPCOMING_VISIT"
                                        )

                                        .build()
                        );
                    });
        }


        // =====================================================
        // 4. TB PATIENT ALERTS
        // =====================================================

        /*
         * IMPORTANT:
         *
         * ASHA → use ashaId
         * ANM   → use userIdIn for assigned ASHAs
         * ADMIN → use userIdIn for all users
         */
        if (!userIds.isEmpty()) {

            List<Beneficiary> alertBeneficiaries;


            if (currentUser.getRole() == Role.ASHA) {

                alertBeneficiaries =
                        beneficiaryRepository
                                .findByAshaId(
                                        currentUser.getId()
                                );

            } else {

                alertBeneficiaries =
                        beneficiaryRepository
                                .findByUserIdIn(
                                        userIds
                                );
            }


            alertBeneficiaries

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

                                        .priority(
                                                "HIGH"
                                        )

                                        .type(
                                                "TB_PATIENT"
                                        )

                                        .build()
                        );
                    });
        }


        // =====================================================
        // SORT ALERTS BY PRIORITY
        // =====================================================

        alerts.sort(
                (a, b) ->
                        Integer.compare(
                                getPriorityValue(
                                        a.getPriority()
                                ),
                                getPriorityValue(
                                        b.getPriority()
                                )
                        )
        );


        // Show maximum 10 alerts on dashboard
        return alerts
                .stream()
                .limit(10)
                .toList();
    }


    // =========================================================
    // COUNT CRITICAL ALERTS
    // =========================================================

    private long countCriticalAlerts(
            List<AlertDto> alerts
    ) {

        return alerts.stream()

                .filter(alert ->
                        alert.getPriority() != null
                                && alert.getPriority()
                                .equalsIgnoreCase("HIGH")
                )

                .count();
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


        return switch (
                priority.toUpperCase()
                ) {

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

        /*
         * ASHA should not see global medicine information.
         */
        if (currentUser.getRole() == Role.ASHA) {
            return List.of();
        }


        return medicineRepository
                .findAll()
                .stream()

                .filter(medicine ->
                        medicine.getStock() != null
                                && medicine.getStock() <= 10
                )

                .map(medicine ->
                        MedicineAlertDto.builder()

                                .id(
                                        medicine.getId()
                                )

                                .name(
                                        medicine.getName()
                                )

                                .batch(
                                        medicine.getBatch()
                                )

                                .stock(
                                        medicine.getStock()
                                )

                                .status(
                                        medicine.getStatus()
                                )

                                .build()
                )

                .limit(5)

                .toList();
    }


    // =========================================================
    // HEALTH PROGRAMS
    // =========================================================

    private List<HealthProgramDto> buildHealthPrograms(
            DashboardStatsDto stats
    ) {

        long total =
                stats.getTotalBeneficiaries();


        // -----------------------------------------------------
        // NO BENEFICIARIES
        // -----------------------------------------------------

        if (total == 0) {

            return List.of(

                    HealthProgramDto.builder()
                            .key("pregnant")
                            .label("Pregnant Women")
                            .percent(0)
                            .build(),

                    HealthProgramDto.builder()
                            .key("children")
                            .label("Children")
                            .percent(0)
                            .build(),

                    HealthProgramDto.builder()
                            .key("tb")
                            .label("TB Patients")
                            .percent(0)
                            .build(),

                    HealthProgramDto.builder()
                            .key("elderly")
                            .label("Elderly")
                            .percent(0)
                            .build()
            );
        }


        // -----------------------------------------------------
        // PROGRAM PERCENTAGES
        // -----------------------------------------------------

        return List.of(

                HealthProgramDto.builder()
                        .key("pregnant")
                        .label("Pregnant Women")
                        .percent(
                                calculatePercentage(
                                        stats.getPregnantWomen(),
                                        total
                                )
                        )
                        .build(),

                HealthProgramDto.builder()
                        .key("children")
                        .label("Children")
                        .percent(
                                calculatePercentage(
                                        stats.getChildren(),
                                        total
                                )
                        )
                        .build(),

                HealthProgramDto.builder()
                        .key("tb")
                        .label("TB Patients")
                        .percent(
                                calculatePercentage(
                                        stats.getTbPatients(),
                                        total
                                )
                        )
                        .build(),

                HealthProgramDto.builder()
                        .key("elderly")
                        .label("Elderly")
                        .percent(
                                calculatePercentage(
                                        stats.getElderly(),
                                        total
                                )
                        )
                        .build()
        );
    }


    // =========================================================
    // CALCULATE PERCENTAGE
    // =========================================================

    private int calculatePercentage(
            long count,
            long total
    ) {

        if (total == 0) {
            return 0;
        }


        return (int) Math.round(
                ((double) count / total) * 100
        );
    }
}