package com.gramarogya.gramarogya_backend.mapper;

import com.gramarogya.gramarogya_backend.dto.CreateVisitRequestDto;
import com.gramarogya.gramarogya_backend.dto.UpdateVisitRequestDto;
import com.gramarogya.gramarogya_backend.dto.VisitResponseDto;
import com.gramarogya.gramarogya_backend.entity.Visit;
import org.springframework.stereotype.Component;

@Component
public class VisitMapper {

    public Visit toEntity(CreateVisitRequestDto dto) {

        return Visit.builder()

                .beneficiaryId(
                        dto.getBeneficiaryId()
                )

                .visitType(
                        dto.getVisitType()
                )

                .status(
                        dto.getStatus()
                )

                .notes(
                        dto.getNotes()
                )

                .nextVisitDate(
                        dto.getNextVisitDate()
                )

                .build();
    }


    public VisitResponseDto toResponseDto(Visit visit) {

        return VisitResponseDto.builder()

                .id(
                        visit.getId()
                )

                .beneficiaryId(
                        visit.getBeneficiaryId()
                )

                .visitDate(
                        visit.getVisitDate()
                )

                .visitType(
                        visit.getVisitType()
                )

                .status(
                        visit.getStatus()
                )

                .notes(
                        visit.getNotes()
                )

                .nextVisitDate(
                        visit.getNextVisitDate()
                )

                .build();
    }


    public void updateEntity(
            UpdateVisitRequestDto dto,
            Visit visit) {

        if (dto.getVisitType() != null) {

            visit.setVisitType(
                    dto.getVisitType()
            );
        }


        if (dto.getStatus() != null) {

            visit.setStatus(
                    dto.getStatus()
            );
        }


        if (dto.getNotes() != null) {

            visit.setNotes(
                    dto.getNotes()
            );
        }


        if (dto.getNextVisitDate() != null) {

            visit.setNextVisitDate(
                    dto.getNextVisitDate()
            );
        }
    }
}