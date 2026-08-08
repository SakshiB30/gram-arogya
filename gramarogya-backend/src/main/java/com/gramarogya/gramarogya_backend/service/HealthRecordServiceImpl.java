package com.gramarogya.gramarogya_backend.service;

import com.gramarogya.gramarogya_backend.dto.CreateHealthRecordRequestDto;
import com.gramarogya.gramarogya_backend.dto.HealthRecordResponseDto;
import com.gramarogya.gramarogya_backend.dto.UpdateHealthRecordRequestDto;
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

    // Activity logging
    private final ActivityService activityService;


    // =====================================================
    // CURRENT USER
    // =====================================================

    private User getCurrentUser(
            Authentication authentication) {

        String email = authentication.getName();

        return userRepository.findByEmail(email)
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


        Beneficiary beneficiary =
                beneficiaryRepository
                        .findById(
                                requestDto.getBeneficiaryId()
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Beneficiary not found"
                                )
                        );


        Visit visit =
                visitRepository
                        .findById(
                                requestDto.getVisitId()
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Visit not found"
                                )
                        );


        // Validate that the visit belongs to the beneficiary
        if (!visit.getBeneficiaryId()
                .equals(beneficiary.getId())) {

            throw new IllegalArgumentException(
                    "Selected visit does not belong to the selected beneficiary."
            );
        }


        HealthRecord healthRecord =
                healthRecordMapper.toEntity(
                        requestDto
                );


        healthRecord.setCreatedAt(
                LocalDateTime.now()
        );

        healthRecord.setUpdatedAt(
                LocalDateTime.now()
        );


        HealthRecord saved =
                healthRecordRepository.save(
                        healthRecord
                );


        // =================================================
        // ACTIVITY
        // =================================================

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

        getCurrentUser(authentication);

        return healthRecordRepository
                .findAll()
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

        getCurrentUser(authentication);

        return healthRecordRepository
                .findByBeneficiaryId(beneficiaryId)
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

        getCurrentUser(authentication);

        return healthRecordRepository
                .findByVisitId(visitId)
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


        HealthRecord healthRecord =
                healthRecordRepository
                        .findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Health Record not found with id: "
                                                + id
                                )
                        );


        Beneficiary beneficiary =
                beneficiaryRepository
                        .findById(
                                requestDto.getBeneficiaryId()
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Beneficiary not found"
                                )
                        );


        Visit visit =
                visitRepository
                        .findById(
                                requestDto.getVisitId()
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Visit not found"
                                )
                        );


        // Validate that the visit belongs to the beneficiary
        if (!visit.getBeneficiaryId()
                .equals(beneficiary.getId())) {

            throw new IllegalArgumentException(
                    "Selected visit does not belong to the selected beneficiary."
            );
        }


        healthRecordMapper.updateEntity(
                requestDto,
                healthRecord
        );


        healthRecord.setUpdatedAt(
                LocalDateTime.now()
        );


        HealthRecord updated =
                healthRecordRepository.save(
                        healthRecord
                );


        // =================================================
        // ACTIVITY
        // =================================================

        activityService.log(
                currentUser,
                "UPDATE",
                "Health Record Updated",
                beneficiary.getName()
                        + " • "
                        + beneficiary.getVillage(),
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


        HealthRecord healthRecord =
                healthRecordRepository
                        .findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Health Record not found with id: "
                                                + id
                                )
                        );


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


        // =================================================
        // ACTIVITY BEFORE DELETE
        // =================================================

        activityService.log(
                currentUser,
                "DELETE",
                "Health Record Deleted",
                description,
                "HEALTH_RECORD",
                healthRecord.getId(),
                "HealthRecord"
        );


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
}

