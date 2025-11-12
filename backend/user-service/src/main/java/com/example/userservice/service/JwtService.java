package com.example.userservice.service;

import com.example.userservice.config.JwtConfig;
import com.example.userservice.models.RefreshToken;
import com.example.userservice.models.User;
import com.example.userservice.repository.TokenRepository;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;

@Service
@RequiredArgsConstructor
public class JwtService {
    private final JwtConfig jwtConfig;
    private final TokenRepository tokenRepository;

    public String generateAccessToken(User user) {
        if (user == null || user.getId() == null) {
            throw new IllegalArgumentException("User or user ID cannot be null");
        }

        return Jwts.builder()
                .setSubject(user.getId().toString())
                .claim("email", user.getEmail())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + jwtConfig.getAccessTokenExpiration()))
                .signWith(jwtConfig.getSecretKey())
                .compact();
    }

    public String generateRefreshToken(User user, String deviceInfo) {
        UUID jti = UUID.randomUUID();
        LocalDateTime expiresAt = LocalDateTime.now()
                .plusSeconds(jwtConfig.getRefreshTokenExpiration() / 1000);

        return Jwts.builder()
                .setSubject(user.getId().toString())
                .setId(jti.toString())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + jwtConfig.getRefreshTokenExpiration()))
                .signWith(jwtConfig.getSecretKey())
                .compact();
    }

    public Claims parseToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(jwtConfig.getSecretKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    public boolean isTokenExpired(String token) {
        try {
            return parseToken(token).getExpiration().before(new Date());
        } catch (ExpiredJwtException e) {
            return true;
        }
    }
}
