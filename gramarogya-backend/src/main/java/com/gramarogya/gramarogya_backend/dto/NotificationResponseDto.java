package com.gramarogya.gramarogya_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificationResponseDto {

    private String id;

    private String title;

    private String message;

    private NotificationType type;

    private NotificationPriority priority;

    private String module;

    private String referenceId;

    private String actionUrl;

    private boolean read;

    private LocalDateTime createdAt;
}