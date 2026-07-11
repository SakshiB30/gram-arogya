package com.gramarogya.gramarogya_backend.controller;

import com.gramarogya.gramarogya_backend.dto.NotificationResponseDto;
import com.gramarogya.gramarogya_backend.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    // ==========================
    // GET ALL NOTIFICATIONS
    // ==========================
    @GetMapping
    public List<NotificationResponseDto> getMyNotifications(
            Authentication authentication) {

        return notificationService.getMyNotifications(
                authentication.getName());
    }

    // ==========================
    // GET LATEST 10 NOTIFICATIONS
    // ==========================
    @GetMapping("/latest")
    public List<NotificationResponseDto> getLatestNotifications(
            Authentication authentication) {

        return notificationService.getLatestNotifications(
                authentication.getName());
    }

    // ==========================
    // GET UNREAD NOTIFICATIONS
    // ==========================
    @GetMapping("/unread")
    public List<NotificationResponseDto> getUnreadNotifications(
            Authentication authentication) {

        return notificationService.getUnreadNotifications(
                authentication.getName());
    }

    // ==========================
    // GET UNREAD COUNT
    // ==========================
    @GetMapping("/unread-count")
    public long getUnreadCount(
            Authentication authentication) {

        return notificationService.getUnreadCount(
                authentication.getName());
    }

    // ==========================
    // MARK SINGLE AS READ
    // ==========================
    @PutMapping("/{notificationId}/read")
    public NotificationResponseDto markAsRead(
            @PathVariable String notificationId,
            Authentication authentication) {

        return notificationService.markAsRead(
                notificationId,
                authentication.getName()
        );
    }

    // ==========================
    // MARK ALL AS READ
    // ==========================
    @PutMapping("/read-all")
    public void markAllAsRead(
            Authentication authentication) {

        notificationService.markAllAsRead(
                authentication.getName());
    }

    // ==========================
    // DELETE SINGLE NOTIFICATION
    // ==========================
    @DeleteMapping("/{notificationId}")
    public void deleteNotification(
            @PathVariable String notificationId,
            Authentication authentication) {

        notificationService.deleteNotification(
                notificationId,
                authentication.getName()
        );
    }

    // ==========================
    // DELETE ALL NOTIFICATIONS
    // ==========================
    @DeleteMapping
    public void deleteAllNotifications(
            Authentication authentication) {

        notificationService.deleteAllNotifications(
                authentication.getName());
    }
}