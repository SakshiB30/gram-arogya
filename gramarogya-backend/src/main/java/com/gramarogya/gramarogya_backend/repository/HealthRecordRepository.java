package com.gramarogya.gramarogya_backend.repository;

import com.gramarogya.gramarogya_backend.entity.HealthRecord;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface HealthRecordRepository
        extends MongoRepository<HealthRecord, String> {

    // =====================================================
    // BENEFICIARY HEALTH HISTORY
    // =====================================================

    List<HealthRecord> findByBeneficiaryIdOrderByCreatedAtDesc(
            String beneficiaryId
    );


    // =====================================================
    // VISIT
    // =====================================================

    List<HealthRecord> findByVisitIdOrderByCreatedAtDesc(
            String visitId
    );


    // =====================================================
    // RECENT RECORDS
    // =====================================================

    List<HealthRecord> findTop5ByOrderByCreatedAtDesc();


    // =====================================================
    // RECORDED BY USER
    // =====================================================

    List<HealthRecord> findByRecordedByOrderByCreatedAtDesc(
            String recordedBy
    );


    // =====================================================
    // DATE RANGE
    // =====================================================

    List<HealthRecord> findByCreatedAtBetweenOrderByCreatedAtDesc(
            LocalDateTime start,
            LocalDateTime end
    );


    // =====================================================
    // DIAGNOSIS SEARCH
    // =====================================================

    List<HealthRecord>
    findByDiagnosisContainingIgnoreCaseOrderByCreatedAtDesc(
            String diagnosis
    );


    // =====================================================
    // MULTIPLE BENEFICIARIES
    // =====================================================

    List<HealthRecord>
    findTop5ByBeneficiaryIdInOrderByCreatedAtDesc(
            List<String> beneficiaryIds
    );
}