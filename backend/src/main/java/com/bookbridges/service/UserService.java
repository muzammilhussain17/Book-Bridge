package com.bookbridges.service;

import com.bookbridges.auth.UserDto;
import com.bookbridges.domain.User;
import com.bookbridges.exception.AppException;
import com.bookbridges.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserDto getProfile(String email) {
        return UserDto.from(findByEmail(email));
    }

    @Transactional
    public UserDto updateProfile(String email, UpdateProfileRequest req) {
        User user = findByEmail(email);
        if (req.name() != null)
            user.setName(req.name());
        if (req.bio() != null)
            user.setBio(req.bio());
        if (req.avatarUrl() != null)
            user.setAvatarUrl(req.avatarUrl());
        return UserDto.from(userRepository.save(user));
    }

    @Transactional
    public void changePassword(String email, ChangePasswordRequest req) {
        User user = findByEmail(email);
        if (!passwordEncoder.matches(req.currentPassword(), user.getPassword())) {
            throw AppException.badRequest("Current password is incorrect");
        }
        user.setPassword(passwordEncoder.encode(req.newPassword()));
        userRepository.save(user);
    }

    public UserDto getPublicProfile(Long userId) {
        return UserDto.from(findById(userId));
    }

    // --- Admin methods ---

    public Page<UserDto> adminListUsers(String role, String search, Pageable pageable) {
        User.Role roleEnum = null;
        if (role != null && !role.isBlank()) {
            try {
                roleEnum = User.Role.valueOf(role.toUpperCase());
            } catch (IllegalArgumentException ignored) {
            }
        }
        return userRepository.findByFilters(roleEnum, search, pageable).map(UserDto::from);
    }

    @Transactional
    public UserDto adminToggleSuspend(Long userId) {
        User user = findById(userId);
        user.setStatus(user.getStatus() == User.UserStatus.ACTIVE
                ? User.UserStatus.SUSPENDED
                : User.UserStatus.ACTIVE);
        return UserDto.from(userRepository.save(user));
    }

    @Transactional
    public UserDto adminIssueStrike(Long userId) {
        User user = findById(userId);
        int newStrikes = user.getStrikes() + 1;
        user.setStrikes(newStrikes);
        // Auto-suspend at 3 or more strikes
        if (newStrikes >= 3 && user.getStatus() == User.UserStatus.ACTIVE) {
            user.setStatus(User.UserStatus.SUSPENDED);
        }
        return UserDto.from(userRepository.save(user));
    }

    public UserDto adminGetUserDetail(Long userId) {
        return UserDto.from(findById(userId));
    }

    private User findByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> AppException.notFound("User not found"));
    }

    private User findById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> AppException.notFound("User not found with id: " + id));
    }

    public record UpdateProfileRequest(String name, String bio, String avatarUrl) {
    }

    public record ChangePasswordRequest(String currentPassword, String newPassword) {
    }
}
