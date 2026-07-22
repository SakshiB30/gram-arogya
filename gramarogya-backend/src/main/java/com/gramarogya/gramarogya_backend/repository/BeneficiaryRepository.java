package com.gramarogya.gramarogya_backend.repository;


import com.gramarogya.gramarogya_backend.entity.Beneficiary;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface BeneficiaryRepository extends MongoRepository<Beneficiary,String> {
    List<Beneficiary> findByUserId(String userId);

    long countByUserId(String userId);

    long countByUserIdAndCategory(String userId, String category);

//    List<Beneficiary> findByUserIdAndStatus(String userId, String status);

    List<Beneficiary> findByUserIdAndStatusIgnoreCase(
            String userId,
            String status
    );

    List<Beneficiary> findByUserIdAndCategoryIgnoreCase(
            String userId,
            String category
    );


    List<Beneficiary> findByUserIdAndNameContainingIgnoreCase(
            String userId,
            String name
    );

    long count();

    long countByCategory(String category);

    // ---------------- ANM Dashboard ----------------

    long countByUserIdIn(List<String> userIds);

    long countByUserIdInAndCategory(
            List<String> userIds,
            String category
    );

    List<Beneficiary> findByUserIdInAndStatusIgnoreCase(
            List<String> userIds,
            String status
    );

    List<Beneficiary> findByUserIdInAndCategoryIgnoreCase(
            List<String> userIds,
            String category
    );

    List<Beneficiary> findByUserIdIn(List<String> userIds);
}
