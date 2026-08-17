package com.gramarogya.gramarogya_backend.repository.medicine;

import com.gramarogya.gramarogya_backend.dto.medicine.MedicineStatus;
import com.gramarogya.gramarogya_backend.entity.medicine.Medicine;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface MedicineRepository
        extends MongoRepository<Medicine, String> {

    Optional<Medicine> findByBatch(String batch);

    boolean existsByBatch(String batch);

    Optional<Medicine> findByName(String name);

    List<Medicine> findByNameContainingIgnoreCase(
            String keyword
    );

    List<Medicine> findByStatus(
            MedicineStatus status
    );

    List<Medicine> findByExpiryDateBefore(
            LocalDate date
    );

    List<Medicine> findByStockLessThanEqual(
            Integer stock
    );
}