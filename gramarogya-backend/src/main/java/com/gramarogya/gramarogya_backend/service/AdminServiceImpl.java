package com.gramarogya.gramarogya_backend.service;

import com.gramarogya.gramarogya_backend.dto.AccountStatus;
import com.gramarogya.gramarogya_backend.dto.Role;
import com.gramarogya.gramarogya_backend.dto.UserResponseDto;
import com.gramarogya.gramarogya_backend.dto.VerificationStatus;
import com.gramarogya.gramarogya_backend.entity.User;
import com.gramarogya.gramarogya_backend.exception.BusinessValidationException;
import com.gramarogya.gramarogya_backend.exception.ConflictException;
import com.gramarogya.gramarogya_backend.exception.ResourceNotFoundException;
import com.gramarogya.gramarogya_backend.mapper.UserMapper;
import com.gramarogya.gramarogya_backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {

    private final UserRepository userRepository;

    private final UserMapper userMapper;

    private String generateAnmEmployeeId() {

        Optional<User> lastAnm =
                userRepository.findTopByRoleOrderByEmployeeIdDesc(Role.ANM);

        if (lastAnm.isEmpty()) {
            return "ANM001";
        }

        String lastId = lastAnm.get().getEmployeeId();

        int number = Integer.parseInt(lastId.substring(3));

        number++;

        return String.format("ANM%03d", number);
    }


    @Override
    public List<UserResponseDto> getPendingAnms() {

        return userRepository
                .findByRoleAndVerificationStatus(
                        Role.ANM,
                        VerificationStatus.PENDING
                )
                .stream()
                .map(userMapper::toResponseDto)
                .toList();
    }

    @Override
    public UserResponseDto approveAnm(String id) {

        User anm = userRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("ANM not found."));

        if (anm.getRole() != Role.ANM) {
            throw new BusinessValidationException("Selected user is not an ANM.");
        }

        if (anm.getVerificationStatus() == VerificationStatus.APPROVED) {
            throw new ConflictException("This ANM is already verified.");
        }

        anm.setVerificationStatus(VerificationStatus.APPROVED);

        anm.setAccountStatus(AccountStatus.ACTIVE);

        if (anm.getEmployeeId() == null) {
            anm.setEmployeeId(generateAnmEmployeeId());
        }

        anm = userRepository.save(anm);

        return userMapper.toResponseDto(anm);
    }

    @Override
    public UserResponseDto rejectAnm(String id) {

        User anm = userRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("ANM not found."));

        if (anm.getRole() != Role.ANM) {
            throw new BusinessValidationException("Selected user is not an ANM.");
        }

        if (anm.getVerificationStatus() == VerificationStatus.REJECTED) {
            throw new ConflictException("This ANM registration is already rejected.");
        }

        anm.setVerificationStatus(VerificationStatus.REJECTED);

        anm.setAccountStatus(AccountStatus.BLOCKED);

        anm = userRepository.save(anm);

        return userMapper.toResponseDto(anm);
    }

    @Override
    public UserResponseDto blockAnm(String id) {

        User anm = userRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("ANM not found."));

        if (anm.getRole() != Role.ANM) {
            throw new BusinessValidationException("Selected user is not an ANM.");
        }

        if (anm.getAccountStatus() == AccountStatus.BLOCKED) {
            throw new ConflictException("This ANM account is already blocked.");
        }

        anm.setAccountStatus(AccountStatus.BLOCKED);

        anm = userRepository.save(anm);

        return userMapper.toResponseDto(anm);
    }

    @Override
    public UserResponseDto unblockAnm(String id) {

        User anm = userRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("ANM not found."));

        if (anm.getRole() != Role.ANM) {
            throw new BusinessValidationException("Selected user is not an ANM.");
        }

        if (anm.getVerificationStatus() != VerificationStatus.APPROVED) {
            throw new BusinessValidationException(
                    "The ANM must be approved before the account can be activated."
            );
        }

        if (anm.getAccountStatus() == AccountStatus.ACTIVE) {
            throw new ConflictException("This ANM account is already active.");
        }

        anm.setAccountStatus(AccountStatus.ACTIVE);

        anm = userRepository.save(anm);

        return userMapper.toResponseDto(anm);
    }

    @Override
    public List<UserResponseDto> getAllAnms() {

        return userRepository
                .findByRole(Role.ANM)
                .stream()
                .map(userMapper::toResponseDto)
                .toList();

    }

    @Override
    public List<UserResponseDto> getAllAshas() {

        return userRepository
                .findByRole(Role.ASHA)
                .stream()
                .map(userMapper::toResponseDto)
                .toList();
    }

    @Override
    public UserResponseDto blockAsha(String id) {

        User asha = userRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("ASHA not found."));

        if (asha.getRole() != Role.ASHA) {
            throw new BusinessValidationException("Selected user is not an ASHA.");
        }

        if (asha.getAccountStatus() == AccountStatus.BLOCKED) {
            throw new ConflictException("This ASHA account is already blocked.");
        }

        asha.setAccountStatus(AccountStatus.BLOCKED);

        asha = userRepository.save(asha);

        return userMapper.toResponseDto(asha);
    }


    @Override
    public UserResponseDto unblockAsha(String id) {

        User asha = userRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("ASHA not found."));

        if (asha.getRole() != Role.ASHA) {
            throw new BusinessValidationException("Selected user is not an ASHA.");
        }

        // ASHA must be verified by ANM before activation
        if (asha.getVerificationStatus() != VerificationStatus.APPROVED) {
            throw new BusinessValidationException(
                    "The ASHA must be approved by an ANM before the account can be activated."
            );
        }

        if (asha.getAccountStatus() == AccountStatus.ACTIVE) {
            throw new ConflictException("This ASHA account is already active.");
        }

        asha.setAccountStatus(AccountStatus.ACTIVE);

        asha = userRepository.save(asha);

        return userMapper.toResponseDto(asha);
    }

    @Override
    public List<UserResponseDto> getAllUsers() {

        return userRepository.findAll()
                .stream()
                .filter(user ->
                        user.getRole() == Role.ANM ||
                                user.getRole() == Role.ASHA
                )
                .map(userMapper::toResponseDto)
                .toList();
    }
}
