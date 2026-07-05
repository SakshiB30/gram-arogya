package com.gramarogya.gramarogya_backend.repository;


import com.gramarogya.gramarogya_backend.entity.Beneficiary;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface BeneficiaryRepository extends MongoRepository<Beneficiary,String> {
    List<Beneficiary> findByUserId(String userId);
}
