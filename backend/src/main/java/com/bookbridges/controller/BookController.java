package com.bookbridges.controller;

import com.bookbridges.service.BookService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/books")
@RequiredArgsConstructor
public class BookController {

    private final BookService bookService;
    private final com.bookbridges.service.FileStorageService fileStorageService;

    @GetMapping
    public ResponseEntity<Page<BookService.BookDto>> listBooks(
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String condition,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String search,
            @PageableDefault(size = 12) Pageable pageable) {
        return ResponseEntity.ok(bookService.getPublicBooks(type, condition, category, search, pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<BookService.BookDto> getBook(@PathVariable Long id) {
        return ResponseEntity.ok(bookService.getBook(id));
    }

    /**
     * Supports optional ?status=ACTIVE|PENDING_APPROVAL|SOLD|EXCHANGED|REJECTED
     * filter
     */
    @GetMapping("/my-listings")
    public ResponseEntity<List<BookService.BookDto>> getMyListings(
            @AuthenticationPrincipal String email,
            @RequestParam(required = false) String status) {
        return ResponseEntity.ok(bookService.getMyListings(email, status));
    }

    @PostMapping("/upload")
    public ResponseEntity<List<String>> uploadImages(@RequestParam("images") MultipartFile[] images) {
        return ResponseEntity.ok(fileStorageService.storeFiles(images));
    }

    @PostMapping
    public ResponseEntity<BookService.BookDto> createBook(
            @AuthenticationPrincipal String email,
            @Valid @RequestBody BookService.BookRequest req) {
        return ResponseEntity.status(201).body(bookService.createBook(email, req));
    }

    @PutMapping("/{id}")
    public ResponseEntity<BookService.BookDto> updateBook(
            @AuthenticationPrincipal String email,
            @PathVariable Long id,
            @RequestBody BookService.BookRequest req) {
        return ResponseEntity.ok(bookService.updateBook(email, id, req));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteBook(
            @AuthenticationPrincipal String email,
            @PathVariable Long id) {
        bookService.deleteBook(email, id);
        return ResponseEntity.ok(Map.of("message", "Listing deleted"));
    }
}
