package com.gramarogya.gramarogya_backend.service;

import com.gramarogya.gramarogya_backend.dto.AccountStatus;
import com.gramarogya.gramarogya_backend.dto.Role;
import com.gramarogya.gramarogya_backend.dto.UserResponseDto;
import com.gramarogya.gramarogya_backend.dto.VerificationStatus;
import com.gramarogya.gramarogya_backend.entity.User;
import com.gramarogya.gramarogya_backend.mapper.UserMapper;
import com.gramarogya.gramarogya_backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
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
                        new RuntimeException("ANM not found"));

        if (anm.getRole() != Role.ANM) {
            throw new RuntimeException("User is not an ANM");
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
                        new RuntimeException("ANM not found"));

        if (anm.getRole() != Role.ANM) {
            throw new RuntimeException("User is not an ANM");
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
                        new RuntimeException("ANM not found"));

        if (anm.getRole() != Role.ANM) {
            throw new RuntimeException("User is not an ANM");
        }

        anm.setAccountStatus(AccountStatus.BLOCKED);

        anm = userRepository.save(anm);

        return userMapper.toResponseDto(anm);
    }

    @Override
    public UserResponseDto unblockAnm(String id) {

        User anm = userRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("ANM not found"));

        if (anm.getRole() != Role.ANM) {
            throw new RuntimeException("User is not an ANM");
        }

        if (anm.getVerificationStatus() != VerificationStatus.APPROVED) {
            throw new RuntimeException(
                    "ANM must be approved before activation."
            );
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
                        new RuntimeException("ASHA not found"));

        if (asha.getRole() != Role.ASHA) {
            throw new RuntimeException("User is not an ASHA");
        }

        asha.setAccountStatus(AccountStatus.BLOCKED);

        asha = userRepository.save(asha);

        return userMapper.toResponseDto(asha);
    }


    @Override
    public UserResponseDto unblockAsha(String id) {

        User asha = userRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("ASHA not found"));

        if (asha.getRole() != Role.ASHA) {
            throw new RuntimeException("User is not an ASHA");
        }

        // ASHA must be verified by ANM before activation
        if (asha.getVerificationStatus() != VerificationStatus.APPROVED) {
            throw new RuntimeException(
                    "ASHA must be approved by ANM before activation."
            );
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