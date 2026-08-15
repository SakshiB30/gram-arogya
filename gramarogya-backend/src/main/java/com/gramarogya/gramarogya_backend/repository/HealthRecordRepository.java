package com.gramarogya.gramarogya_backend.repository;

import com.gramarogya.gramarogya_backend.entity.HealthRecord;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface HealthRecordRepository
        extends MongoRepository<HealthRecord, String> {

    List<HealthRecord> findByBeneficiaryIdOrderByCreatedAtDesc(
            String beneficiaryId
    );

    List<HealthRecord> findByVisitIdOrderByCreatedAtDesc(
            String visitId
    );

    List<HealthRecord> findTop5ByOrderByCreatedAtDesc();

    List<HealthRecord> findByRecordedByOrderByCreatedAtDesc(
            String recordedBy
    );

    List<HealthRecord> findByCreatedAtBetweenOrderByCreatedAtDesc(
            LocalDateTime start,
            LocalDateTime end
    );

    List<HealthRecord>
    findByDiagnosisContainingIgnoreCaseOrderByCreatedAtDesc(
            String diagnosis
    );

    List<HealthRecord>
    findTop5ByBeneficiaryIdInOrderByCreatedAtDesc(
            List<String> beneficiaryIds
    );


    // =====================================================
    // PAGINATION
    // =====================================================

    Page<HealthRecord> findByBeneficiaryIdIn(
            List<String> beneficiaryIds,
            Pageable pageable
    );

    // =====================================================
    // DUPLICATE CHECK
    // =====================================================

    boolean existsByVisitId(String visitId);

}