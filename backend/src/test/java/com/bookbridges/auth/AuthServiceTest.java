package com.bookbridges.auth;

import com.bookbridges.domain.User;
import com.bookbridges.exception.AppException;
import com.bookbridges.repository.UserRepository;
import com.bookbridges.service.EmailService;
import com.bookbridges.service.NotificationService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;
    @Mock
    private PasswordEncoder passwordEncoder;
    @Mock
    private JwtUtils jwtUtils;
    @Mock
    private EmailService emailService;
    @Mock
    private NotificationService notificationService;

    @InjectMocks
    private AuthService authService;

    private RegisterRequest registerRequest;
    private LoginRequest loginRequest;
    private User testUser;

    @BeforeEach
    void setUp() {
        registerRequest = new RegisterRequest("Test User", "test@example.com", "password123");
        loginRequest = new LoginRequest("test@example.com", "password123");
        testUser = User.builder()
                .id(1L)
                .name("Test User")
                .email("test@example.com")
                .password("encodedPassword")
                .role(User.Role.USER)
                .status(User.UserStatus.ACTIVE)
                .build();
    }

    @Test
    void register_Success() {
        when(userRepository.existsByEmail(anyString())).thenReturn(false);
        when(passwordEncoder.encode(anyString())).thenReturn("encodedPassword");
        when(jwtUtils.generateToken(anyString(), anyString())).thenReturn("mockToken");

        AuthResponse response = authService.register(registerRequest);

        assertNotNull(response);
        assertEquals("test@example.com", response.user().email());
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void register_EmailAlreadyExists_ThrowsConflict() {
        when(userRepository.existsByEmail(anyString())).thenReturn(true);

        assertThrows(AppException.class, () -> authService.register(registerRequest));
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void login_Success() {
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches(anyString(), anyString())).thenReturn(true);
        when(jwtUtils.generateToken(anyString(), anyString())).thenReturn("mockToken");

        AuthResponse response = authService.login(loginRequest);

        assertNotNull(response);
        assertEquals("mockToken", response.token());
        assertEquals("test@example.com", response.user().email());
    }

    @Test
    void login_InvalidPassword_ThrowsUnauthorized() {
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches(anyString(), anyString())).thenReturn(false);

        assertThrows(AppException.class, () -> authService.login(loginRequest));
    }
}
