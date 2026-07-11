package com.gramarogya.gramarogya_backend.service;

import com.gramarogya.gramarogya_backend.dto.NotificationResponseDto;

import java.util.List;

public interface NotificationService {

    // ==========================
    // GET ALL NOTIFICATIONS
    // ==========================
    List<NotificationResponseDto> getMyNotifications(String email);

    // ==========================
    // GET LATEST 10 NOTIFICATIONS
    // ==========================
    List<NotificationResponseDto> getLatestNotifications(String email);

    // ==========================
    // GET UNREAD NOTIFICATIONS
    // ==========================
    List<NotificationResponseDto> getUnreadNotifications(String email);

    // ==========================
    // GET UNREAD COUNT
    // ==========================
    long getUnreadCount(String email);

    // ==========================
    // MARK SINGLE AS READ
    // ==========================
    NotificationResponseDto markAsRead(String notificationId, String email);

    // ==========================
    // MARK ALL AS READ
    // ==========================
    void markAllAsRead(String email);

    // ==========================
    // DELETE ONE NOTIFICATION
    // ==========================
    void deleteNotification(String notificationId, String email);

    // ==========================
    // DELETE ALL NOTIFICATIONS
    // ==========================
    void deleteAllNotifications(String email);
}