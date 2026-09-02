package com.gramarogya.gramarogya_backend.mapper.medicine;

import com.gramarogya.gramarogya_backend.dto.medicine.CreateMedicineFollowUpRequestDto;
import com.gramarogya.gramarogya_backend.dto.medicine.MedicineFollowUpResponseDto;
import com.gramarogya.gramarogya_backend.entity.medicine.MedicineFollowUp;
import org.springframework.stereotype.Component;

@Component
public class MedicineFollowUpMapper {

    public MedicineFollowUp toEntity(CreateMedicineFollowUpRequestDto dto) {

        return MedicineFollowUp.builder()
                .beneficiaryId(dto.getBeneficiaryId())
                .visitId(dto.getVisitId())
                .medicineTaken(dto.getMedicineTaken())
                .symptomStatus(dto.getSymptomStatus())
                .sideEffects(dto.getSideEffects())
                .sideEffectDetails(dto.getSideEffectDetails())
                .remarks(dto.getRemarks())
                .needsDoctorVisit(dto.getNeedsDoctorVisit())
                .referralReason(dto.getReferralReason())
                .build();
    }

    public MedicineFollowUpResponseDto toResponseDto(MedicineFollowUp followUp) {

        return MedicineFollowUpResponseDto.builder()
                .id(followUp.getId())
                .beneficiaryId(followUp.getBeneficiaryId())
                .visitId(followUp.getVisitId())
                .followUpDate(followUp.getFollowUpDate())
                .medicineTaken(followUp.getMedicineTaken())
                .symptomStatus(followUp.getSymptomStatus())
                .sideEffects(followUp.getSideEffects())
                .sideEffectDetails(followUp.getSideEffectDetails())
                .remarks(followUp.getRemarks())
                .needsDoctorVisit(followUp.getNeedsDoctorVisit())
                .referralReason(followUp.getReferralReason())
                .recordedBy(followUp.getRecordedBy())
                .createdAt(followUp.getCreatedAt())
                .updatedAt(followUp.getUpdatedAt())
                .build();
    }
}