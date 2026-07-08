package com.gramarogya.gramarogya_backend.repository;

import com.gramarogya.gramarogya_backend.entity.HealthRecord;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HealthRecordRepository
        extends MongoRepository<HealthRecord, String> {

    // Get all health records of a beneficiary
    List<HealthRecord> findByBeneficiaryId(String beneficiaryId);

    // Get all health records of a visit
    List<HealthRecord> findByVisitId(String visitId);
}