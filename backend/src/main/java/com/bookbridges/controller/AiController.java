package com.bookbridges.controller;

import com.bookbridges.service.AiService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

/**
 * Thin controller — all logic is delegated to AiService.
 */
@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
public class AiController {

    private final AiService aiService;

    @PostMapping("/chat")
    public ResponseEntity<AiService.ChatResponse> chat(
            @RequestBody AiService.ChatRequest request,
            @AuthenticationPrincipal String currentUserEmail) {

        AiService.ChatResponse response = aiService.chat(request, currentUserEmail);
        return ResponseEntity.ok(response);
    }
}
