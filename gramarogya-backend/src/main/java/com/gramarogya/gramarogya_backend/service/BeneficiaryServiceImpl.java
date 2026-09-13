package com.gramarogya.gramarogya_backend.service;

import com.gramarogya.gramarogya_backend.dto.*;
import com.gramarogya.gramarogya_backend.entity.Beneficiary;
import com.gramarogya.gramarogya_backend.entity.User;
import com.gramarogya.gramarogya_backend.exception.BusinessValidationException;
import com.gramarogya.gramarogya_backend.exception.ResourceNotFoundException;
import com.gramarogya.gramarogya_backend.exception.UnauthorizedException;
import com.gramarogya.gramarogya_backend.mapper.BeneficiaryMapper;
import com.gramarogya.gramarogya_backend.repository.BeneficiaryRepository;
import com.gramarogya.gramarogya_backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BeneficiaryServiceImpl implements BeneficiaryService {

    private final BeneficiaryRepository beneficiaryRepository;
    private final UserRepository userRepository;
    private final BeneficiaryMapper beneficiaryMapper;
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
    // GET ASHAs SUPERVISED BY ANM
    // =========================================================

    private List<String> getSupervisedAshaIds(User anm) {

        return userRepository
                .findBySupervisorId(anm.getId())
                .stream()
                .filter(user -> user.getRole() == Role.ASHA)
                .map(User::getId)
                .toList();
    }


    // =========================================================
    // VALIDATE ASHA ASSIGNMENT
    // =========================================================

    private void validateAshaAssignment(
            User anm,
            String ashaId
    ) {

        if (ashaId == null || ashaId.isBlank()) {
            throw new BusinessValidationException(
                    "ASHA assignment is required."
            );
        }

        User asha = userRepository.findById(ashaId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "ASHA not found"
                        ));

        // Must actually be an ASHA
        if (asha.getRole() != Role.ASHA) {
            throw new UnauthorizedException(
                    "Selected user is not an ASHA."
            );
        }

        // ASHA must belong to this ANM
        if (!anm.getId().equals(asha.getSupervisorId())) {
            throw new UnauthorizedException(
                    "You can only assign beneficiaries to ASHAs under your supervision."
            );
        }
    }


    // =========================================================
    // GET BENEFICIARY WITH ROLE-BASED ACCESS
    // =========================================================

    private Beneficiary getBeneficiaryForCurrentUser(
            Authentication authentication,
            String id
    ) {

        User currentUser = getCurrentUser(authentication);

        Beneficiary beneficiary =
                beneficiaryRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Beneficiary not found"
                                ));


        // -----------------------------------------------------
        // ADMIN
        // -----------------------------------------------------

        if (currentUser.getRole() == Role.ADMIN) {
            return beneficiary;
        }


        // -----------------------------------------------------
        // ASHA
        // -----------------------------------------------------

        if (currentUser.getRole() == Role.ASHA) {

            if (!currentUser.getId().equals(
                    beneficiary.getAshaId()
            )) {

                throw new UnauthorizedException(
                        "This beneficiary is not assigned to you."
                );
            }

            return beneficiary;
        }


        // -----------------------------------------------------
        // ANM
        // -----------------------------------------------------

        if (currentUser.getRole() == Role.ANM) {

            List<String> ashaIds =
                    getSupervisedAshaIds(currentUser);

            if (!ashaIds.contains(
                    beneficiary.getAshaId()
            )) {

                throw new UnauthorizedException(
                        "This beneficiary is not assigned to an ASHA under your supervision."
                );
            }

            return beneficiary;
        }


        throw new UnauthorizedException(
                "You don't have permission to access this beneficiary."
        );
    }

    private BeneficiaryResponseDto toResponseDto(Beneficiary beneficiary) {

        BeneficiaryResponseDto dto =
                beneficiaryMapper.toResponseDto(beneficiary);

        if (beneficiary.getAshaId() != null) {

            userRepository.findById(beneficiary.getAshaId())
                    .ifPresent(asha -> {

                        dto.setAshaName(asha.getName());
                        dto.setAshaEmployeeId(asha.getEmployeeId());

                    });
        }

        return dto;
    }


    // =========================================================
    // CREATE BENEFICIARY
    // =========================================================

    @Override
    public BeneficiaryResponseDto create(
            Authentication authentication,
            CreateBeneficiaryRequestDto dto
    ) {

        User currentUser =
                getCurrentUser(authentication);

        Beneficiary beneficiary =
                beneficiaryMapper.toEntity(dto);


        // -----------------------------------------------------
        // ASHA CREATES BENEFICIARY
        // Automatically assign to herself
        // -----------------------------------------------------

        if (currentUser.getRole() == Role.ASHA) {

            beneficiary.setUserId(
                    currentUser.getId()
            );

            beneficiary.setAshaId(
                    currentUser.getId()
            );
        }


        // -----------------------------------------------------
        // ANM CREATES BENEFICIARY
        // Must explicitly select ASHA
        // -----------------------------------------------------

        else if (currentUser.getRole() == Role.ANM) {

            validateAshaAssignment(
                    currentUser,
                    dto.getAshaId()
            );

            beneficiary.setUserId(
                    currentUser.getId()
            );

            beneficiary.setAshaId(
                    dto.getAshaId()
            );
        }


        else {
            throw new UnauthorizedException(
                    "Only ANM or ASHA users can create beneficiaries."
            );
        }


        beneficiary.setDateAdded(
                LocalDate.now()
        );


        beneficiary =
                beneficiaryRepository.save(
                        beneficiary
                );


        // -----------------------------------------------------
        // ACTIVITY
        // -----------------------------------------------------

        activityService.log(
                currentUser,
                "CREATE",
                "Beneficiary Added",
                beneficiary.getName()
                        + " • "
                        + beneficiary.getVillage(),
                "BENEFICIARY",
                beneficiary.getId(),
                "Beneficiary"
        );


        return beneficiaryMapper.toResponseDto(
                beneficiary
        );
    }


    // =========================================================
    // GET ALL BENEFICIARIES
    // =========================================================

    @Override
    public List<BeneficiaryResponseDto> getAll(
            Authentication authentication
    ) {

        User currentUser =
                getCurrentUser(authentication);

        List<Beneficiary> beneficiaries;


        // -----------------------------------------------------
        // ADMIN
        // -----------------------------------------------------

        if (currentUser.getRole() == Role.ADMIN) {

            beneficiaries =
                    beneficiaryRepository.findAll();
        }


        // -----------------------------------------------------
        // ANM
        // Only beneficiaries assigned to supervised ASHAs
        // -----------------------------------------------------

        else if (currentUser.getRole() == Role.ANM) {

            List<String> ashaIds =
                    getSupervisedAshaIds(currentUser);

            beneficiaries =
                    beneficiaryRepository.findByAshaIdIn(
                            ashaIds
                    );
        }


        // -----------------------------------------------------
        // ASHA
        // Only assigned beneficiaries
        // -----------------------------------------------------

        else if (currentUser.getRole() == Role.ASHA) {

            beneficiaries =
                    beneficiaryRepository.findByAshaId(
                            currentUser.getId()
                    );
        }


        else {
            throw new UnauthorizedException(
                    "You don't have permission to view beneficiaries."
            );
        }


        return beneficiaries.stream()
                .map(beneficiaryMapper::toResponseDto)
                .toList();
    }


    // =========================================================
    // GET BENEFICIARY BY ID
    // =========================================================

    @Override
    public BeneficiaryResponseDto getById(
            Authentication authentication,
            String id
    ) {

        Beneficiary beneficiary =
                getBeneficiaryForCurrentUser(
                        authentication,
                        id
                );

        return toResponseDto(beneficiary);
    }


    // =========================================================
    // UPDATE BENEFICIARY
    // =========================================================

    @Override
    public BeneficiaryResponseDto update(
            Authentication authentication,
            String id,
            UpdateBeneficiaryRequestDto dto
    ) {

        User currentUser =
                getCurrentUser(authentication);

        Beneficiary beneficiary =
                getBeneficiaryForCurrentUser(
                        authentication,
                        id
                );


        // -----------------------------------------------------
        // ANM
        // Can change ASHA assignment
        // -----------------------------------------------------

        if (currentUser.getRole() == Role.ANM) {

            validateAshaAssignment(
                    currentUser,
                    dto.getAshaId()
            );

            beneficiary.setAshaId(
                    dto.getAshaId()
            );
        }


        // -----------------------------------------------------
        // ASHA
        // Cannot change ASHA assignment
        // -----------------------------------------------------

        else if (currentUser.getRole() == Role.ASHA) {

            // Keep existing assignment
            beneficiary.setAshaId(
                    currentUser.getId()
            );
        }


        beneficiaryMapper.updateEntity(
                dto,
                beneficiary
        );


        beneficiary =
                beneficiaryRepository.save(
                        beneficiary
                );


        // -----------------------------------------------------
        // ACTIVITY
        // -----------------------------------------------------

        activityService.log(
                currentUser,
                "UPDATE",
                "Beneficiary Updated",
                beneficiary.getName()
                        + " • "
                        + beneficiary.getVillage(),
                "BENEFICIARY",
                beneficiary.getId(),
                "Beneficiary"
        );


        return beneficiaryMapper.toResponseDto(
                beneficiary
        );
    }


    // =========================================================
    // DELETE BENEFICIARY
    // =========================================================

    @Override
    public void delete(
            Authentication authentication,
            String id
    ) {

        User currentUser =
                getCurrentUser(authentication);

        Beneficiary beneficiary =
                getBeneficiaryForCurrentUser(
                        authentication,
                        id
                );


        // -----------------------------------------------------
        // ACTIVITY BEFORE DELETE
        // -----------------------------------------------------

        activityService.log(
                currentUser,
                "DELETE",
                "Beneficiary Deleted",
                beneficiary.getName(),
                "BENEFICIARY",
                beneficiary.getId(),
                "Beneficiary"
        );


        beneficiaryRepository.delete(
                beneficiary
        );
    }

    @Override
    public List<UserResponseDto> getAvailableAshas(
            Authentication authentication
    ) {

        User currentUser = getCurrentUser(authentication);

        if (currentUser.getRole() != Role.ANM) {
            throw new UnauthorizedException(
                    "Only ANM users can view available ASHAs."
            );
        }

        return userRepository
                .findByRoleAndSupervisorId(
                        Role.ASHA,
                        currentUser.getId()
                )
                .stream()
                .map(user -> UserResponseDto.builder()
                        .id(user.getId())
                        .name(user.getName())
                        .email(user.getEmail())
                        .role(user.getRole())
                        .verificationStatus(user.getVerificationStatus())
                        .accountStatus(user.getAccountStatus())
                        .employeeId(user.getEmployeeId())
                        .supervisorId(user.getSupervisorId())
                        .phone(user.getPhone())
                        .village(user.getVillage())
                        .taluka(user.getTaluka())
                        .district(user.getDistrict())
                        .state(user.getState())
                        .profileImage(user.getProfileImage())
                        .build()
                )
                .toList();
    }
}
