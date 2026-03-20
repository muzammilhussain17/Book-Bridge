package com.bookbridges.controller.admin;

import com.bookbridges.domain.Book;
import com.bookbridges.domain.User;
import com.bookbridges.domain.ViolationLog;
import com.bookbridges.repository.BookRepository;
import com.bookbridges.repository.TransactionRepository;
import com.bookbridges.repository.UserRepository;
import com.bookbridges.repository.ViolationLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin/system")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminSystemController {

        private final UserRepository userRepository;
        private final BookRepository bookRepository;
        private final TransactionRepository transactionRepository;
        private final ViolationLogRepository violationLogRepository;

        @GetMapping("/stats")
        public ResponseEntity<Map<String, Object>> getStats() {
                long totalUsers = userRepository.count();
                long activeUsers = userRepository.countByStatus(User.UserStatus.ACTIVE);
                long suspendedUsers = userRepository.countByStatus(User.UserStatus.SUSPENDED);
                long totalBooks = bookRepository.countByStatus(Book.BookStatus.ACTIVE);
                long pendingApprovals = bookRepository.countByStatus(Book.BookStatus.PENDING_APPROVAL);
                long totalTransactions = transactionRepository.count();

                return ResponseEntity.ok(Map.of(
                                "totalUsers", totalUsers,
                                "activeUsers", activeUsers,
                                "suspendedUsers", suspendedUsers,
                                "totalBooks", totalBooks,
                                "pendingApprovals", pendingApprovals,
                                "totalTransactions", totalTransactions));
        }

        @GetMapping("/violations")
        public ResponseEntity<Page<ViolationLogDto>> getViolations(
                        @PageableDefault(size = 20) Pageable pageable) {
                return ResponseEntity.ok(
                                violationLogRepository.findAllByOrderByCreatedAtDesc(pageable)
                                                .map(ViolationLogDto::from));
        }

        public record ViolationLogDto(Long id, String userEmail, String type, String severity,
                        String resolution, String createdAt) {
                public static ViolationLogDto from(ViolationLog v) {
                        String email = v.getUserEmail() != null ? v.getUserEmail()
                                        : (v.getUser() != null ? v.getUser().getEmail() : "unknown");
                        return new ViolationLogDto(v.getId(), email, v.getType(), v.getSeverity(), v.getResolution(),
                                        v.getCreatedAt() != null ? v.getCreatedAt().toString() : null);
                }
        }
}
