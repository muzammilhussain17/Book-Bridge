package com.bookbridges.auth;

import com.bookbridges.domain.User;

public record UserDto(
        Long id,
        String name,
        String email,
        String role,
        String status,
        Integer strikes,
        String bio,
        String avatarUrl) {
    public static UserDto from(User u) {
        return new UserDto(
                u.getId(), u.getName(), u.getEmail(),
                u.getRole().name(), u.getStatus().name(),
                u.getStrikes(), u.getBio(), u.getAvatarUrl());
    }
}
