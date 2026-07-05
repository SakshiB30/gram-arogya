package com.gramarogya.gramarogya_backend.entity;

import com.gramarogya.gramarogya_backend.dto.BeneficiaryResponseDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "beneficiaries")
public class Beneficiary {

    @Id
    private String id;

    // ASHA who created this beneficiary
    private String userId;

    private String name;

    private Integer age;

    private String gender;

    private String phone;

    private String village;

    private String address;

    private String category;

    private LocalDate dateAdded;

}
