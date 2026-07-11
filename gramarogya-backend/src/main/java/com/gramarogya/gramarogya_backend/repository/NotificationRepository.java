package com.gramarogya.gramarogya_backend.repository;

import com.gramarogya.gramarogya_backend.entity.Notification;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends MongoRepository<Notification, String> {

    // ==========================
    // ALL NOTIFICATIONS
    // ==========================
    List<Notification> findByUserIdOrderByCreatedAtDesc(String userId);

    // ==========================
    // UNREAD NOTIFICATIONS
    // ==========================
    List<Notification> findByUserIdAndReadFalseOrderByCreatedAtDesc(String userId);

    // ==========================
    // UNREAD COUNT
    // ==========================
    long countByUserIdAndReadFalse(String userId);

    // ==========================
    // LATEST 10 NOTIFICATIONS
    // ==========================
    List<Notification> findTop10ByUserIdOrderByCreatedAtDesc(String userId);

    // ==========================
    // MARK ALL AS READ
    // ==========================
    List<Notification> findByUserId(String userId);
}