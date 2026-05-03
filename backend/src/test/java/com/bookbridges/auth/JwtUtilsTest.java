package com.bookbridges.auth;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import static org.junit.jupiter.api.Assertions.*;

class JwtUtilsTest {

    private JwtUtils jwtUtils;
    private final String secret = "YourSuperSecretSigningKeyThatIsAtLeast256BitsLongForHS256Algorithm";

    @BeforeEach
    void setUp() {
        jwtUtils = new JwtUtils();
        ReflectionTestUtils.setField(jwtUtils, "jwtSecret", secret);
        ReflectionTestUtils.setField(jwtUtils, "jwtExpirationMs", 3600000L); // 1 hour
    }

    @Test
    void generateToken_ProducesValidString() {
        String token = jwtUtils.generateToken("user@example.com", "USER");
        assertNotNull(token);
        assertFalse(token.isEmpty());
    }

    @Test
    void extractEmail_ReturnsCorrectEmail() {
        String token = jwtUtils.generateToken("test@example.com", "ADMIN");
        String email = jwtUtils.extractEmail(token);
        assertEquals("test@example.com", email);
    }

    @Test
    void isValid_CorrectToken_ReturnsTrue() {
        String token = jwtUtils.generateToken("user@example.com", "USER");
        assertTrue(jwtUtils.isValid(token));
    }

    @Test
    void isValid_MalformedToken_ReturnsFalse() {
        assertFalse(jwtUtils.isValid("not.a.valid.token"));
    }
}
