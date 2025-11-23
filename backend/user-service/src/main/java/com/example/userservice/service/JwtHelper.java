package com.example.userservice.service;

import com.example.userservice.config.JwtConfig;
import com.example.userservice.models.entity.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.Objects;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class JwtHelper {
    private final JwtConfig cfg;

    public String generateAccess(User user) {
        Objects.requireNonNull(user, "user must not be null");

        return Jwts.builder()
                .setSubject(user.getId().toString())
                .claim("email", user.getEmail())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + cfg.getAccessTokenExpiration()))
                .signWith(cfg.getSecretKey())
                .compact();
    }

    public String generateRefresh(User user, UUID jti,
                                  Date expiration, String deviceInfo) {
        Objects.requireNonNull(user, "user must not be null");

        return Jwts.builder()
                .setSubject(user.getId().toString())
                .setId(jti.toString())
                .claim("device", deviceInfo)
                .setIssuedAt(new Date())
                .setExpiration(expiration)
                .signWith(cfg.getSecretKey())
                .compact();
    }

    public Claims parseToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(cfg.getSecretKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}