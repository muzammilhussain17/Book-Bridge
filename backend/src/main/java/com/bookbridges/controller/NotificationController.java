package com.bookbridges.controller;

import com.bookbridges.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping
    public ResponseEntity<List<NotificationService.NotificationDto>> getNotifications(
            @AuthenticationPrincipal String email) {
        return ResponseEntity.ok(notificationService.getNotifications(email));
    }

    /** Lightweight endpoint for the notification badge count */
    @GetMapping("/unread-count")
    public ResponseEntity<Map<String, Long>> getUnreadCount(@AuthenticationPrincipal String email) {
        return ResponseEntity.ok(Map.of("count", notificationService.getUnreadCount(email)));
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<NotificationService.NotificationDto> markRead(
            @AuthenticationPrincipal String email, @PathVariable Long id) {
        return ResponseEntity.ok(notificationService.markRead(email, id));
    }

    @PostMapping("/read-all")
    public ResponseEntity<Map<String, Integer>> markAllRead(@AuthenticationPrincipal String email) {
        return ResponseEntity.ok(Map.of("markedRead", notificationService.markAllRead(email)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNotification(
            @AuthenticationPrincipal String email, @PathVariable Long id) {
        notificationService.deleteNotification(email, id);
        return ResponseEntity.noContent().build();
    }
}
