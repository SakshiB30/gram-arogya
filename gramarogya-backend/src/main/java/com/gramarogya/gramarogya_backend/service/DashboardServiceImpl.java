package com.gramarogya.gramarogya_backend.service;

import com.gramarogya.gramarogya_backend.dto.DashboardResponseDto;
import com.gramarogya.gramarogya_backend.entity.User;
import com.gramarogya.gramarogya_backend.exception.ResourceNotFoundException;
import com.gramarogya.gramarogya_backend.repository.BeneficiaryRepository;
import com.gramarogya.gramarogya_backend.repository.UserRepository;
import com.gramarogya.gramarogya_backend.repository.VisitRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

    private final BeneficiaryRepository beneficiaryRepository;
    private final VisitRepository visitRepository;
    private final UserRepository userRepository;

    private User getCurrentUser(Authentication authentication) {

        String email = authentication.getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));
    }

    @Override
    public DashboardResponseDto getDashboard(Authentication authentication) {

        User currentUser = getCurrentUser(authentication);

        String userId = currentUser.getId();

        return DashboardResponseDto.builder()
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
    }
}