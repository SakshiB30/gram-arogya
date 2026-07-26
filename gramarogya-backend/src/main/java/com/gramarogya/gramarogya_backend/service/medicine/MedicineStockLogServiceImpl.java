package com.gramarogya.gramarogya_backend.service.medicine;

import com.gramarogya.gramarogya_backend.dto.medicine.StockAction;
import com.gramarogya.gramarogya_backend.entity.medicine.Medicine;
import com.gramarogya.gramarogya_backend.entity.medicine.MedicineStockLog;
import com.gramarogya.gramarogya_backend.repository.medicine.MedicineStockLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class MedicineStockLogServiceImpl implements MedicineStockLogService {

    private final MedicineStockLogRepository medicineStockLogRepository;

    @Override
    public void logMedicineAction(
            Medicine medicine,
            StockAction action,
            Integer previousStock,
            Integer updatedStock,
            Integer quantityChanged,
            String performedBy) {

        MedicineStockLog log = MedicineStockLog.builder()
                .medicineId(medicine.getId())
                .medicineName(medicine.getName())
                .action(action)
                .previousStock(previousStock)
                .updatedStock(updatedStock)
                .quantityChanged(quantityChanged)
                .performedBy(performedBy)
                .performedAt(LocalDateTime.now())
                .build();

        medicineStockLogRepository.save(log);
    }
}