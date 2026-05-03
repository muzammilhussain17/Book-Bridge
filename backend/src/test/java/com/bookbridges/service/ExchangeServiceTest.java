package com.bookbridges.service;

import com.bookbridges.domain.Book;
import com.bookbridges.domain.Exchange;
import com.bookbridges.domain.User;
import com.bookbridges.exception.AppException;
import com.bookbridges.repository.BookRepository;
import com.bookbridges.repository.ExchangeRepository;
import com.bookbridges.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ExchangeServiceTest {

    @Mock
    private ExchangeRepository exchangeRepository;
    @Mock
    private BookRepository bookRepository;
    @Mock
    private UserRepository userRepository;
    @Mock
    private NotificationService notificationService;

    @InjectMocks
    private ExchangeService exchangeService;

    private User initiator;
    private User receiver;
    private Book offeredBook;
    private Book requestedBook;
    private Exchange testExchange;

    @BeforeEach
    void setUp() {
        initiator = User.builder().id(1L).email("init@test.com").name("Initiator").build();
        receiver = User.builder().id(2L).email("recv@test.com").name("Receiver").build();
        offeredBook = Book.builder().id(10L).title("Offered").owner(initiator).build();
        requestedBook = Book.builder().id(11L).title("Requested").owner(receiver).build();
        
        testExchange = Exchange.builder()
                .id(1L)
                .initiator(initiator)
                .receiver(receiver)
                .offeredBook(offeredBook)
                .requestedBook(requestedBook)
                .status(Exchange.ExchangeStatus.PENDING)
                .build();
    }

    @Test
    void propose_Success() {
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(initiator));
        when(bookRepository.findById(10L)).thenReturn(Optional.of(offeredBook));
        when(bookRepository.findById(11L)).thenReturn(Optional.of(requestedBook));
        when(exchangeRepository.save(any())).thenReturn(testExchange);

        ExchangeService.ProposeRequest req = new ExchangeService.ProposeRequest(10L, 11L, "Trade?");
        ExchangeService.ExchangeDto result = exchangeService.propose("init@test.com", req);

        assertNotNull(result);
        verify(notificationService).createNotification(any(), any(), any(), any(), any());
    }

    @Test
    void accept_Success() {
        when(exchangeRepository.findById(1L)).thenReturn(Optional.of(testExchange));
        when(userRepository.findByEmail("recv@test.com")).thenReturn(Optional.of(receiver));
        when(exchangeRepository.save(any())).thenReturn(testExchange);

        ExchangeService.ExchangeDto result = exchangeService.accept("recv@test.com", 1L);

        assertEquals("ACCEPTED", result.status());
        verify(bookRepository, times(2)).save(any()); // Save both books with EXCHANGED status
    }

    @Test
    void reject_Success() {
        when(exchangeRepository.findById(1L)).thenReturn(Optional.of(testExchange));
        when(userRepository.findByEmail("recv@test.com")).thenReturn(Optional.of(receiver));
        when(exchangeRepository.save(any())).thenReturn(testExchange);

        ExchangeService.ExchangeDto result = exchangeService.reject("recv@test.com", 1L);

        assertEquals("REJECTED", result.status());
    }
}
