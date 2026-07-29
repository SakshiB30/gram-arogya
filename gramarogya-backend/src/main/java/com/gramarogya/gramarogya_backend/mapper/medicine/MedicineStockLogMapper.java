package com.gramarogya.gramarogya_backend.mapper.medicine;

import com.gramarogya.gramarogya_backend.dto.medicine.MedicineStockLogResponseDto;
import com.gramarogya.gramarogya_backend.entity.medicine.MedicineStockLog;
import org.springframework.stereotype.Component;

@Component
public class MedicineStockLogMapper {

    public MedicineStockLogResponseDto toResponseDto(
            MedicineStockLog stockLog) {

        return MedicineStockLogResponseDto.builder()
                .id(stockLog.getId())
                .medicineId(stockLog.getMedicineId())
                .medicineName(stockLog.getMedicineName())
                .action(stockLog.getAction())
                .previousStock(stockLog.getPreviousStock())
                .updatedStock(stockLog.getUpdatedStock())
                .quantityChanged(stockLog.getQuantityChanged())
                .performedBy(stockLog.getPerformedBy())
                .performedAt(stockLog.getPerformedAt())
                .build();
    }
}
