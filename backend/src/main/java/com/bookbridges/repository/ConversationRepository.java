package com.bookbridges.repository;

import com.bookbridges.domain.Conversation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ConversationRepository extends JpaRepository<Conversation, Long> {
    @Query("SELECT c FROM Conversation c WHERE c.participantA.id = :userId OR c.participantB.id = :userId")
    List<Conversation> findByParticipant(@Param("userId") Long userId);

    @Query("SELECT c FROM Conversation c WHERE (c.participantA.id = :a AND c.participantB.id = :b) OR (c.participantA.id = :b AND c.participantB.id = :a)")
    Optional<Conversation> findBetween(@Param("a") Long a, @Param("b") Long b);
}
