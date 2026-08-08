package com.gramarogya.gramarogya_backend.service;

import com.gramarogya.gramarogya_backend.dto.BeneficiaryResponseDto;
import com.gramarogya.gramarogya_backend.dto.CreateBeneficiaryRequestDto;
import com.gramarogya.gramarogya_backend.dto.Role;
import com.gramarogya.gramarogya_backend.dto.UpdateBeneficiaryRequestDto;
import com.gramarogya.gramarogya_backend.entity.Beneficiary;
import com.gramarogya.gramarogya_backend.entity.User;
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


        // ADMIN can access all beneficiaries
        if (currentUser.getRole() == Role.ADMIN) {

            return beneficiary;
        }


        // ASHA can access only own beneficiaries
        if (currentUser.getRole() == Role.ASHA) {

            if (!beneficiary.getUserId()
                    .equals(currentUser.getId())) {

                throw new UnauthorizedException(
                        "Unauthorized"
                );
            }

            return beneficiary;
        }


        // ANM can access beneficiaries
        // belonging to ASHAs under them
        if (currentUser.getRole() == Role.ANM) {

            List<String> ashaIds =
                    userRepository
                            .findBySupervisorId(currentUser.getId())
                            .stream()
                            .map(User::getId)
                            .toList();


            if (!ashaIds.contains(
                    beneficiary.getUserId()
            )) {

                throw new UnauthorizedException(
                        "Unauthorized"
                );
            }

            return beneficiary;
        }


        throw new UnauthorizedException(
                "Unauthorized"
        );
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


        beneficiary.setUserId(
                currentUser.getId()
        );


        beneficiary.setDateAdded(
                LocalDate.now()
        );


        beneficiary =
                beneficiaryRepository.save(
                        beneficiary
                );


        // CREATE ACTIVITY
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


        // ADMIN
        if (currentUser.getRole() == Role.ADMIN) {

            beneficiaries =
                    beneficiaryRepository.findAll();
        }


        // ANM
        else if (currentUser.getRole() == Role.ANM) {

            List<String> ashaIds =
                    userRepository
                            .findBySupervisorId(
                                    currentUser.getId()
                            )
                            .stream()
                            .map(User::getId)
                            .toList();


            beneficiaries =
                    beneficiaryRepository
                            .findByUserIdIn(ashaIds);
        }


        // ASHA
        else {

            beneficiaries =
                    beneficiaryRepository
                            .findByUserId(
                                    currentUser.getId()
                            );
        }


        return beneficiaries.stream()
                .map(
                        beneficiaryMapper::toResponseDto
                )
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


        return beneficiaryMapper.toResponseDto(
                beneficiary
        );
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


        beneficiaryMapper.updateEntity(
                dto,
                beneficiary
        );


        beneficiary =
                beneficiaryRepository.save(
                        beneficiary
                );


        // CREATE ACTIVITY
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


        String beneficiaryName =
                beneficiary.getName();


        String beneficiaryId =
                beneficiary.getId();


        // CREATE ACTIVITY BEFORE DELETE
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
}