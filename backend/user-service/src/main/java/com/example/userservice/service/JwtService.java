package com.example.userservice.service;

import com.example.userservice.config.JwtConfig;
import com.example.userservice.exception.InvalidRefreshTokenException;
import com.example.userservice.models.entity.RefreshToken;
import com.example.userservice.models.entity.User;
import com.example.userservice.repository.TokenRepository;
import io.jsonwebtoken.*;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Async;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;

@Service
@RequiredArgsConstructor
public class JwtService {
    private final JwtConfig jwtConfig;
    private final TokenRepository tokenRepository;
    private final BCryptPasswordEncoder passwordEncoder;

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

    @Async
    public CompletableFuture<RefreshToken> saveRefreshTokenAsync(
            User user, String rawToken, String deviceInfo) {

        return CompletableFuture.supplyAsync(() -> {
            UUID jti = UUID.fromString(parseToken(rawToken).getId());
            LocalDateTime expiresAt = parseToken(rawToken).getExpiration()
                    .toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime();

            String tokenHash = passwordEncoder.encode(rawToken);

            RefreshToken token = new RefreshToken();
            token.setUser(user);
            token.setTokenHash(tokenHash);
            token.setJti(jti);
            token.setExpiresAt(expiresAt);
            token.setRevoked(false);
            token.setDeviceInfo(deviceInfo);

            return tokenRepository.save(token);
        });
    }

    @Async
    public CompletableFuture<User> validateAndRevokeRefreshTokenAsync(String refreshToken) {
        return CompletableFuture.supplyAsync(() -> {
            try {
                Claims claims = parseToken(refreshToken);
                UUID jti = UUID.fromString(claims.getId());
                Long userId = Long.valueOf(claims.getSubject());

                RefreshToken stored = tokenRepository.findByJti(jti)
                        .orElseThrow(() -> new InvalidRefreshTokenException("Токен не найден в БД"));

                if (stored.getRevoked()) {
                    throw new InvalidRefreshTokenException("Токен отозван");
                }
                if (stored.getExpiresAt().isBefore(LocalDateTime.now())) {
                    throw new InvalidRefreshTokenException("Токен истёк");
                }
                if (!passwordEncoder.matches(refreshToken, stored.getTokenHash())) {
                    throw new InvalidRefreshTokenException("Хеш не совпадает");
                }

                stored.setRevoked(true);
                tokenRepository.save(stored);

                return stored.getUser();

            } catch (ExpiredJwtException e) {
                throw new InvalidRefreshTokenException("Токен истёк");
            } catch (JwtException e) {
                throw new InvalidRefreshTokenException("Невалидный токен");
            }
        });
    }
}
