package com.gramarogya.gramarogya_backend.controller.medicine;

import com.gramarogya.gramarogya_backend.dto.medicine.IssueMedicineRequestDto;
import com.gramarogya.gramarogya_backend.dto.medicine.MedicineIssueResponseDto;
import com.gramarogya.gramarogya_backend.service.medicine.MedicineIssueService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/inventory")
@RequiredArgsConstructor
public class MedicineIssueController {

    private final MedicineIssueService medicineIssueService;

    // Issue medicine
    @PostMapping("/{id}/issue")
    public ResponseEntity<MedicineIssueResponseDto> issueMedicine(
            @PathVariable String id,
            @RequestBody IssueMedicineRequestDto request,
            Authentication authentication) {

        return ResponseEntity.ok(
                medicineIssueService.issueMedicine(
                        id,
                        request,
                        authentication
                )
        );
    }

    // Get all issued medicines
    @GetMapping("/issues")
    public ResponseEntity<List<MedicineIssueResponseDto>> getAllIssuedMedicines(
            Authentication authentication) {

        return ResponseEntity.ok(
                medicineIssueService.getAllIssuedMedicines(authentication)
        );
    }

    // Get issue history of one beneficiary
    @GetMapping("/issues/beneficiary/{beneficiaryId}")
    public ResponseEntity<List<MedicineIssueResponseDto>> getBeneficiaryMedicineHistory(
            @PathVariable String beneficiaryId,
            Authentication authentication) {

        return ResponseEntity.ok(
                medicineIssueService.getIssuedMedicinesByBeneficiary(
                        beneficiaryId,
                        authentication
                )
        );
    }
}

