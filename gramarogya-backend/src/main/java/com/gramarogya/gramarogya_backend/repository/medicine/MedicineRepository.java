package com.gramarogya.gramarogya_backend.repository.medicine;

import com.gramarogya.gramarogya_backend.entity.medicine.Medicine;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface MedicineRepository extends MongoRepository<Medicine, String> {

    // Find medicine by batch number
    Optional<Medicine> findByBatch(String batch);

    // Check duplicate batch
    boolean existsByBatch(String batch);

    // Find medicine by name
    Optional<Medicine> findByName(String name);

    // Search medicines
    List<Medicine> findByNameContainingIgnoreCase(String keyword);

    // Filter by status
    List<Medicine> findByStatus(String status);

    // Expiring medicines
    List<Medicine> findByExpiryDateBefore(LocalDate date);

    // Low stock medicines
    List<Medicine> findByStockLessThanEqual(Integer stock);

}