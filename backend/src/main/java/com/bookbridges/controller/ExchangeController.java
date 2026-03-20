package com.bookbridges.controller;

import com.bookbridges.service.ExchangeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/exchanges")
@RequiredArgsConstructor
public class ExchangeController {

    private final ExchangeService exchangeService;

    @PostMapping("/propose")
    public ResponseEntity<ExchangeService.ExchangeDto> propose(
            @AuthenticationPrincipal String email,
            @RequestBody ExchangeService.ProposeRequest req) {
        return ResponseEntity.status(201).body(exchangeService.propose(email, req));
    }

    @GetMapping
    public ResponseEntity<List<ExchangeService.ExchangeDto>> getMyExchanges(@AuthenticationPrincipal String email) {
        return ResponseEntity.ok(exchangeService.getMyExchanges(email));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ExchangeService.ExchangeDto> getExchange(
            @AuthenticationPrincipal String email, @PathVariable Long id) {
        return ResponseEntity.ok(exchangeService.getExchange(email, id));
    }

    @PostMapping("/{id}/accept")
    public ResponseEntity<ExchangeService.ExchangeDto> accept(
            @AuthenticationPrincipal String email, @PathVariable Long id) {
        return ResponseEntity.ok(exchangeService.accept(email, id));
    }

    @PostMapping("/{id}/reject")
    public ResponseEntity<ExchangeService.ExchangeDto> reject(
            @AuthenticationPrincipal String email, @PathVariable Long id) {
        return ResponseEntity.ok(exchangeService.reject(email, id));
    }
}
