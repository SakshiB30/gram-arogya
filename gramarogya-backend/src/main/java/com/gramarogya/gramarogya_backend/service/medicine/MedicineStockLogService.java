package com.gramarogya.gramarogya_backend.service.medicine;

import com.gramarogya.gramarogya_backend.dto.medicine.MedicineStockLogResponseDto;
import com.gramarogya.gramarogya_backend.dto.medicine.StockAction;
import com.gramarogya.gramarogya_backend.entity.medicine.Medicine;
import org.springframework.security.core.Authentication;

import java.util.List;

public interface MedicineStockLogService {

    void logMedicineAction(
            Medicine medicine,
            StockAction action,
            Integer previousStock,
            Integer updatedStock,
            Integer quantityChanged,
            String performedBy
    );

    List<MedicineStockLogResponseDto> getAllLogs(
            Authentication authentication
    );

    List<MedicineStockLogResponseDto> getMedicineLogs(
            String medicineId,
            Authentication authentication
    );
}