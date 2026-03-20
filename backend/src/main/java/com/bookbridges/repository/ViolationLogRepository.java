package com.bookbridges.repository;

import com.bookbridges.domain.ViolationLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ViolationLogRepository extends JpaRepository<ViolationLog, Long> {
    Page<ViolationLog> findAllByOrderByCreatedAtDesc(Pageable pageable);
}
