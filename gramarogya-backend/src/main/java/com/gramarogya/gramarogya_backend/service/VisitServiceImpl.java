package com.gramarogya.gramarogya_backend.service;

import com.gramarogya.gramarogya_backend.dto.CreateVisitRequestDto;
import com.gramarogya.gramarogya_backend.dto.UpdateVisitRequestDto;
import com.gramarogya.gramarogya_backend.dto.VisitResponseDto;
import com.gramarogya.gramarogya_backend.entity.Beneficiary;
import com.gramarogya.gramarogya_backend.entity.Visit;
import com.gramarogya.gramarogya_backend.entity.User;
import com.gramarogya.gramarogya_backend.mapper.VisitMapper;
import com.gramarogya.gramarogya_backend.repository.BeneficiaryRepository;
import com.gramarogya.gramarogya_backend.repository.VisitRepository;
import com.gramarogya.gramarogya_backend.repository.UserRepository;
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
                        () -> new RuntimeException("User not found")
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


        // Make sure beneficiary exists
        Beneficiary beneficiary =
                beneficiaryRepository.findById(dto.getBeneficiaryId())
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Beneficiary not found"
                                )
                        );


        Visit visit = visitMapper.toEntity(dto);

        visit.setUserId(currentUser.getId());

        // Actual visit/creation date
        visit.setVisitDate(LocalDate.now());


        // Save visit first so that visit.getId() is available
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

        return visitRepository
                .findByUserId(currentUser.getId())
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
                                () -> new RuntimeException(
                                        "Visit not found"
                                )
                        );


        if (!visit.getUserId().equals(currentUser.getId())) {
            throw new RuntimeException("Unauthorized");
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
                                () -> new RuntimeException(
                                        "Visit not found"
                                )
                        );


        if (!visit.getUserId().equals(currentUser.getId())) {
            throw new RuntimeException("Unauthorized");
        }


        visitMapper.updateEntity(dto, visit);

        visit = visitRepository.save(visit);


        // ==========================================
        // UPDATE ACTIVITY
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

            description = "Visit details updated";
        }


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
                                () -> new RuntimeException(
                                        "Visit not found"
                                )
                        );


        if (!visit.getUserId().equals(currentUser.getId())) {
            throw new RuntimeException("Unauthorized");
        }


        // Get beneficiary information BEFORE deleting
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

            description = "Visit deleted";
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


        // Delete visit AFTER activity is logged
        visitRepository.delete(visit);
    }


    // ==========================================
    // BUILD RESPONSE
    // ==========================================

    private VisitResponseDto buildResponse(Visit visit) {

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
}