package com.bookbridges.controller;

import com.bookbridges.service.RatingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ratings")
@RequiredArgsConstructor
public class RatingController {

    private final RatingService ratingService;

    @PostMapping
    public ResponseEntity<RatingService.RatingDto> submitRating(
            @AuthenticationPrincipal String email,
            @RequestBody RatingService.RatingRequest req) {
        return ResponseEntity.status(201).body(ratingService.submitRating(email, req));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<RatingService.RatingDto>> getUserRatings(@PathVariable Long userId) {
        return ResponseEntity.ok(ratingService.getUserRatings(userId));
    }

    @GetMapping("/user/{userId}/average")
    public ResponseEntity<Map<String, Object>> getAverageScore(@PathVariable Long userId) {
        Double avg = ratingService.getAverageScore(userId);
        return ResponseEntity.ok(Map.of("userId", userId, "averageScore", avg != null ? avg : 0.0));
    }
}
