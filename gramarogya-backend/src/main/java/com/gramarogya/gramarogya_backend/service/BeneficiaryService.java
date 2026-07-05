package com.gramarogya.gramarogya_backend.service;

import com.gramarogya.gramarogya_backend.dto.BeneficiaryResponseDto;
import com.gramarogya.gramarogya_backend.dto.CreateBeneficiaryRequestDto;
import com.gramarogya.gramarogya_backend.dto.UpdateBeneficiaryRequestDto;
import org.springframework.security.core.Authentication;


import java.util.List;

public interface BeneficiaryService {
    BeneficiaryResponseDto create(Authentication authentication,
                                  CreateBeneficiaryRequestDto dto);

    List<BeneficiaryResponseDto> getAll(Authentication authentication);

    BeneficiaryResponseDto getById(Authentication authentication,
                                   String id);

    BeneficiaryResponseDto update(Authentication authentication,
                                  String id,
                                  UpdateBeneficiaryRequestDto dto);

    void delete(Authentication authentication,
                String id);
}
