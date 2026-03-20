package com.bookbridges.service;

import com.bookbridges.domain.Book;
import com.bookbridges.domain.Exchange;
import com.bookbridges.domain.User;
import com.bookbridges.exception.AppException;
import com.bookbridges.repository.BookRepository;
import com.bookbridges.repository.ExchangeRepository;
import com.bookbridges.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ExchangeService {

    private final ExchangeRepository exchangeRepository;
    private final BookRepository bookRepository;
    private final UserRepository userRepository;

    @Transactional
    public ExchangeDto propose(String initiatorEmail, ProposeRequest req) {
        User initiator = findUserByEmail(initiatorEmail);
        Book offeredBook = bookRepository.findById(req.offeredBookId())
                .orElseThrow(() -> AppException.notFound("Offered book not found"));
        Book requestedBook = bookRepository.findById(req.requestedBookId())
                .orElseThrow(() -> AppException.notFound("Requested book not found"));

        if (!offeredBook.getOwner().getId().equals(initiator.getId())) {
            throw AppException.forbidden("You must own the book you are offering");
        }

        Exchange exchange = Exchange.builder()
                .initiator(initiator)
                .receiver(requestedBook.getOwner())
                .offeredBook(offeredBook)
                .requestedBook(requestedBook)
                .message(req.message())
                .build();

        return ExchangeDto.from(exchangeRepository.save(exchange));
    }

    public List<ExchangeDto> getMyExchanges(String email) {
        User user = findUserByEmail(email);
        return exchangeRepository.findByUserId(user.getId()).stream().map(ExchangeDto::from).toList();
    }

    public ExchangeDto getExchange(String email, Long id) {
        Exchange exchange = findById(id);
        User user = findUserByEmail(email);
        if (!exchange.getInitiator().getId().equals(user.getId()) &&
                !exchange.getReceiver().getId().equals(user.getId())) {
            throw AppException.forbidden("Access denied");
        }
        return ExchangeDto.from(exchange);
    }

    @Transactional
    public ExchangeDto accept(String email, Long id) {
        Exchange exchange = findById(id);
        validateReceiver(email, exchange);
        exchange.setStatus(Exchange.ExchangeStatus.ACCEPTED);
        exchange.getOfferedBook().setStatus(Book.BookStatus.EXCHANGED);
        exchange.getRequestedBook().setStatus(Book.BookStatus.EXCHANGED);
        bookRepository.save(exchange.getOfferedBook());
        bookRepository.save(exchange.getRequestedBook());
        return ExchangeDto.from(exchangeRepository.save(exchange));
    }

    @Transactional
    public ExchangeDto reject(String email, Long id) {
        Exchange exchange = findById(id);
        validateReceiver(email, exchange);
        exchange.setStatus(Exchange.ExchangeStatus.REJECTED);
        return ExchangeDto.from(exchangeRepository.save(exchange));
    }

    private void validateReceiver(String email, Exchange exchange) {
        User user = findUserByEmail(email);
        if (!exchange.getReceiver().getId().equals(user.getId())) {
            throw AppException.forbidden("Only the receiver can respond to this exchange");
        }
    }

    private Exchange findById(Long id) {
        return exchangeRepository.findById(id).orElseThrow(() -> AppException.notFound("Exchange not found: " + id));
    }

    private User findUserByEmail(String email) {
        return userRepository.findByEmail(email).orElseThrow(() -> AppException.notFound("User not found"));
    }

    public record ProposeRequest(Long offeredBookId, Long requestedBookId, String message) {
    }

    public record ExchangeDto(Long id, Long initiatorId, String initiatorName, Long receiverId, String receiverName,
            Long offeredBookId, String offeredBookTitle, Long requestedBookId, String requestedBookTitle,
            String message, String status, String createdAt) {
        public static ExchangeDto from(Exchange e) {
            return new ExchangeDto(e.getId(),
                    e.getInitiator().getId(), e.getInitiator().getName(),
                    e.getReceiver().getId(), e.getReceiver().getName(),
                    e.getOfferedBook().getId(), e.getOfferedBook().getTitle(),
                    e.getRequestedBook().getId(), e.getRequestedBook().getTitle(),
                    e.getMessage(), e.getStatus().name(),
                    e.getCreatedAt() != null ? e.getCreatedAt().toString() : null);
        }
    }
}
