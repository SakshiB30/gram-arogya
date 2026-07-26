package com.gramarogya.gramarogya_backend.controller.medicine;

import com.gramarogya.gramarogya_backend.dto.medicine.*;
import com.gramarogya.gramarogya_backend.service.medicine.MedicineService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/inventory")
@RequiredArgsConstructor
public class MedicineController {

    private final MedicineService medicineService;

    @GetMapping
    public ResponseEntity<List<MedicineResponseDto>> getAllMedicines(
            Authentication authentication) {

        return ResponseEntity.ok(
                medicineService.getAllMedicines(authentication)
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<MedicineResponseDto> getMedicineById(
            @PathVariable String id,Authentication authentication) {

        return ResponseEntity.ok(
                medicineService.getMedicineById(id, authentication)
        );
    }

    @PostMapping
    public ResponseEntity<MedicineResponseDto> addMedicine(
            @RequestBody CreateMedicineRequestDto request, Authentication authentication) {

        return new ResponseEntity<>(
                medicineService.addMedicine(request,authentication),
                HttpStatus.CREATED
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<MedicineResponseDto> updateMedicine(
            @PathVariable String id,
            @RequestBody UpdateMedicineRequestDto request
    ,Authentication authentication) {

        return ResponseEntity.ok(
                medicineService.updateMedicine(id,request,authentication)
        );
    }

    @PatchMapping("/{id}/receive")
    public ResponseEntity<MedicineResponseDto> receiveMedicine(
            @PathVariable String id,
            @RequestBody ReceiveMedicineRequestDto receiveMedicineRequestDto,
            Authentication authentication) {

        return ResponseEntity.ok(
                medicineService.receiveMedicine(id,receiveMedicineRequestDto,authentication)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteMedicine(
            @PathVariable String id, Authentication authentication) {

        medicineService.deleteMedicine(id,authentication);

        return ResponseEntity.ok("Medicine deleted successfully.");
    }

    @PatchMapping("/{id}/issue")
    public ResponseEntity<MedicineResponseDto> issueMedicine(
            @PathVariable String id,
            @RequestBody IssueMedicineRequestDto request,
            Authentication authentication) {

        return ResponseEntity.ok(
                medicineService.issueMedicine(id, request, authentication)
        );
    }
}
