package com.gramarogya.gramarogya_backend.repository;

import com.gramarogya.gramarogya_backend.entity.Activity;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ActivityRepository
        extends MongoRepository<Activity, String> {

    List<Activity> findTop10ByUserIdInOrderByCreatedAtDesc(
            List<String> userIds
    );
}