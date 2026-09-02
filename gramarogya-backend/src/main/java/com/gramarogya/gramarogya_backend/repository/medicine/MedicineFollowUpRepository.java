package com.gramarogya.gramarogya_backend.repository.medicine;

import com.gramarogya.gramarogya_backend.entity.medicine.MedicineFollowUp;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MedicineFollowUpRepository extends MongoRepository<MedicineFollowUp, String> {

    List<MedicineFollowUp> findByBeneficiaryIdOrderByFollowUpDateDesc(String beneficiaryId);

    List<MedicineFollowUp> findByVisitIdOrderByFollowUpDateDesc(String visitId);

    List<MedicineFollowUp> findByRecordedByOrderByFollowUpDateDesc(String recordedBy);
}