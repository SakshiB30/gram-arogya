package com.gramarogya.gramarogya_backend.repository;

import com.gramarogya.gramarogya_backend.entity.Visit;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface VisitRepository extends MongoRepository<Visit, String> {

    // ==========================================
    // ASHA - VISITS
    // ==========================================

    List<Visit> findByUserId(String userId);

    List<Visit> findByBeneficiaryId(String beneficiaryId);

    List<Visit> findByBeneficiaryIdAndUserId(
            String beneficiaryId,
            String userId
    );

    long countByUserId(String userId);

    long countByUserIdAndVisitDate(
            String userId,
            LocalDate visitDate
    );

    long countByUserIdAndNextVisitDateAfter(
            String userId,
            LocalDate date
    );

    List<Visit> findTop5ByUserIdOrderByVisitDateDesc(
            String userId
    );

    List<Visit> findByUserIdAndStatus(
            String userId,
            String status
    );

    List<Visit> findByUserIdAndNextVisitDateBetween(
            String userId,
            LocalDate start,
            LocalDate end
    );

    List<Visit> findByUserIdAndVisitTypeContainingIgnoreCase(
            String userId,
            String visitType
    );


    // ==========================================
    // ADMIN
    // ==========================================

    long count();

    long countByVisitDate(LocalDate visitDate);

    long countByNextVisitDateAfter(LocalDate date);

    long countByStatus(String status);


    // ==========================================
    // ANM DASHBOARD
    // ==========================================

    long countByUserIdIn(
            List<String> userIds
    );

    long countByUserIdInAndVisitDate(
            List<String> userIds,
            LocalDate visitDate
    );

    long countByUserIdInAndNextVisitDateAfter(
            List<String> userIds,
            LocalDate date
    );

    List<Visit> findTop5ByUserIdInOrderByVisitDateDesc(
            List<String> userIds
    );

    List<Visit> findByUserIdInAndStatus(
            List<String> userIds,
            String status
    );

    List<Visit> findByUserIdInAndNextVisitDateBetween(
            List<String> userIds,
            LocalDate start,
            LocalDate end
    );


    // ==========================================
    // ALL ACCESSIBLE VISITS
    // Used by Recent Activity
    // ==========================================

    List<Visit> findByUserIdIn(
            List<String> userIds
    );
}