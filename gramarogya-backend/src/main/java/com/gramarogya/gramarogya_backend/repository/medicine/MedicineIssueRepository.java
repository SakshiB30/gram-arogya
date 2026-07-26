package com.gramarogya.gramarogya_backend.repository.medicine;

import com.gramarogya.gramarogya_backend.entity.medicine.MedicineIssue;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface MedicineIssueRepository extends MongoRepository<MedicineIssue, String> {

    List<MedicineIssue> findByMedicineIdOrderByIssuedAtDesc(
            String medicineId
    );

    List<MedicineIssue> findByBeneficiaryIdOrderByIssuedAtDesc(
            String beneficiaryId
    );

    List<MedicineIssue> findAllByOrderByIssuedAtDesc();
}

