package com.gramarogya.gramarogya_backend.service;

import com.gramarogya.gramarogya_backend.dto.*;
import com.gramarogya.gramarogya_backend.entity.User;
import com.gramarogya.gramarogya_backend.mapper.UserMapper;
import com.gramarogya.gramarogya_backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AnmServiceImpl implements AnmService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;

    private User getLoggedInAnm(Authentication authentication) {

        return userRepository.findByEmail(authentication.getName())
                .orElseThrow(() ->
                        new RuntimeException("ANM not found"));
    }

    @Override
    public List<UserResponseDto> getPendingAshas(Authentication authentication) {

        User anm = getLoggedInAnm(authentication);

        List<User> pendingAshas =
                userRepository.findBySupervisorIdAndVerificationStatus(
                        anm.getId(),
                        VerificationStatus.PENDING
                );

        return pendingAshas.stream()
                .map(userMapper::toResponseDto)
                .toList();
    }

    @Override
    public UserResponseDto approveAsha(String ashaId,
                                       Authentication authentication) {

        // Logged-in ANM
        User anm = getLoggedInAnm(authentication);

        // Find ASHA
        User asha = userRepository.findById(ashaId)
                .orElseThrow(() ->
                        new RuntimeException("ASHA not found"));

        // Ensure this ASHA belongs to this ANM
        if (!anm.getId().equals(asha.getSupervisorId()))  {
            throw new RuntimeException("You are not authorized to approve this ASHA.");
        }

        // Already approved?
        if (asha.getVerificationStatus() == VerificationStatus.APPROVED) {
            throw new RuntimeException("ASHA is already approved.");
        }

        // Approve account
        asha.setVerificationStatus(VerificationStatus.APPROVED);
        asha.setAccountStatus(AccountStatus.ACTIVE);

        userRepository.save(asha);

        return userMapper.toResponseDto(asha);
    }

    @Override
    public UserResponseDto rejectAsha(String ashaId,
                                      Authentication authentication) {

        // Logged-in ANM
        User anm = getLoggedInAnm(authentication);

        // Find ASHA
        User asha = userRepository.findById(ashaId)
                .orElseThrow(() ->
                        new RuntimeException("ASHA not found"));

        // Ensure this ASHA belongs to this ANM
        if (!anm.getId().equals(asha.getSupervisorId())) {
            throw new RuntimeException(
                    "You are not authorized to reject this ASHA.");
        }

        // Already rejected?
        if (asha.getVerificationStatus() == VerificationStatus.REJECTED) {
            throw new RuntimeException("ASHA is already rejected.");
        }

        // Reject account
        asha.setVerificationStatus(VerificationStatus.REJECTED);
        asha.setAccountStatus(AccountStatus.BLOCKED);

        userRepository.save(asha);

        return userMapper.toResponseDto(asha);
    }

    @Override
    public List<UserResponseDto> getMyAshas(Authentication authentication) {

        User anm = getLoggedInAnm(authentication);

        List<User> ashas =
                userRepository.findBySupervisorId(
                        anm.getId()
                );

        return ashas.stream()
                .map(userMapper::toResponseDto)
                .toList();
    }

    @Override
    public AnmDashboardDto getDashboard(Authentication authentication) {
        // Get logged-in ANM
        User anm = getLoggedInAnm(authentication);

        return AnmDashboardDto.builder()

                .totalAshas(
                        userRepository.countBySupervisorId(
                                anm.getId()
                        )
                )

                .pendingAshas(
                        userRepository.countBySupervisorIdAndVerificationStatus(
                                anm.getId(),
                                VerificationStatus.PENDING
                        )
                )

                .approvedAshas(
                        userRepository.countBySupervisorIdAndVerificationStatus(
                                anm.getId(),
                                VerificationStatus.APPROVED
                        )
                )

                .rejectedAshas(
                        userRepository.countBySupervisorIdAndVerificationStatus(
                                anm.getId(),
                                VerificationStatus.REJECTED
                        )
                )

                .build();
    }

    @Override
    public UserResponseDto blockAsha(
            String ashaId,
            Authentication authentication) {

        User anm = getLoggedInAnm(authentication);

        User asha = userRepository.findById(ashaId)
                .orElseThrow(() ->
                        new RuntimeException("ASHA not found"));

        if (!anm.getId().equals(asha.getSupervisorId())) {
            throw new RuntimeException(
                    "You are not authorized to block this ASHA.");
        }

        if (asha.getAccountStatus() == AccountStatus.BLOCKED) {
            throw new RuntimeException("ASHA is already blocked.");
        }

        asha.setAccountStatus(AccountStatus.BLOCKED);

        userRepository.save(asha);

        return userMapper.toResponseDto(asha);
    }

    @Override
    public UserResponseDto unblockAsha(
            String ashaId,
            Authentication authentication) {

        // Logged-in ANM
        User anm = getLoggedInAnm(authentication);

        // Find ASHA
        User asha = userRepository.findById(ashaId)
                .orElseThrow(() ->
                        new RuntimeException("ASHA not found"));

        // Check ownership
        if (!anm.getId().equals(asha.getSupervisorId())) {
            throw new RuntimeException(
                    "You are not authorized to unblock this ASHA.");
        }

        // Already Active?
        if (asha.getAccountStatus() == AccountStatus.ACTIVE) {
            throw new RuntimeException(
                    "ASHA is already active.");
        }

        // Activate account
        asha.setAccountStatus(AccountStatus.ACTIVE);

        userRepository.save(asha);

        return userMapper.toResponseDto(asha);
    }

    @Override
    public List<UserResponseDto> getAllAshas(
            Authentication authentication) {

        // Logged in ANM
        User anm = userRepository
                .findByEmail(authentication.getName())
                .orElseThrow(() ->
                        new RuntimeException("ANM not found"));

        return userRepository
                .findByRoleAndSupervisorId(
                        Role.ASHA,
                        anm.getId()
                )
                .stream()
                .map(userMapper::toResponseDto)
                .toList();
    }
}

