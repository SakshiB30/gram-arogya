package com.gramarogya.gramarogya_backend.repository;

import com.gramarogya.gramarogya_backend.entity.Visit;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface VisitRepository extends MongoRepository<Visit, String> {

    // All visits created by an ASHA worker
    List<Visit> findByUserId(String userId);

    // All visits of a beneficiary
    List<Visit> findByBeneficiaryId(String beneficiaryId);

    // All visits of a beneficiary by a specific ASHA worker
    List<Visit> findByBeneficiaryIdAndUserId(String beneficiaryId, String userId);

    long countByUserId(String userId);

    long countByUserIdAndVisitDate(String userId,
                                   LocalDate visitDate);

    long countByUserIdAndNextVisitDateAfter(String userId,
                                            LocalDate date);

    List<Visit> findTop5ByUserIdOrderByVisitDateDesc(String userId);

    List<Visit> findByUserIdAndStatus(String userId, String status);

    List<Visit> findByUserIdAndNextVisitDateBetween(
            String userId,
            LocalDate start,
            LocalDate end
    );

}