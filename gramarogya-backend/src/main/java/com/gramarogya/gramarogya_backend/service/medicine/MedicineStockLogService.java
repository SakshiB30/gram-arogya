package com.gramarogya.gramarogya_backend.service.medicine;

import com.gramarogya.gramarogya_backend.dto.medicine.StockAction;
import com.gramarogya.gramarogya_backend.entity.medicine.Medicine;

public interface MedicineStockLogService {

    void logMedicineAction(
            Medicine medicine,
            StockAction action,
            Integer previousStock,
            Integer updatedStock,
            Integer quantityChanged,
            String performedBy
    );

}