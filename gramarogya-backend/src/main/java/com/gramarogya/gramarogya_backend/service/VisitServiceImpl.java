package com.gramarogya.gramarogya_backend.service;

import com.gramarogya.gramarogya_backend.dto.Role;
import com.gramarogya.gramarogya_backend.dto.visit.CreateVisitRequestDto;
import com.gramarogya.gramarogya_backend.dto.visit.UpdateVisitRequestDto;
import com.gramarogya.gramarogya_backend.dto.visit.VisitResponseDto;
import com.gramarogya.gramarogya_backend.entity.Beneficiary;
import com.gramarogya.gramarogya_backend.entity.User;
import com.gramarogya.gramarogya_backend.entity.Visit;
import com.gramarogya.gramarogya_backend.exception.ResourceNotFoundException;
import com.gramarogya.gramarogya_backend.exception.UnauthorizedException;
import com.gramarogya.gramarogya_backend.mapper.VisitMapper;
import com.gramarogya.gramarogya_backend.repository.BeneficiaryRepository;
import com.gramarogya.gramarogya_backend.repository.UserRepository;
import com.gramarogya.gramarogya_backend.repository.VisitRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class VisitServiceImpl implements VisitService {

    private final VisitRepository visitRepository;
    private final UserRepository userRepository;
    private final BeneficiaryRepository beneficiaryRepository;
    private final VisitMapper visitMapper;
    private final ActivityService activityService;


    // ==========================================
    // CURRENT USER
    // ==========================================

    private User getCurrentUser(Authentication authentication) {

        String email = authentication.getName();

        return userRepository.findByEmail(email)
                .orElseThrow(
                        () -> new ResourceNotFoundException("User not found.")
                );
    }


    // ==========================================
    // CREATE VISIT
    // ==========================================

    @Override
    public VisitResponseDto create(
            Authentication authentication,
            CreateVisitRequestDto dto) {

        User currentUser = getCurrentUser(authentication);

        // ==========================================
        // FIND BENEFICIARY
        // ==========================================

        Beneficiary beneficiary =
                beneficiaryRepository.findById(dto.getBeneficiaryId())
                        .orElseThrow(
                                () -> new ResourceNotFoundException(
                                        "Beneficiary not found."
                                )
                        );


        // ==========================================
        // CHECK BENEFICIARY ACCESS
        // ==========================================

        if (!canAccessBeneficiaryForVisit(
                currentUser,
                beneficiary)) {

            throw new UnauthorizedException(
                    "You cannot create a visit for a beneficiary who is not assigned to you."
            );
        }


        // ==========================================
        // CREATE VISIT
        // ==========================================

        Visit visit = visitMapper.toEntity(dto);

        // User who created/recorded the visit
        visit.setUserId(currentUser.getId());

        // Actual visit/creation date
        visit.setVisitDate(LocalDate.now());


        // Save visit first so that ID is available
        visit = visitRepository.save(visit);


        // ==========================================
        // CREATE ACTIVITY
        // ==========================================

        activityService.log(
                currentUser,
                "CREATE",
                "Visit Scheduled",
                beneficiary.getName()
                        + " • "
                        + beneficiary.getVillage(),
                "VISIT",
                visit.getId(),
                "Visit"
        );


        return buildResponse(visit);
    }


    // ==========================================
    // GET ALL VISITS
    // ==========================================

    @Override
    public List<VisitResponseDto> getAll(
            Authentication authentication) {

        User currentUser = getCurrentUser(authentication);

        return getAccessibleVisits(currentUser)
                .stream()
                .map(this::buildResponse)
                .toList();
    }


    // ==========================================
    // GET VISIT BY ID
    // ==========================================

    @Override
    public VisitResponseDto getById(
            Authentication authentication,
            String id) {

        User currentUser = getCurrentUser(authentication);

        Visit visit =
                visitRepository.findById(id)
                        .orElseThrow(
                                () -> new ResourceNotFoundException(
                                        "Visit not found."
                                )
                        );


        // ==========================================
        // CHECK ACCESS
        // ==========================================

        if (!canAccessVisit(currentUser, visit)) {

            throw new UnauthorizedException(
                    "You don't have permission to access this visit."
            );
        }


        return buildResponse(visit);
    }


    // ==========================================
    // UPDATE VISIT
    // ==========================================

    @Override
    public VisitResponseDto update(
            Authentication authentication,
            String id,
            UpdateVisitRequestDto dto) {

        User currentUser = getCurrentUser(authentication);

        Visit visit =
                visitRepository.findById(id)
                        .orElseThrow(
                                () -> new ResourceNotFoundException(
                                        "Visit not found."
                                )
                        );


        // ==========================================
        // CHECK ACCESS
        // ==========================================

        if (!canAccessVisit(currentUser, visit)) {

            throw new UnauthorizedException(
                    "You don't have permission to update this visit."
            );
        }


        // ==========================================
        // UPDATE VISIT
        // ==========================================

        visitMapper.updateEntity(dto, visit);

        visit = visitRepository.save(visit);


        // ==========================================
        // GET BENEFICIARY
        // ==========================================

        Beneficiary beneficiary =
                beneficiaryRepository
                        .findById(visit.getBeneficiaryId())
                        .orElse(null);


        String description;


        if (beneficiary != null) {

            description =
                    beneficiary.getName()
                            + " • "
                            + beneficiary.getVillage();

        } else {

            description =
                    "Visit details updated";
        }


        // ==========================================
        // UPDATE ACTIVITY
        // ==========================================

        activityService.log(
                currentUser,
                "UPDATE",
                "Visit Updated",
                description,
                "VISIT",
                visit.getId(),
                "Visit"
        );


        return buildResponse(visit);
    }


    // ==========================================
    // DELETE VISIT
    // ==========================================

    @Override
    public void delete(
            Authentication authentication,
            String id) {

        User currentUser = getCurrentUser(authentication);

        Visit visit =
                visitRepository.findById(id)
                        .orElseThrow(
                                () -> new ResourceNotFoundException(
                                        "Visit not found."
                                )
                        );


        // ==========================================
        // CHECK ACCESS
        // ==========================================

        if (!canAccessVisit(currentUser, visit)) {

            throw new UnauthorizedException(
                    "You don't have permission to delete this visit."
            );
        }


        // ==========================================
        // GET BENEFICIARY BEFORE DELETE
        // ==========================================

        Beneficiary beneficiary =
                beneficiaryRepository
                        .findById(visit.getBeneficiaryId())
                        .orElse(null);


        String description;


        if (beneficiary != null) {

            description =
                    beneficiary.getName()
                            + " • "
                            + beneficiary.getVillage();

        } else {

            description =
                    "Visit deleted";
        }


        // ==========================================
        // DELETE ACTIVITY
        // ==========================================

        activityService.log(
                currentUser,
                "DELETE",
                "Visit Deleted",
                description,
                "VISIT",
                visit.getId(),
                "Visit"
        );


        // ==========================================
        // DELETE VISIT
        // ==========================================

        visitRepository.delete(visit);
    }


    // ==========================================
    // GET TODAY'S VISITS
    // ==========================================

    @Override
    public List<VisitResponseDto> getTodayVisits(
            Authentication authentication) {

        User currentUser = getCurrentUser(authentication);

        LocalDate today = LocalDate.now();


        // ==========================================
        // ADMIN
        // ==========================================

        if (currentUser.getRole() == Role.ADMIN) {

            return visitRepository
                    .findByScheduledDate(today)
                    .stream()
                    .map(this::buildResponse)
                    .toList();
        }


        // ==========================================
        // ASHA
        // ==========================================

        if (currentUser.getRole() == Role.ASHA) {

            List<String> beneficiaryIds =
                    beneficiaryRepository
                            .findByAshaId(currentUser.getId())
                            .stream()
                            .map(Beneficiary::getId)
                            .toList();


            if (beneficiaryIds.isEmpty()) {

                return List.of();
            }


            return visitRepository
                    .findByBeneficiaryIdInAndScheduledDate(
                            beneficiaryIds,
                            today
                    )
                    .stream()
                    .map(this::buildResponse)
                    .toList();
        }


        // ==========================================
        // ANM
        // ==========================================

        if (currentUser.getRole() == Role.ANM) {

            List<String> ashaIds =
                    userRepository
                            .findByRoleAndSupervisorId(
                                    Role.ASHA,
                                    currentUser.getId()
                            )
                            .stream()
                            .map(User::getId)
                            .toList();


            if (ashaIds.isEmpty()) {

                return List.of();
            }


            List<String> beneficiaryIds =
                    beneficiaryRepository
                            .findByAshaIdIn(ashaIds)
                            .stream()
                            .map(Beneficiary::getId)
                            .toList();


            if (beneficiaryIds.isEmpty()) {

                return List.of();
            }


            return visitRepository
                    .findByBeneficiaryIdInAndScheduledDate(
                            beneficiaryIds,
                            today
                    )
                    .stream()
                    .map(this::buildResponse)
                    .toList();
        }


        return List.of();
    }


    // ==========================================
    // BUILD RESPONSE
    // ==========================================

    private VisitResponseDto buildResponse(
            Visit visit) {

        Beneficiary beneficiary =
                beneficiaryRepository
                        .findById(visit.getBeneficiaryId())
                        .orElse(null);


        VisitResponseDto dto =
                visitMapper.toResponseDto(visit);


        if (beneficiary != null) {

            dto.setBeneficiaryName(
                    beneficiary.getName()
            );

            dto.setCategory(
                    beneficiary.getCategory()
            );

            dto.setVillage(
                    beneficiary.getVillage()
            );

            dto.setPhone(
                    beneficiary.getPhone()
            );
        }


        return dto;
    }


    // ==========================================
    // CHECK VISIT ACCESS
    // ==========================================

    private boolean canAccessVisit(
            User currentUser,
            Visit visit) {

        // ==========================================
        // ADMIN → EVERYTHING
        // ==========================================

        if (currentUser.getRole() == Role.ADMIN) {

            return true;
        }


        // ==========================================
        // FIND BENEFICIARY
        // ==========================================

        Beneficiary beneficiary =
                beneficiaryRepository
                        .findById(visit.getBeneficiaryId())
                        .orElseThrow(
                                () -> new ResourceNotFoundException(
                                        "Beneficiary not found."
                                )
                        );


        // ==========================================
        // ASHA
        // ==========================================

        if (currentUser.getRole() == Role.ASHA) {

            return currentUser.getId()
                    .equals(beneficiary.getAshaId());
        }


        // ==========================================
        // ANM
        // ==========================================

        if (currentUser.getRole() == Role.ANM) {

            List<String> supervisedAshaIds =
                    userRepository
                            .findByRoleAndSupervisorId(
                                    Role.ASHA,
                                    currentUser.getId()
                            )
                            .stream()
                            .map(User::getId)
                            .toList();


            return supervisedAshaIds.contains(
                    beneficiary.getAshaId()
            );
        }


        return false;
    }


    // ==========================================
    // CHECK BENEFICIARY ACCESS FOR CREATE
    // ==========================================

    private boolean canAccessBeneficiaryForVisit(
            User currentUser,
            Beneficiary beneficiary) {

        // ==========================================
        // ADMIN
        // ==========================================

        if (currentUser.getRole() == Role.ADMIN) {

            return true;
        }


        // ==========================================
        // ASHA
        // ==========================================

        if (currentUser.getRole() == Role.ASHA) {

            return currentUser.getId()
                    .equals(beneficiary.getAshaId());
        }


        // ==========================================
        // ANM
        // ==========================================

        if (currentUser.getRole() == Role.ANM) {

            return userRepository
                    .findByRoleAndSupervisorId(
                            Role.ASHA,
                            currentUser.getId()
                    )
                    .stream()
                    .anyMatch(
                            asha -> asha.getId()
                                    .equals(
                                            beneficiary.getAshaId()
                                    )
                    );
        }


        return false;
    }


    // ==========================================
    // GET ACCESSIBLE VISITS
    // ==========================================

    private List<Visit> getAccessibleVisits(
            User currentUser) {

        // ==========================================
        // ADMIN → ALL VISITS
        // ==========================================

        if (currentUser.getRole() == Role.ADMIN) {

            return visitRepository.findAll();
        }


        // ==========================================
        // ASHA → HER BENEFICIARIES
        // ==========================================

        if (currentUser.getRole() == Role.ASHA) {

            List<String> beneficiaryIds =
                    beneficiaryRepository
                            .findByAshaId(currentUser.getId())
                            .stream()
                            .map(Beneficiary::getId)
                            .toList();


            if (beneficiaryIds.isEmpty()) {

                return List.of();
            }


            return visitRepository
                    .findByBeneficiaryIdIn(beneficiaryIds);
        }


        // ==========================================
        // ANM → SUPERVISED ASHA BENEFICIARIES
        // ==========================================

        if (currentUser.getRole() == Role.ANM) {

            List<String> ashaIds =
                    userRepository
                            .findByRoleAndSupervisorId(
                                    Role.ASHA,
                                    currentUser.getId()
                            )
                            .stream()
                            .map(User::getId)
                            .toList();


            if (ashaIds.isEmpty()) {

                return List.of();
            }


            List<String> beneficiaryIds =
                    beneficiaryRepository
                            .findByAshaIdIn(ashaIds)
                            .stream()
                            .map(Beneficiary::getId)
                            .toList();


            if (beneficiaryIds.isEmpty()) {

                return List.of();
            }


            return visitRepository
                    .findByBeneficiaryIdIn(beneficiaryIds);
        }


        return List.of();
    }
}
