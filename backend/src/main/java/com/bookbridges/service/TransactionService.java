package com.bookbridges.service;

import com.bookbridges.domain.Book;
import com.bookbridges.domain.Transaction;
import com.bookbridges.domain.User;
import com.bookbridges.exception.AppException;
import com.bookbridges.repository.BookRepository;
import com.bookbridges.repository.TransactionRepository;
import com.bookbridges.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final BookRepository bookRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    @Transactional
    public TxnDto checkout(String buyerEmail, CheckoutRequest req) {
        User buyer = findUserByEmail(buyerEmail);
        Book book = bookRepository.findById(req.bookId())
                .orElseThrow(() -> AppException.notFound("Book not found"));

        if (!book.getStatus().equals(Book.BookStatus.ACTIVE)) {
            throw AppException.badRequest("Book is not available for purchase");
        }
        if (book.getOwner().getId().equals(buyer.getId())) {
            throw AppException.badRequest("You cannot purchase your own listing");
        }

        Transaction txn = Transaction.builder()
                .buyer(buyer)
                .seller(book.getOwner())
                .book(book)
                .amount(book.getPrice() != null ? book.getPrice() : BigDecimal.ZERO)
                .paymentMethod(req.paymentMethod())
                .shippingName(req.shippingName())
                .shippingAddress(req.shippingAddress())
                .build();

        book.setStatus(Book.BookStatus.SOLD);
        bookRepository.save(book);
        Transaction saved = transactionRepository.save(txn);

        // Notify the seller about the new purchase
        notificationService.createNotification(
                book.getOwner(),
                "New Purchase! 💰",
                buyer.getName() + " purchased your book \"" + book.getTitle()
                        + "\" for $" + saved.getAmount() + ".",
                "TRANSACTION",
                "/transactions/" + saved.getId()
        );

        // Notify the buyer with a confirmation
        notificationService.createNotification(
                buyer,
                "Order Confirmed",
                "Your purchase of \"" + book.getTitle() + "\" has been confirmed. "
                        + "The seller will be in touch soon.",
                "TRANSACTION",
                "/transactions/" + saved.getId()
        );

        return TxnDto.from(saved);
    }

    public Page<TxnDto> getPurchases(String email, Pageable pageable) {
        User user = findUserByEmail(email);
        return transactionRepository.findByBuyerIdOrderByCreatedAtDesc(user.getId(), pageable).map(TxnDto::from);
    }

    public Page<TxnDto> getSales(String email, Pageable pageable) {
        User user = findUserByEmail(email);
        return transactionRepository.findBySellerIdOrderByCreatedAtDesc(user.getId(), pageable).map(TxnDto::from);
    }

    public TxnDto getTransaction(String email, Long id) {
        Transaction txn = transactionRepository.findById(id)
                .orElseThrow(() -> AppException.notFound("Transaction not found"));
        User user = findUserByEmail(email);
        if (!txn.getBuyer().getId().equals(user.getId()) && !txn.getSeller().getId().equals(user.getId())) {
            throw AppException.forbidden("Access denied");
        }
        return TxnDto.from(txn);
    }

    @Transactional
    public TxnDto updateStatus(String email, Long id, String status) {
        Transaction txn = transactionRepository.findById(id)
                .orElseThrow(() -> AppException.notFound("Transaction not found"));
        User user = findUserByEmail(email);
        if (!txn.getSeller().getId().equals(user.getId())) {
            throw AppException.forbidden("Only the seller can update the transaction status");
        }

        Transaction.TransactionStatus newStatus = Transaction.TransactionStatus.valueOf(status.toUpperCase());
        txn.setStatus(newStatus);
        Transaction saved = transactionRepository.save(txn);

        // Notify the buyer about status changes
        String statusLabel = switch (newStatus) {
            case SHIPPED -> "has been shipped! 📦";
            case DELIVERED -> "has been delivered! 📬";
            case COMPLETED -> "is now complete! ✅";
            case CANCELLED -> "has been cancelled.";
            case HANDOVER -> "is ready for handover.";
            default -> "status updated to " + newStatus.name() + ".";
        };

        notificationService.createNotification(
                txn.getBuyer(),
                "Order Update",
                "Your order for \"" + txn.getBook().getTitle() + "\" " + statusLabel,
                "TRANSACTION",
                "/transactions/" + saved.getId()
        );

        return TxnDto.from(saved);
    }

    private User findUserByEmail(String email) {
        return userRepository.findByEmail(email).orElseThrow(() -> AppException.notFound("User not found"));
    }

    public record CheckoutRequest(Long bookId, String paymentMethod, String shippingName, String shippingAddress) {
    }

    public record TxnDto(Long id, Long buyerId, String buyerName, Long sellerId, String sellerName,
            Long bookId, String bookTitle, BigDecimal amount, String status, String createdAt) {
        public static TxnDto from(Transaction t) {
            return new TxnDto(t.getId(),
                    t.getBuyer().getId(), t.getBuyer().getName(),
                    t.getSeller().getId(), t.getSeller().getName(),
                    t.getBook().getId(), t.getBook().getTitle(),
                    t.getAmount(), t.getStatus().name(),
                    t.getCreatedAt() != null ? t.getCreatedAt().toString() : null);
        }
    }
}
