package com.gramarogya.gramarogya_backend.controller.medicine;

import com.gramarogya.gramarogya_backend.dto.medicine.CreateMedicineFollowUpRequestDto;
import com.gramarogya.gramarogya_backend.dto.medicine.MedicineFollowUpResponseDto;
import com.gramarogya.gramarogya_backend.service.medicine.MedicineFollowUpService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/medicine-followups")
@RequiredArgsConstructor
public class MedicineFollowUpController {

    private final MedicineFollowUpService medicineFollowUpService;

    @PostMapping
    public ResponseEntity<MedicineFollowUpResponseDto> createFollowUp(
            @Valid @RequestBody CreateMedicineFollowUpRequestDto request,
            Authentication authentication) {

        return new ResponseEntity<>(
                medicineFollowUpService.createFollowUp(
                        request,
                        authentication
                ),
                HttpStatus.CREATED
        );
    }

    @GetMapping("/beneficiary/{beneficiaryId}")
    public ResponseEntity<List<MedicineFollowUpResponseDto>> getFollowUpsByBeneficiary(
            @PathVariable String beneficiaryId,
            Authentication authentication) {

        return ResponseEntity.ok(
                medicineFollowUpService.getFollowUpsByBeneficiary(
                        beneficiaryId,
                        authentication
                )
        );
    }

    @GetMapping("/visit/{visitId}")
    public ResponseEntity<List<MedicineFollowUpResponseDto>> getFollowUpsByVisit(
            @PathVariable String visitId,
            Authentication authentication) {

        return ResponseEntity.ok(
                medicineFollowUpService.getFollowUpsByVisit(
                        visitId,
                        authentication
                )
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<MedicineFollowUpResponseDto> getFollowUpById(
            @PathVariable String id,
            Authentication authentication) {

        return ResponseEntity.ok(
                medicineFollowUpService.getFollowUpById(
                        id,
                        authentication
                )
        );
    }
}