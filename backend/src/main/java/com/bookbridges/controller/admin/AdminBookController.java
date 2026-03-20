package com.bookbridges.controller.admin;

import com.bookbridges.service.BookService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin/books")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminBookController {

    private final BookService bookService;

    @GetMapping("/quarantine")
    public ResponseEntity<Page<BookService.BookDto>> getQuarantine(
            @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(bookService.getQuarantine(pageable));
    }

    @PostMapping("/{id}/approve")
    public ResponseEntity<BookService.BookDto> approveBook(@PathVariable Long id) {
        return ResponseEntity.ok(bookService.approveBook(id));
    }

    @PostMapping("/{id}/reject")
    public ResponseEntity<Map<String, String>> rejectBook(@PathVariable Long id) {
        bookService.rejectBook(id);
        return ResponseEntity.ok(Map.of("message", "Book listing rejected"));
    }
}
