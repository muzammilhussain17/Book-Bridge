package com.bookbridges.service;

import com.bookbridges.domain.Book;
import com.bookbridges.domain.User;
import com.bookbridges.exception.AppException;
import com.bookbridges.repository.BookRepository;
import com.bookbridges.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class BookServiceTest {

    @Mock
    private BookRepository bookRepository;
    @Mock
    private UserRepository userRepository;
    @Mock
    private NotificationService notificationService;

    @InjectMocks
    private BookService bookService;

    private User testUser;
    private Book testBook;
    private BookService.BookRequest bookRequest;

    @BeforeEach
    void setUp() {
        testUser = User.builder().id(1L).email("test@example.com").name("Tester").build();
        testBook = Book.builder()
                .id(1L)
                .title("Test Book")
                .author("Test Author")
                .owner(testUser)
                .status(Book.BookStatus.ACTIVE)
                .condition(Book.Condition.NEW)
                .transactionType(Book.TransactionType.SALE)
                .price(BigDecimal.valueOf(500))
                .build();
        
        bookRequest = new BookService.BookRequest(
                "New Book", "New Author", "1234567890", "Desc",
                BigDecimal.valueOf(200), "NEW", "Fiction", "CS101",
                "SALE", "img.url", Collections.emptyList()
        );
    }

    @Test
    void createBook_Success() {
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(testUser));
        when(bookRepository.save(any(Book.class))).thenReturn(testBook);

        BookService.BookDto result = bookService.createBook("test@example.com", bookRequest);

        assertNotNull(result);
        verify(bookRepository, times(1)).save(any(Book.class));
    }

    @Test
    void getBook_Found_ReturnsDto() {
        when(bookRepository.findById(1L)).thenReturn(Optional.of(testBook));

        BookService.BookDto result = bookService.getBook(1L);

        assertNotNull(result);
        assertEquals("Test Book", result.title());
    }

    @Test
    void getBook_NotFound_ThrowsException() {
        when(bookRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(AppException.class, () -> bookService.getBook(99L));
    }

    @Test
    void deleteBook_OwnerSuccess() {
        when(bookRepository.findById(1L)).thenReturn(Optional.of(testBook));
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(testUser));

        bookService.deleteBook("test@example.com", 1L);

        verify(bookRepository, times(1)).delete(testBook);
    }

    @Test
    void deleteBook_NotOwner_ThrowsForbidden() {
        User otherUser = User.builder().id(2L).email("other@example.com").build();
        when(bookRepository.findById(1L)).thenReturn(Optional.of(testBook));
        when(userRepository.findByEmail("other@example.com")).thenReturn(Optional.of(otherUser));

        assertThrows(AppException.class, () -> bookService.deleteBook("other@example.com", 1L));
        verify(bookRepository, never()).delete(any());
    }

    @Test
    void approveBook_UpdatesStatusAndNotifies() {
        when(bookRepository.findById(1L)).thenReturn(Optional.of(testBook));
        when(bookRepository.save(any(Book.class))).thenReturn(testBook);

        bookService.approveBook(1L);

        assertEquals(Book.BookStatus.ACTIVE, testBook.getStatus());
        verify(notificationService, times(1)).createNotification(any(), any(), any(), any(), any());
    }
}
