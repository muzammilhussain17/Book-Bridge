package com.bookbridges.controller;

import com.bookbridges.service.MessageService;
import jakarta.validation.constraints.NotBlank;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/messages")
@RequiredArgsConstructor
public class MessageController {

    private final MessageService messageService;

    /** List all conversations for the current user */
    @GetMapping("/conversations")
    public ResponseEntity<List<MessageService.ConversationDto>> getConversations(
            @AuthenticationPrincipal String email) {
        return ResponseEntity.ok(messageService.getConversations(email));
    }

    /** Start or retrieve a conversation with another user */
    @PostMapping("/conversations")
    public ResponseEntity<MessageService.ConversationDto> startConversation(
            @AuthenticationPrincipal String email,
            @RequestBody Map<String, Long> body) {
        Long otherUserId = body.get("userId");
        if (otherUserId == null) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.status(201).body(messageService.startConversation(email, otherUserId));
    }

    /** Get all messages for a conversation */
    @GetMapping("/{conversationId}")
    public ResponseEntity<List<MessageService.MessageDto>> getMessages(
            @AuthenticationPrincipal String email,
            @PathVariable Long conversationId) {
        return ResponseEntity.ok(messageService.getMessages(email, conversationId));
    }

    /** Send a message in a conversation */
    @PostMapping("/{conversationId}")
    public ResponseEntity<MessageService.MessageDto> sendMessage(
            @AuthenticationPrincipal String email,
            @PathVariable Long conversationId,
            @RequestBody Map<String, String> body) {
        String content = body.get("content");
        return ResponseEntity.status(201).body(messageService.sendMessage(email, conversationId, content));
    }

    /** Mark all messages in a conversation as read */
    @PostMapping("/{conversationId}/read")
    public ResponseEntity<Map<String, Integer>> markAllRead(
            @AuthenticationPrincipal String email,
            @PathVariable Long conversationId) {
        int count = messageService.markAllRead(email, conversationId);
        return ResponseEntity.ok(Map.of("markedRead", count));
    }
}
