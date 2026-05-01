package com.bookbridges.service;

import com.bookbridges.domain.Notification;
import com.bookbridges.domain.User;
import com.bookbridges.exception.AppException;
import com.bookbridges.repository.NotificationRepository;
import com.bookbridges.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;

    public List<NotificationDto> getNotifications(String email) {
        User user = findByEmail(email);
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(user.getId())
                .stream().map(NotificationDto::from).toList();
    }

    public long getUnreadCount(String email) {
        User user = findByEmail(email);
        return notificationRepository.countByUserIdAndIsReadFalse(user.getId());
    }

    @Transactional
    public NotificationDto markRead(String email, Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> AppException.notFound("Notification not found"));
        User user = findByEmail(email);
        if (!notification.getUser().getId().equals(user.getId())) {
            throw AppException.forbidden("Access denied");
        }
        notification.setIsRead(true);
        return NotificationDto.from(notificationRepository.save(notification));
    }

    @Transactional
    public int markAllRead(String email) {
        User user = findByEmail(email);
        List<Notification> unread = notificationRepository.findByUserIdOrderByCreatedAtDesc(user.getId())
                .stream().filter(n -> !n.getIsRead()).toList();
        unread.forEach(n -> n.setIsRead(true));
        notificationRepository.saveAll(unread);
        return unread.size();
    }

    @Transactional
    public void deleteNotification(String email, Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> AppException.notFound("Notification not found"));
        User user = findByEmail(email);
        if (!notification.getUser().getId().equals(user.getId())) {
            throw AppException.forbidden("Access denied");
        }
        notificationRepository.delete(notification);
    }

    /**
     * Called by other services to create an in-app notification AND send an email.
     */
    @Transactional
    public void createNotification(User user, String title, String message, String type) {
        createNotification(user, title, message, type, null);
    }

    /**
     * Creates an in-app notification with an optional action URL, and sends
     * a corresponding email notification asynchronously.
     */
    @Transactional
    public void createNotification(User user, String title, String message, String type, String actionUrl) {
        // 1) Persist in-app notification
        Notification notification = Notification.builder()
                .user(user)
                .title(title)
                .message(message)
                .type(type)
                .build();
        notificationRepository.save(notification);

        // 2) Send email notification (async, won't block)
        try {
            String subject = "Book Bridges — " + title;
            emailService.sendNotificationEmail(
                    user.getEmail(), subject, title, message, type, actionUrl
            );
        } catch (Exception e) {
            // Never let email failures break the main flow
            log.warn("Email dispatch failed for user {}: {}", user.getEmail(), e.getMessage());
        }
    }

    private User findByEmail(String email) {
        return userRepository.findByEmail(email).orElseThrow(() -> AppException.notFound("User not found"));
    }

    public record NotificationDto(Long id, String title, String message, String type, Boolean isRead,
            String createdAt) {
        public static NotificationDto from(Notification n) {
            return new NotificationDto(n.getId(), n.getTitle(), n.getMessage(), n.getType(), n.getIsRead(),
                    n.getCreatedAt() != null ? n.getCreatedAt().toString() : null);
        }
    }
}
