package com.gramarogya.gramarogya_backend.service.medicine;

import com.gramarogya.gramarogya_backend.dto.medicine.CreateMedicineFollowUpRequestDto;
import com.gramarogya.gramarogya_backend.dto.medicine.MedicineFollowUpResponseDto;
import com.gramarogya.gramarogya_backend.entity.Beneficiary;
import com.gramarogya.gramarogya_backend.entity.User;
import com.gramarogya.gramarogya_backend.entity.Visit;
import com.gramarogya.gramarogya_backend.dto.Role;
import com.gramarogya.gramarogya_backend.entity.medicine.MedicineFollowUp;
import com.gramarogya.gramarogya_backend.exception.BusinessValidationException;
import com.gramarogya.gramarogya_backend.mapper.medicine.MedicineFollowUpMapper;
import com.gramarogya.gramarogya_backend.repository.BeneficiaryRepository;
import com.gramarogya.gramarogya_backend.repository.UserRepository;
import com.gramarogya.gramarogya_backend.repository.VisitRepository;
import com.gramarogya.gramarogya_backend.repository.medicine.MedicineFollowUpRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MedicineFollowUpServiceImpl implements MedicineFollowUpService {

    private final MedicineFollowUpRepository medicineFollowUpRepository;
    private final BeneficiaryRepository beneficiaryRepository;
    private final VisitRepository visitRepository;
    private final UserRepository userRepository;
    private final MedicineFollowUpMapper medicineFollowUpMapper;


    // =========================================================
    // GET CURRENT LOGGED-IN USER
    // =========================================================

    private User getCurrentUser(Authentication authentication) {

        String email = authentication.getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new BusinessValidationException("User not found"));
    }


    // =========================================================
    // GET CURRENT USER ID
    // =========================================================

    private String getCurrentUserId(Authentication authentication) {

        return getCurrentUser(authentication).getId();
    }


    // =========================================================
    // GET USER ROLE
    // =========================================================

    private Role getRole(Authentication authentication) {

        String authority = authentication.getAuthorities()
                .stream()
                .findFirst()
                .map(a -> a.getAuthority())
                .orElse("");

        String role = authority.replace("ROLE_", "");

        try {
            return Role.valueOf(role);
        } catch (IllegalArgumentException e) {
            throw new BusinessValidationException("Invalid user role");
        }
    }


    // =========================================================
    // CREATE MEDICINE FOLLOW-UP
    // =========================================================

    @Override
    @PreAuthorize("hasRole('ASHA')")
    public MedicineFollowUpResponseDto createFollowUp(
            CreateMedicineFollowUpRequestDto request,
            Authentication authentication) {

        User currentUser = getCurrentUser(authentication);

        String currentUserId = currentUser.getId();


        // -----------------------------------------------------
        // Validate Beneficiary
        // -----------------------------------------------------

        Beneficiary beneficiary = beneficiaryRepository
                .findById(request.getBeneficiaryId())
                .orElseThrow(() ->
                        new BusinessValidationException(
                                "Beneficiary not found"));


        // -----------------------------------------------------
        // Validate Visit
        // -----------------------------------------------------

        Visit visit = visitRepository
                .findById(request.getVisitId())
                .orElseThrow(() ->
                        new BusinessValidationException(
                                "Visit not found"));


        // -----------------------------------------------------
        // Validate Visit belongs to Beneficiary
        // -----------------------------------------------------

        if (!request.getBeneficiaryId()
                .equals(visit.getBeneficiaryId())) {

            throw new BusinessValidationException(
                    "Visit does not belong to this beneficiary");
        }


        // -----------------------------------------------------
        // Validate Visit belongs to logged-in ASHA
        //
        // IMPORTANT:
        // Visit.userId contains User.id
        // authentication.getName() contains email
        // -----------------------------------------------------

        if (!currentUserId.equals(visit.getUserId())) {

            throw new BusinessValidationException(
                    "You are not authorized to record follow-up for this visit");
        }


        // -----------------------------------------------------
        // Validate Doctor Visit / Referral Reason
        // -----------------------------------------------------

        if (Boolean.TRUE.equals(request.getNeedsDoctorVisit())) {

            if (request.getReferralReason() == null ||
                    request.getReferralReason().trim().isEmpty()) {

                throw new BusinessValidationException(
                        "Referral reason is required when doctor visit is needed");
            }
        }


        // -----------------------------------------------------
        // Create Entity
        // -----------------------------------------------------

        MedicineFollowUp followUp =
                medicineFollowUpMapper.toEntity(request);


        // -----------------------------------------------------
        // System Generated Fields
        // -----------------------------------------------------

        followUp.setFollowUpDate(LocalDate.now());

        followUp.setRecordedBy(currentUserId);

        followUp.setCreatedAt(LocalDateTime.now());

        followUp.setUpdatedAt(LocalDateTime.now());


        // -----------------------------------------------------
        // Save
        // -----------------------------------------------------

        MedicineFollowUp savedFollowUp =
                medicineFollowUpRepository.save(followUp);


        // -----------------------------------------------------
        // Return Response
        // -----------------------------------------------------

        return medicineFollowUpMapper.toResponseDto(savedFollowUp);
    }


    // =========================================================
    // GET FOLLOW-UPS BY BENEFICIARY
    // =========================================================

    @Override
    @PreAuthorize("hasAnyRole('ADMIN', 'ANM', 'ASHA')")
    public List<MedicineFollowUpResponseDto> getFollowUpsByBeneficiary(
            String beneficiaryId,
            Authentication authentication) {

        User currentUser = getCurrentUser(authentication);

        Role role = getRole(authentication);


        // -----------------------------------------------------
        // Validate Beneficiary
        // -----------------------------------------------------

        beneficiaryRepository.findById(beneficiaryId)
                .orElseThrow(() ->
                        new BusinessValidationException(
                                "Beneficiary not found"));


        // -----------------------------------------------------
        // ASHA can only see beneficiaries associated with
        // her own visits.
        // -----------------------------------------------------

        if (role == Role.ASHA) {

            boolean hasAccess =
                    !visitRepository
                            .findByBeneficiaryIdAndUserId(
                                    beneficiaryId,
                                    currentUser.getId())
                            .isEmpty();

            if (!hasAccess) {

                throw new BusinessValidationException(
                        "You are not authorized to view follow-ups for this beneficiary");
            }
        }


        // -----------------------------------------------------
        // Get Follow-Ups
        // -----------------------------------------------------

        return medicineFollowUpRepository
                .findByBeneficiaryIdOrderByFollowUpDateDesc(
                        beneficiaryId)
                .stream()
                .map(medicineFollowUpMapper::toResponseDto)
                .toList();
    }


    // =========================================================
    // GET FOLLOW-UPS BY VISIT
    // =========================================================

    @Override
    @PreAuthorize("hasAnyRole('ADMIN', 'ANM', 'ASHA')")
    public List<MedicineFollowUpResponseDto> getFollowUpsByVisit(
            String visitId,
            Authentication authentication) {

        User currentUser = getCurrentUser(authentication);

        Role role = getRole(authentication);


        // -----------------------------------------------------
        // Validate Visit
        // -----------------------------------------------------

        Visit visit = visitRepository
                .findById(visitId)
                .orElseThrow(() ->
                        new BusinessValidationException(
                                "Visit not found"));


        // -----------------------------------------------------
        // ASHA can only see her own visit
        // -----------------------------------------------------

        if (role == Role.ASHA) {

            if (!currentUser.getId().equals(visit.getUserId())) {

                throw new BusinessValidationException(
                        "You are not authorized to view follow-ups for this visit");
            }
        }


        // -----------------------------------------------------
        // Get Follow-Ups
        // -----------------------------------------------------

        return medicineFollowUpRepository
                .findByVisitIdOrderByFollowUpDateDesc(visitId)
                .stream()
                .map(medicineFollowUpMapper::toResponseDto)
                .toList();
    }


    // =========================================================
    // GET FOLLOW-UP BY ID
    // =========================================================

    @Override
    @PreAuthorize("hasAnyRole('ADMIN', 'ANM', 'ASHA')")
    public MedicineFollowUpResponseDto getFollowUpById(
            String id,
            Authentication authentication) {

        User currentUser = getCurrentUser(authentication);

        Role role = getRole(authentication);


        // -----------------------------------------------------
        // Find Follow-Up
        // -----------------------------------------------------

        MedicineFollowUp followUp =
                medicineFollowUpRepository.findById(id)
                        .orElseThrow(() ->
                                new BusinessValidationException(
                                        "Medicine follow-up not found"));


        // -----------------------------------------------------
        // ASHA Authorization
        // -----------------------------------------------------

        if (role == Role.ASHA) {

            if (!currentUser.getId()
                    .equals(followUp.getRecordedBy())) {

                throw new BusinessValidationException(
                        "You are not authorized to view this follow-up");
            }
        }


        // -----------------------------------------------------
        // Return Response
        // -----------------------------------------------------

        return medicineFollowUpMapper.toResponseDto(followUp);
    }
}