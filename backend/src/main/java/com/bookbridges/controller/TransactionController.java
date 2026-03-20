package com.bookbridges.controller;

import com.bookbridges.service.TransactionService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
public class TransactionController {

    private final TransactionService transactionService;

    @PostMapping("/checkout")
    public ResponseEntity<TransactionService.TxnDto> checkout(
            @AuthenticationPrincipal String email,
            @RequestBody TransactionService.CheckoutRequest req) {
        return ResponseEntity.status(201).body(transactionService.checkout(email, req));
    }

    @GetMapping("/purchases")
    public ResponseEntity<Page<TransactionService.TxnDto>> purchases(
            @AuthenticationPrincipal String email,
            @PageableDefault(size = 10) Pageable pageable) {
        return ResponseEntity.ok(transactionService.getPurchases(email, pageable));
    }

    @GetMapping("/sales")
    public ResponseEntity<Page<TransactionService.TxnDto>> sales(
            @AuthenticationPrincipal String email,
            @PageableDefault(size = 10) Pageable pageable) {
        return ResponseEntity.ok(transactionService.getSales(email, pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<TransactionService.TxnDto> getTransaction(
            @AuthenticationPrincipal String email, @PathVariable Long id) {
        return ResponseEntity.ok(transactionService.getTransaction(email, id));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<TransactionService.TxnDto> updateStatus(
            @AuthenticationPrincipal String email, @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(transactionService.updateStatus(email, id, body.get("status")));
    }
}
