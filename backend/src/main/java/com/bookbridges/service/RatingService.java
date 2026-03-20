package com.bookbridges.service;

import com.bookbridges.domain.Rating;
import com.bookbridges.domain.User;
import com.bookbridges.exception.AppException;
import com.bookbridges.repository.RatingRepository;
import com.bookbridges.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RatingService {

    private final RatingRepository ratingRepository;
    private final UserRepository userRepository;

    @Transactional
    public RatingDto submitRating(String reviewerEmail, RatingRequest req) {
        User reviewer = findByEmail(reviewerEmail);
        User target = userRepository.findById(req.targetUserId())
                .orElseThrow(() -> AppException.notFound("Target user not found"));

        if (reviewer.getId().equals(target.getId())) {
            throw AppException.badRequest("You cannot rate yourself");
        }

        if (ratingRepository.existsByReviewerIdAndReferenceIdAndReferenceType(
                reviewer.getId(), req.referenceId(), req.referenceType())) {
            throw AppException
                    .conflict("You have already submitted a review for this " + req.referenceType().toLowerCase());
        }

        if (req.score() < 1 || req.score() > 5) {
            throw AppException.badRequest("Score must be between 1 and 5");
        }

        Rating rating = Rating.builder()
                .reviewer(reviewer)
                .target(target)
                .referenceId(req.referenceId())
                .referenceType(req.referenceType().toUpperCase())
                .score(req.score().shortValue())
                .reviewText(req.reviewText())
                .build();

        return RatingDto.from(ratingRepository.save(rating));
    }

    public List<RatingDto> getUserRatings(Long userId) {
        return ratingRepository.findByTargetIdOrderByCreatedAtDesc(userId).stream()
                .map(RatingDto::from).toList();
    }

    public Double getAverageScore(Long userId) {
        return ratingRepository.findAverageScoreByUserId(userId);
    }

    private User findByEmail(String email) {
        return userRepository.findByEmail(email).orElseThrow(() -> AppException.notFound("User not found"));
    }

    public record RatingRequest(Long targetUserId, Long referenceId, String referenceType, Integer score,
            String reviewText) {
    }

    public record RatingDto(Long id, Long reviewerId, String reviewerName, Long targetId, String targetName,
            Long referenceId, String referenceType, Short score, String reviewText, String createdAt) {
        public static RatingDto from(Rating r) {
            return new RatingDto(r.getId(),
                    r.getReviewer().getId(), r.getReviewer().getName(),
                    r.getTarget().getId(), r.getTarget().getName(),
                    r.getReferenceId(), r.getReferenceType(), r.getScore(), r.getReviewText(),
                    r.getCreatedAt() != null ? r.getCreatedAt().toString() : null);
        }
    }
}
