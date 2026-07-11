package com.gramarogya.gramarogya_backend.service;

import com.gramarogya.gramarogya_backend.dto.NotificationResponseDto;
import com.gramarogya.gramarogya_backend.entity.Notification;
import com.gramarogya.gramarogya_backend.entity.User;
import com.gramarogya.gramarogya_backend.mapper.NotificationMapper;
import com.gramarogya.gramarogya_backend.repository.NotificationRepository;
import com.gramarogya.gramarogya_backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final NotificationMapper notificationMapper;
    private final UserRepository userRepository;

    // ==========================
    // GET LOGGED-IN USER
    // ==========================
    private User getLoggedInUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    // ==========================
    // GET ALL NOTIFICATIONS
    // ==========================
    @Override
    public List<NotificationResponseDto> getMyNotifications(String email) {

        User user = getLoggedInUser(email);

        return notificationRepository
                .findByUserIdOrderByCreatedAtDesc(user.getId())
                .stream()
                .map(notificationMapper::toResponseDto)
                .toList();
    }

    // ==========================
    // GET LATEST 10 NOTIFICATIONS
    // ==========================
    @Override
    public List<NotificationResponseDto> getLatestNotifications(String email) {

        User user = getLoggedInUser(email);

        return notificationRepository
                .findTop10ByUserIdOrderByCreatedAtDesc(user.getId())
                .stream()
                .map(notificationMapper::toResponseDto)
                .toList();
    }

    // ==========================
    // GET UNREAD NOTIFICATIONS
    // ==========================
    @Override
    public List<NotificationResponseDto> getUnreadNotifications(String email) {

        User user = getLoggedInUser(email);

        return notificationRepository
                .findByUserIdAndReadFalseOrderByCreatedAtDesc(user.getId())
                .stream()
                .map(notificationMapper::toResponseDto)
                .toList();
    }

    // ==========================
    // GET UNREAD COUNT
    // ==========================
    @Override
    public long getUnreadCount(String email) {

        User user = getLoggedInUser(email);

        return notificationRepository
                .countByUserIdAndReadFalse(user.getId());
    }

    // ==========================
    // MARK SINGLE AS READ
    // ==========================
    @Override
    public NotificationResponseDto markAsRead(String notificationId, String email) {

        User user = getLoggedInUser(email);

        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));

        if (!notification.getUserId().equals(user.getId())) {
            throw new RuntimeException("Access denied");
        }

        notification.setRead(true);
        notification.setReadAt(LocalDateTime.now());

        Notification saved = notificationRepository.save(notification);

        return notificationMapper.toResponseDto(saved);
    }

    // ==========================
    // MARK ALL AS READ
    // ==========================
    @Override
    public void markAllAsRead(String email) {

        User user = getLoggedInUser(email);

        List<Notification> notifications =
                notificationRepository.findByUserId(user.getId());

        notifications.forEach(notification -> {
            notification.setRead(true);
            notification.setReadAt(LocalDateTime.now());
        });

        notificationRepository.saveAll(notifications);
    }

    // ==========================
    // DELETE ONE NOTIFICATION
    // ==========================
    @Override
    public void deleteNotification(String notificationId, String email) {

        User user = getLoggedInUser(email);

        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));

        if (!notification.getUserId().equals(user.getId())) {
            throw new RuntimeException("Access denied");
        }

        notificationRepository.delete(notification);
    }

    // ==========================
    // DELETE ALL NOTIFICATIONS
    // ==========================
    @Override
    public void deleteAllNotifications(String email) {

        User user = getLoggedInUser(email);

        List<Notification> notifications =
                notificationRepository.findByUserId(user.getId());

        notificationRepository.deleteAll(notifications);
    }
}