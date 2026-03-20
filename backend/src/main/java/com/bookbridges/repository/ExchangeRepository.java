package com.bookbridges.repository;

import com.bookbridges.domain.Exchange;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExchangeRepository extends JpaRepository<Exchange, Long> {
    @Query("SELECT e FROM Exchange e WHERE e.initiator.id = :userId OR e.receiver.id = :userId ORDER BY e.createdAt DESC")
    List<Exchange> findByUserId(@Param("userId") Long userId);
}
