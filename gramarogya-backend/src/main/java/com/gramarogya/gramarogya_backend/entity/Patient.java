package com.gramarogya.gramarogya_backend.entity;

import com.gramarogya.gramarogya_backend.dto.PatientResponseDto;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "patients")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Patient {
    @Id
    private String id;

    private String name;
    private Integer age;
    private String gender;
    private String mobile;
    private String village;
    private String healthCategory;
    private LocalDateTime createdAt;

    public PatientResponseDto toDTO(){
        return new PatientResponseDto(this.id, this.name, this.age, this.gender, this.mobile, this.village, this.healthCategory, this.createdAt);
    }
}
