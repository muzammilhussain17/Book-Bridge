package com.bookbridges.auth;

public record AuthResponse(String token, UserDto user) {
}
