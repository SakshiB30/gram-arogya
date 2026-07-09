package com.gramarogya.gramarogya_backend.repository;

import com.gramarogya.gramarogya_backend.entity.Medicine;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MedicineRepository extends MongoRepository<Medicine, String> {

    Optional<Medicine> findByName(String name);

    Optional<Medicine> findByBatch(String batch);

    List<Medicine> findByStatus(String status);

    List<Medicine> findByNameContainingIgnoreCase(String name);

    boolean existsByBatch(String batch);
}