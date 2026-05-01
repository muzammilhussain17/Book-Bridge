package com.bookbridges.auth;

import com.bookbridges.domain.User;
import com.bookbridges.exception.AppException;
import com.bookbridges.repository.UserRepository;
import com.bookbridges.service.EmailService;
import com.bookbridges.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;
    private final EmailService emailService;
    private final NotificationService notificationService;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw AppException.conflict("Email is already registered");
        }

        User user = User.builder()
                .name(request.name())
                .email(request.email())
                .password(passwordEncoder.encode(request.password()))
                .role(User.Role.USER)
                .build();

        userRepository.save(user);
        String token = jwtUtils.generateToken(user.getEmail(), user.getRole().name());

        // Send welcome email (async)
        emailService.sendWelcomeEmail(user.getEmail(), user.getName());

        // Create welcome in-app notification
        notificationService.createNotification(
                user,
                "Welcome to Book Bridges! 🎉",
                "Your account has been created successfully. Start by browsing books or listing your own!",
                "SYSTEM",
                "/dashboard"
        );

        return buildResponse(user, token);
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> AppException.unauthorized("Invalid email or password"));

        if (!passwordEncoder.matches(request.password(), user.getPassword())) {
            throw AppException.unauthorized("Invalid email or password");
        }

        if (user.getStatus() == User.UserStatus.SUSPENDED) {
            throw AppException.forbidden("Your account has been suspended");
        }

        String token = jwtUtils.generateToken(user.getEmail(), user.getRole().name());
        return buildResponse(user, token);
    }

    public UserDto getMe(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> AppException.notFound("User not found"));
        return UserDto.from(user);
    }

    public void logout(String token) {
        jwtUtils.blacklist(token);
    }

    private AuthResponse buildResponse(User user, String token) {
        return new AuthResponse(token, UserDto.from(user));
    }
}
