package com.gramarogya.gramarogya_backend.mapper;

import com.gramarogya.gramarogya_backend.dto.BeneficiaryResponseDto;
import com.gramarogya.gramarogya_backend.dto.CreateBeneficiaryRequestDto;
import com.gramarogya.gramarogya_backend.dto.UpdateBeneficiaryRequestDto;
import com.gramarogya.gramarogya_backend.entity.Beneficiary;
import org.springframework.stereotype.Component;

@Component
public class BeneficiaryMapper {

    public Beneficiary toEntity(CreateBeneficiaryRequestDto dto) {

        return Beneficiary.builder()
                .name(dto.getName())
                .age(dto.getAge())
                .gender(dto.getGender())
                .phone(dto.getPhone())
                .village(dto.getVillage())
                .address(dto.getAddress())
                .category(dto.getCategory())
                .disease(dto.getDisease())
                .status(dto.getStatus())
                .build();
    }

    public BeneficiaryResponseDto toResponseDto(Beneficiary beneficiary) {

        return BeneficiaryResponseDto.builder()
                .id(beneficiary.getId())
                .name(beneficiary.getName())
                .age(beneficiary.getAge())
                .gender(beneficiary.getGender())
                .phone(beneficiary.getPhone())
                .village(beneficiary.getVillage())
                .address(beneficiary.getAddress())
                .category(beneficiary.getCategory())
                .disease(beneficiary.getDisease())
                .status(beneficiary.getStatus())
                .dateAdded(beneficiary.getDateAdded())
                .lastVisitDate(beneficiary.getLastVisitDate())
                .nextVisitDate(beneficiary.getNextVisitDate())
                .build();
    }

    public void updateEntity(UpdateBeneficiaryRequestDto dto,
                             Beneficiary beneficiary) {

        beneficiary.setName(dto.getName());
        beneficiary.setAge(dto.getAge());
        beneficiary.setGender(dto.getGender());
        beneficiary.setPhone(dto.getPhone());
        beneficiary.setVillage(dto.getVillage());
        beneficiary.setAddress(dto.getAddress());
        beneficiary.setCategory(dto.getCategory());
        beneficiary.setDisease(dto.getDisease());
        beneficiary.setStatus(dto.getStatus());
    }
}