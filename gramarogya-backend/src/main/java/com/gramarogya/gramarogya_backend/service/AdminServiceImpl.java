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
}