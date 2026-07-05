package com.gramarogya.gramarogya_backend.service;

import com.gramarogya.gramarogya_backend.dto.BeneficiaryResponseDto;
import com.gramarogya.gramarogya_backend.dto.CreateBeneficiaryRequestDto;
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

    private User getCurrentUser(Authentication authentication) {

        String email = authentication.getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    private Beneficiary getBeneficiaryForCurrentUser(Authentication authentication,
                                                     String id) {

        User currentUser = getCurrentUser(authentication);

        Beneficiary beneficiary = beneficiaryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Beneficiary not found"));

        if (!beneficiary.getUserId().equals(currentUser.getId())) {
            throw new UnauthorizedException("Unauthorized");
        }

        return beneficiary;
    }

    @Override
    public BeneficiaryResponseDto create(Authentication authentication,
                                         CreateBeneficiaryRequestDto dto) {

        User currentUser = getCurrentUser(authentication);

        Beneficiary beneficiary = beneficiaryMapper.toEntity(dto);

        beneficiary.setUserId(currentUser.getId());
        beneficiary.setDateAdded(LocalDate.now());

        beneficiaryRepository.save(beneficiary);

        return beneficiaryMapper.toResponseDto(beneficiary);
    }

    @Override
    public List<BeneficiaryResponseDto> getAll(Authentication authentication) {

        User currentUser = getCurrentUser(authentication);

        return beneficiaryRepository.findByUserId(currentUser.getId())
                .stream()
                .map(beneficiaryMapper::toResponseDto)
                .toList();
    }

    @Override
    public BeneficiaryResponseDto getById(Authentication authentication,
                                          String id) {

        Beneficiary beneficiary =
                getBeneficiaryForCurrentUser(authentication, id);

        return beneficiaryMapper.toResponseDto(beneficiary);
    }

    @Override
    public BeneficiaryResponseDto update(Authentication authentication,
                                         String id,
                                         UpdateBeneficiaryRequestDto dto) {

        Beneficiary beneficiary =
                getBeneficiaryForCurrentUser(authentication, id);

        beneficiaryMapper.updateEntity(dto, beneficiary);

        beneficiaryRepository.save(beneficiary);

        return beneficiaryMapper.toResponseDto(beneficiary);
    }

    @Override
    public void delete(Authentication authentication,
                       String id) {

        Beneficiary beneficiary =
                getBeneficiaryForCurrentUser(authentication, id);

        beneficiaryRepository.delete(beneficiary);
    }
}