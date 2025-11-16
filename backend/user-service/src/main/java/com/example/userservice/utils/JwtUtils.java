package com.example.userservice.utils;

import com.example.userservice.exception.InvalidJwtException;

public final class JwtUtils {
    private JwtUtils() {}

    public static String extractToken(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new InvalidJwtException("Неверный заголовок Authorization");
        }
        return authHeader.substring(7);
    }
}
