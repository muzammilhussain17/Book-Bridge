package com.bookbridges.repository;

import com.bookbridges.domain.Rating;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RatingRepository extends JpaRepository<Rating, Long> {
    List<Rating> findByTargetIdOrderByCreatedAtDesc(Long targetId);

    @Query("SELECT AVG(r.score) FROM Rating r WHERE r.target.id = :userId")
    Double findAverageScoreByUserId(@Param("userId") Long userId);

    boolean existsByReviewerIdAndReferenceIdAndReferenceType(Long reviewerId, Long referenceId, String referenceType);
}
