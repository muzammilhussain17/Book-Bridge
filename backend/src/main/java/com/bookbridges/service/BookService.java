package com.bookbridges.service;

import com.bookbridges.domain.Book;
import com.bookbridges.domain.User;
import com.bookbridges.exception.AppException;
import com.bookbridges.repository.BookRepository;
import com.bookbridges.repository.UserRepository;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BookService {

    private final BookRepository bookRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    public Page<BookDto> getPublicBooks(String type, String condition, String category, String search,
            Pageable pageable) {
        Book.TransactionType typeEnum = parseEnum(Book.TransactionType.class, type);
        Book.Condition condEnum = parseEnum(Book.Condition.class, condition);
        String categoryParam = category != null && !category.isBlank() ? category.toLowerCase() : null;
        String searchParam = search != null && !search.isBlank() ? search.toLowerCase() : null;
        return bookRepository.findPublicBooks(typeEnum, condEnum, categoryParam, searchParam, pageable)
                .map(BookDto::from);
    }

    public BookDto getBook(Long id) {
        return BookDto.from(findById(id));
    }

    /** Get user's own listings, with optional status filter */
    public List<BookDto> getMyListings(String email, String status) {
        User user = findUserByEmail(email);
        if (status != null && !status.isBlank()) {
            try {
                Book.BookStatus statusEnum = Book.BookStatus.valueOf(status.toUpperCase());
                return bookRepository.findByOwnerIdAndStatusOrderByCreatedAtDesc(user.getId(), statusEnum)
                        .stream().map(BookDto::from).toList();
            } catch (IllegalArgumentException e) {
                // ignore invalid status, fall through to return all
            }
        }
        return bookRepository.findByOwnerIdOrderByCreatedAtDesc(user.getId())
                .stream().map(BookDto::from).toList();
    }

    @Transactional
    public BookDto createBook(String email, BookRequest req) {
        User owner = findUserByEmail(email);

        // Validate enums
        Book.TransactionType type;
        try {
            type = Book.TransactionType.valueOf(req.transactionType().toUpperCase());
        } catch (Exception e) {
            throw AppException.badRequest("Invalid transaction type: " + req.transactionType());
        }

        Book.Condition condition;
        try {
            condition = Book.Condition.valueOf(req.condition().toUpperCase());
        } catch (Exception e) {
            throw AppException.badRequest("Invalid condition: " + req.condition());
        }

        // Validate price for SALE type
        if (type == Book.TransactionType.SALE && (req.price() == null || req.price().compareTo(BigDecimal.ZERO) <= 0)) {
            throw AppException.badRequest("A price greater than zero is required for SALE listings");
        }

        Book book = Book.builder()
                .title(req.title())
                .author(req.author())
                .isbn(req.isbn())
                .description(req.description())
                .price(req.price() != null ? req.price() : BigDecimal.ZERO)
                .condition(condition)
                .category(req.category())
                .courseCode(req.courseCode())
                .transactionType(type)
                .imageUrl(req.imageUrl())
                .imageUrls(req.imageUrls() != null ? new ArrayList<>(req.imageUrls()) : new ArrayList<>())
                .owner(owner)
                .build();
        return BookDto.from(bookRepository.save(book));
    }

    @Transactional
    public BookDto updateBook(String email, Long bookId, BookRequest req) {
        Book book = findById(bookId);
        User user = findUserByEmail(email);
        if (!book.getOwner().getId().equals(user.getId())) {
            throw AppException.forbidden("You are not the owner of this listing");
        }
        if (req.title() != null)
            book.setTitle(req.title());
        if (req.author() != null)
            book.setAuthor(req.author());
        if (req.description() != null)
            book.setDescription(req.description());
        if (req.price() != null)
            book.setPrice(req.price());
        if (req.imageUrl() != null)
            book.setImageUrl(req.imageUrl());
        if (req.imageUrls() != null) {
            book.getImageUrls().clear();
            book.getImageUrls().addAll(req.imageUrls());
        }
        if (req.condition() != null) {
            try {
                book.setCondition(Book.Condition.valueOf(req.condition().toUpperCase()));
            } catch (Exception ignored) {
            }
        }
        return BookDto.from(bookRepository.save(book));
    }

    @Transactional
    public void deleteBook(String email, Long bookId) {
        Book book = findById(bookId);
        User user = findUserByEmail(email);
        if (!book.getOwner().getId().equals(user.getId())) {
            throw AppException.forbidden("You are not the owner of this listing");
        }
        bookRepository.delete(book);
    }

    // --- Admin ---
    public Page<BookDto> getQuarantine(Pageable pageable) {
        return bookRepository.findByStatusOrderByCreatedAtDesc(Book.BookStatus.PENDING_APPROVAL, pageable)
                .map(BookDto::from);
    }

    @Transactional
    public BookDto approveBook(Long bookId) {
        Book book = findById(bookId);
        book.setStatus(Book.BookStatus.ACTIVE);
        Book saved = bookRepository.save(book);

        // Notify book owner
        notificationService.createNotification(
                book.getOwner(),
                "Book Approved! ✅",
                "Your listing \"" + book.getTitle() + "\" has been approved and is now live.",
                "STATUS",
                "/books/" + saved.getId()
        );

        return BookDto.from(saved);
    }

    @Transactional
    public void rejectBook(Long bookId) {
        Book book = findById(bookId);
        book.setStatus(Book.BookStatus.REJECTED);
        bookRepository.save(book);

        // Notify book owner
        notificationService.createNotification(
                book.getOwner(),
                "Listing Rejected",
                "Your listing \"" + book.getTitle() + "\" was rejected. Please review our guidelines and re-submit.",
                "STATUS",
                "/my-listings"
        );
    }

    // --- Helpers ---
    private Book findById(Long id) {
        return bookRepository.findById(id).orElseThrow(() -> AppException.notFound("Book not found with id: " + id));
    }

    private User findUserByEmail(String email) {
        return userRepository.findByEmail(email).orElseThrow(() -> AppException.notFound("User not found"));
    }

    private <T extends Enum<T>> T parseEnum(Class<T> clazz, String value) {
        if (value == null || value.isBlank())
            return null;
        try {
            return Enum.valueOf(clazz, value.toUpperCase());
        } catch (IllegalArgumentException e) {
            return null;
        }
    }

    // --- DTOs ---
    public record BookRequest(
            @NotBlank String title,
            @NotBlank String author,
            String isbn,
            String description,
            BigDecimal price,
            @NotBlank String condition,
            String category,
            String courseCode,
            @NotBlank String transactionType,
            String imageUrl,
            List<String> imageUrls) {
    }

    public record BookDto(
            Long id, String title, String author, String isbn, String description,
            BigDecimal price, String condition, String category, String courseCode,
            String transactionType, String status, String imageUrl, List<String> imageUrls,
            Long ownerId, String ownerName, String ownerAvatar, String createdAt) {
        public static BookDto from(Book b) {
            return new BookDto(
                    b.getId(), b.getTitle(), b.getAuthor(), b.getIsbn(), b.getDescription(),
                    b.getPrice(), b.getCondition().name(), b.getCategory(), b.getCourseCode(),
                    b.getTransactionType().name(), b.getStatus().name(), b.getImageUrl(),
                    b.getImageUrls() != null ? new ArrayList<>(b.getImageUrls()) : new ArrayList<>(),
                    b.getOwner().getId(), b.getOwner().getName(), b.getOwner().getAvatarUrl(),
                    b.getCreatedAt() != null ? b.getCreatedAt().toString() : null);
        }
    }
}
