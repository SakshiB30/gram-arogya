package com.gramarogya.gramarogya_backend.repository;

import com.gramarogya.gramarogya_backend.entity.Beneficiary;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface BeneficiaryRepository
        extends MongoRepository<Beneficiary, String> {

    // ---------------- Existing user/creator queries ----------------

    List<Beneficiary> findByUserId(String userId);

    Optional<Beneficiary> findByIdAndUserId(
            String id,
            String userId
    );

    long countByUserId(String userId);

    long countByUserIdAndCategoryContainingIgnoreCase(
            String userId,
            String category
    );

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

    // ---------------- Assignment-based queries ----------------

    List<Beneficiary> findByAshaId(String ashaId);

    Optional<Beneficiary> findByIdAndAshaId(
            String id,
            String ashaId
    );

    long countByAshaId(String ashaId);

    long countByAshaIdAndCategoryContainingIgnoreCase(
            String ashaId,
            String category
    );

    List<Beneficiary> findByAshaIdAndStatusIgnoreCase(
            String ashaId,
            String status
    );

    List<Beneficiary> findByAshaIdAndCategoryIgnoreCase(
            String ashaId,
            String category
    );

    List<Beneficiary> findByAshaIdAndNameContainingIgnoreCase(
            String ashaId,
            String name
    );

    // ---------------- Multiple ASHAs ----------------

    List<Beneficiary> findByAshaIdIn(List<String> ashaIds);

    long countByAshaIdIn(List<String> ashaIds);

    long countByAshaIdInAndCategoryContainingIgnoreCase(
            List<String> ashaIds,
            String category
    );

    List<Beneficiary> findByAshaIdInAndStatusIgnoreCase(
            List<String> ashaIds,
            String status
    );

    List<Beneficiary> findByAshaIdInAndCategoryIgnoreCase(
            List<String> ashaIds,
            String category
    );

    // ---------------- Global/Admin queries ----------------

    long count();

    long countByCategory(String category);

    // ---------------- Existing ANM Dashboard queries ----------------

    long countByUserIdIn(List<String> userIds);

    long countByUserIdInAndCategoryContainingIgnoreCase(
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