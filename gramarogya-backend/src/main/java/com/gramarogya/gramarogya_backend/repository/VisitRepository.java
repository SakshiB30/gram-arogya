package com.gramarogya.gramarogya_backend.repository;

import com.gramarogya.gramarogya_backend.entity.Visit;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VisitRepository extends MongoRepository<Visit,String> {


    List<Visit> findByPatientId(String patientId);

    boolean existsByPatientId(String patientId);
}
