package com.gramarogya.gramarogya_backend.controller.medicine;

import com.gramarogya.gramarogya_backend.dto.medicine.MedicineStockLogResponseDto;
import com.gramarogya.gramarogya_backend.service.medicine.MedicineStockLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/inventory")
@RequiredArgsConstructor
public class MedicineStockController {

    private final MedicineStockLogService medicineStockLogService;

    @GetMapping("/logs")
    public ResponseEntity<List<MedicineStockLogResponseDto>> getAllLogs(
            Authentication authentication) {

        return ResponseEntity.ok(
                medicineStockLogService.getAllLogs(authentication)
        );
    }

    @GetMapping("/{medicineId}/logs")
    public ResponseEntity<List<MedicineStockLogResponseDto>> getMedicineLogs(
            @PathVariable String medicineId,
            Authentication authentication) {

        return ResponseEntity.ok(
                medicineStockLogService.getMedicineLogs(
                        medicineId,
                        authentication
                )
        );
    }
}
