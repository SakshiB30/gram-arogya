package com.gramarogya.gramarogya_backend.repository.medicine;

import com.gramarogya.gramarogya_backend.entity.medicine.MedicineStockLog;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MedicineStockLogRepository
        extends MongoRepository<MedicineStockLog, String> {

    List<MedicineStockLog> findByMedicineIdOrderByPerformedAtDesc(String medicineId);

}