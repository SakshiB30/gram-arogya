package com.gramarogya.gramarogya_backend.repository;

import com.gramarogya.gramarogya_backend.entity.Patient;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PatientRepository extends MongoRepository<Patient, String> {

}
