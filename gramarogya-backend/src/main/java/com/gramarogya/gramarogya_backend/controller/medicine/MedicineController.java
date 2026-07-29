package com.gramarogya.gramarogya_backend.controller.medicine;

import com.gramarogya.gramarogya_backend.dto.medicine.CreateMedicineRequestDto;
import com.gramarogya.gramarogya_backend.dto.medicine.MedicineResponseDto;
import com.gramarogya.gramarogya_backend.dto.medicine.ReceiveMedicineRequestDto;
import com.gramarogya.gramarogya_backend.dto.medicine.UpdateMedicineRequestDto;
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

    // Get all medicines
    @GetMapping
    public ResponseEntity<List<MedicineResponseDto>> getAllMedicines(
            Authentication authentication) {

        return ResponseEntity.ok(
                medicineService.getAllMedicines(authentication)
        );
    }

    // Get medicine by id
    @GetMapping("/{id}")
    public ResponseEntity<MedicineResponseDto> getMedicineById(
            @PathVariable String id,
            Authentication authentication) {

        return ResponseEntity.ok(
                medicineService.getMedicineById(id, authentication)
        );
    }

    // Add medicine
    @PostMapping
    public ResponseEntity<MedicineResponseDto> addMedicine(
            @RequestBody CreateMedicineRequestDto request,
            Authentication authentication) {

        return new ResponseEntity<>(
                medicineService.addMedicine(request, authentication),
                HttpStatus.CREATED
        );
    }

    // Update medicine
    @PutMapping("/{id}")
    public ResponseEntity<MedicineResponseDto> updateMedicine(
            @PathVariable String id,
            @RequestBody UpdateMedicineRequestDto request,
            Authentication authentication) {

        return ResponseEntity.ok(
                medicineService.updateMedicine(id, request, authentication)
        );
    }

    // Receive stock
    @PatchMapping("/{id}/receive")
    public ResponseEntity<MedicineResponseDto> receiveMedicine(
            @PathVariable String id,
            @RequestBody ReceiveMedicineRequestDto request,
            Authentication authentication) {

        return ResponseEntity.ok(
                medicineService.receiveMedicine(id, request, authentication)
        );
    }

    // Delete medicine
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteMedicine(
            @PathVariable String id,
            Authentication authentication) {

        medicineService.deleteMedicine(id, authentication);

        return ResponseEntity.ok("Medicine deleted successfully.");
    }
}