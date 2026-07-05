package com.gramarogya.gramarogya_backend.mapper;

import com.gramarogya.gramarogya_backend.dto.BeneficiaryResponseDto;
import com.gramarogya.gramarogya_backend.dto.CreateBeneficiaryRequestDto;
import com.gramarogya.gramarogya_backend.dto.UpdateBeneficiaryRequestDto;
import com.gramarogya.gramarogya_backend.entity.Beneficiary;
import org.springframework.stereotype.Component;

@Component
public class BeneficiaryMapper {

    public Beneficiary toEntity(CreateBeneficiaryRequestDto dto) {

        Beneficiary beneficiary = new Beneficiary();

        beneficiary.setName(dto.getName());
        beneficiary.setAge(dto.getAge());
        beneficiary.setGender(dto.getGender());
        beneficiary.setPhone(dto.getPhone());
        beneficiary.setVillage(dto.getVillage());
        beneficiary.setAddress(dto.getAddress());
        beneficiary.setCategory(dto.getCategory());

        return beneficiary;
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
                .dateAdded(beneficiary.getDateAdded())
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
    }
}