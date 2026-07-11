package com.gramarogya.gramarogya_backend.entity;

import com.gramarogya.gramarogya_backend.dto.NotificationPriority;
import com.gramarogya.gramarogya_backend.dto.NotificationType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "notifications")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Notification {

    @Id
    private String id;

    // Recipient
    private String userId;

    // Event type
    private NotificationType type;

    // Module that generated the notification
    private String module;

    // Related record (Beneficiary ID, Visit ID, Medicine ID, etc.)
    private String referenceId;

    // Title
    private String title;

    // Message
    private String message;

    // Priority
    private NotificationPriority priority;

    // Navigation URL (Frontend)
    private String actionUrl;

    // Read status
    private boolean read;

    // Soft delete
    private boolean deleted;

    // Time
    private LocalDateTime createdAt;

    // Read timestamp
    private LocalDateTime readAt;
}