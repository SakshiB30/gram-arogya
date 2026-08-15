package com.gramarogya.gramarogya_backend.service;

import com.gramarogya.gramarogya_backend.dto.Health_Records.CreateHealthRecordRequestDto;
import com.gramarogya.gramarogya_backend.dto.Health_Records.HealthRecordResponseDto;
import com.gramarogya.gramarogya_backend.dto.Health_Records.UpdateHealthRecordRequestDto;
import com.gramarogya.gramarogya_backend.entity.Beneficiary;
import com.gramarogya.gramarogya_backend.entity.HealthRecord;
import com.gramarogya.gramarogya_backend.entity.User;
import com.gramarogya.gramarogya_backend.entity.Visit;
import com.gramarogya.gramarogya_backend.exception.ResourceNotFoundException;
import com.gramarogya.gramarogya_backend.mapper.HealthRecordMapper;
import com.gramarogya.gramarogya_backend.repository.BeneficiaryRepository;
import com.gramarogya.gramarogya_backend.repository.HealthRecordRepository;
import com.gramarogya.gramarogya_backend.repository.UserRepository;
import com.gramarogya.gramarogya_backend.repository.VisitRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class HealthRecordServiceImpl implements HealthRecordService {

    private final HealthRecordRepository healthRecordRepository;
    private final BeneficiaryRepository beneficiaryRepository;
    private final VisitRepository visitRepository;
    private final UserRepository userRepository;
    private final HealthRecordMapper healthRecordMapper;
    private final ActivityService activityService;


    // =====================================================
    // CURRENT USER
    // =====================================================

    private User getCurrentUser(
            Authentication authentication) {

        if (authentication == null ||
                authentication.getName() == null) {

            throw new IllegalArgumentException(
                    "User authentication is required"
            );
        }

        return userRepository
                .findByEmail(authentication.getName())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found"
                        )
                );
    }


    // =====================================================
    // CREATE HEALTH RECORD
    // =====================================================

    @Override
    public HealthRecordResponseDto createHealthRecord(
            Authentication authentication,
            CreateHealthRecordRequestDto requestDto) {

        User currentUser =
                getCurrentUser(authentication);


        // -----------------------------------------
        // Find beneficiary
        // -----------------------------------------

        Beneficiary beneficiary =
                beneficiaryRepository
                        .findById(
                                requestDto.getBeneficiaryId()
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Beneficiary not found with id: "
                                                + requestDto.getBeneficiaryId()
                                )
                        );


        // -----------------------------------------
        // Find visit
        // -----------------------------------------

        Visit visit =
                visitRepository
                        .findById(
                                requestDto.getVisitId()
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Visit not found with id: "
                                                + requestDto.getVisitId()
                                )
                        );


        // -----------------------------------------
        // Validate visit belongs to beneficiary
        // -----------------------------------------

        if (!beneficiary.getId()
                .equals(visit.getBeneficiaryId())) {

            throw new IllegalArgumentException(
                    "Selected visit does not belong to the selected beneficiary."
            );
        }


        // -----------------------------------------
        // Convert DTO -> Entity
        // -----------------------------------------

        HealthRecord healthRecord =
                healthRecordMapper.toEntity(requestDto);


        // -----------------------------------------
        // Recorded by
        // -----------------------------------------

        healthRecord.setRecordedBy(
                currentUser.getId()
        );


        // -----------------------------------------
        // Timestamps
        // -----------------------------------------

        LocalDateTime now =
                LocalDateTime.now();

        healthRecord.setCreatedAt(now);
        healthRecord.setUpdatedAt(now);


        // -----------------------------------------
        // Save
        // -----------------------------------------

        HealthRecord saved =
                healthRecordRepository.save(
                        healthRecord
                );


        // -----------------------------------------
        // Activity
        // -----------------------------------------

        activityService.log(
                currentUser,
                "CREATE",
                "Health Record Added",
                beneficiary.getName()
                        + " • "
                        + beneficiary.getVillage(),
                "HEALTH_RECORD",
                saved.getId(),
                "HealthRecord"
        );


        return mapToResponse(saved);
    }


    // =====================================================
    // GET ALL HEALTH RECORDS
    // =====================================================

    @Override
    public List<HealthRecordResponseDto> getAllHealthRecords(
            Authentication authentication) {

        User currentUser =
                getCurrentUser(authentication);

        /*
         * Only return records belonging to beneficiaries
         * managed by the current user.
         */
        List<String> beneficiaryIds =
                beneficiaryRepository
                        .findByUserId(currentUser.getId())
                        .stream()
                        .map(Beneficiary::getId)
                        .toList();

        if (beneficiaryIds.isEmpty()) {
            return List.of();
        }

        return healthRecordRepository
                .findTop5ByBeneficiaryIdInOrderByCreatedAtDesc(
                        beneficiaryIds
                )
                .stream()
                .map(this::mapToResponse)
                .toList();
    }


    // =====================================================
    // GET HEALTH RECORD BY ID
    // =====================================================

    @Override
    public HealthRecordResponseDto getHealthRecordById(
            Authentication authentication,
            String id) {

        User currentUser =
                getCurrentUser(authentication);


        HealthRecord healthRecord =
                healthRecordRepository
                        .findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Health Record not found with id: "
                                                + id
                                )
                        );


        // -----------------------------------------
        // Authorization
        // -----------------------------------------

        validateBeneficiaryAccess(
                currentUser,
                healthRecord.getBeneficiaryId()
        );


        return mapToResponse(healthRecord);
    }


    // =====================================================
    // GET HEALTH RECORDS BY BENEFICIARY
    // =====================================================

    @Override
    public List<HealthRecordResponseDto>
    getHealthRecordsByBeneficiaryId(
            Authentication authentication,
            String beneficiaryId) {

        User currentUser =
                getCurrentUser(authentication);


        validateBeneficiaryAccess(
                currentUser,
                beneficiaryId
        );


        return healthRecordRepository
                .findByBeneficiaryIdOrderByCreatedAtDesc(
                        beneficiaryId
                )
                .stream()
                .map(this::mapToResponse)
                .toList();
    }


    // =====================================================
    // GET HEALTH RECORDS BY VISIT
    // =====================================================

    @Override
    public List<HealthRecordResponseDto>
    getHealthRecordsByVisitId(
            Authentication authentication,
            String visitId) {

        User currentUser =
                getCurrentUser(authentication);


        Visit visit =
                visitRepository
                        .findById(visitId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Visit not found with id: "
                                                + visitId
                                )
                        );


        validateBeneficiaryAccess(
                currentUser,
                visit.getBeneficiaryId()
        );


        return healthRecordRepository
                .findByVisitIdOrderByCreatedAtDesc(
                        visitId
                )
                .stream()
                .map(this::mapToResponse)
                .toList();
    }


    // =====================================================
    // UPDATE HEALTH RECORD
    // =====================================================

    @Override
    public HealthRecordResponseDto updateHealthRecord(
            Authentication authentication,
            String id,
            UpdateHealthRecordRequestDto requestDto) {

        User currentUser =
                getCurrentUser(authentication);


        // -----------------------------------------
        // Find existing record
        // -----------------------------------------

        HealthRecord healthRecord =
                healthRecordRepository
                        .findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Health Record not found with id: "
                                                + id
                                )
                        );


        // -----------------------------------------
        // Authorization
        // -----------------------------------------

        validateBeneficiaryAccess(
                currentUser,
                healthRecord.getBeneficiaryId()
        );


        // -----------------------------------------
        // Update editable fields only
        // -----------------------------------------

        healthRecordMapper.updateEntity(
                requestDto,
                healthRecord
        );


        // -----------------------------------------
        // Update timestamp
        // -----------------------------------------

        healthRecord.setUpdatedAt(
                LocalDateTime.now()
        );


        // -----------------------------------------
        // Save
        // -----------------------------------------

        HealthRecord updated =
                healthRecordRepository.save(
                        healthRecord
                );


        // -----------------------------------------
        // Get beneficiary for activity
        // -----------------------------------------

        Beneficiary beneficiary =
                beneficiaryRepository
                        .findById(
                                updated.getBeneficiaryId()
                        )
                        .orElse(null);


        String description;

        if (beneficiary != null) {

            description =
                    beneficiary.getName()
                            + " • "
                            + beneficiary.getVillage();

        } else {

            description =
                    "Health record updated";
        }


        // -----------------------------------------
        // Activity
        // -----------------------------------------

        activityService.log(
                currentUser,
                "UPDATE",
                "Health Record Updated",
                description,
                "HEALTH_RECORD",
                updated.getId(),
                "HealthRecord"
        );


        return mapToResponse(updated);
    }


    // =====================================================
    // DELETE HEALTH RECORD
    // =====================================================

    @Override
    public void deleteHealthRecord(
            Authentication authentication,
            String id) {

        User currentUser =
                getCurrentUser(authentication);


        // -----------------------------------------
        // Find record
        // -----------------------------------------

        HealthRecord healthRecord =
                healthRecordRepository
                        .findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Health Record not found with id: "
                                                + id
                                )
                        );


        // -----------------------------------------
        // Authorization
        // -----------------------------------------

        validateBeneficiaryAccess(
                currentUser,
                healthRecord.getBeneficiaryId()
        );


        // -----------------------------------------
        // Find beneficiary
        // -----------------------------------------

        Beneficiary beneficiary =
                beneficiaryRepository
                        .findById(
                                healthRecord.getBeneficiaryId()
                        )
                        .orElse(null);


        String description;

        if (beneficiary != null) {

            description =
                    beneficiary.getName()
                            + " • "
                            + beneficiary.getVillage();

        } else {

            description =
                    "Health record deleted";
        }


        // -----------------------------------------
        // Activity BEFORE delete
        // -----------------------------------------

        activityService.log(
                currentUser,
                "DELETE",
                "Health Record Deleted",
                description,
                "HEALTH_RECORD",
                healthRecord.getId(),
                "HealthRecord"
        );


        // -----------------------------------------
        // Delete
        // -----------------------------------------

        healthRecordRepository.delete(
                healthRecord
        );
    }


    // =====================================================
    // MAP TO RESPONSE
    // =====================================================

    private HealthRecordResponseDto mapToResponse(
            HealthRecord healthRecord) {

        Beneficiary beneficiary =
                beneficiaryRepository
                        .findById(
                                healthRecord.getBeneficiaryId()
                        )
                        .orElse(null);


        Visit visit =
                visitRepository
                        .findById(
                                healthRecord.getVisitId()
                        )
                        .orElse(null);


        return healthRecordMapper.toResponseDto(
                healthRecord,
                beneficiary,
                visit
        );
    }


    // =====================================================
    // AUTHORIZATION
    // =====================================================

    private void validateBeneficiaryAccess(
            User currentUser,
            String beneficiaryId) {

        Beneficiary beneficiary =
                beneficiaryRepository
                        .findById(beneficiaryId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Beneficiary not found with id: "
                                                + beneficiaryId
                                )
                        );


        if (!currentUser.getId()
                .equals(beneficiary.getUserId())) {

            throw new IllegalArgumentException(
                    "You do not have access to this beneficiary's health records."
            );
        }
    }
}