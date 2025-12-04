package com.example.gateway.config;

import io.jsonwebtoken.security.Keys;
import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;

@Data
@Configuration
@ConfigurationProperties(prefix = "jwt")
public class GatewayConfig {
    private String secret;
    private long accessTokenExpiration;
    private long refreshTokenExpiration;

    @Bean
    public SecretKey jwtSecretKey() {
        // Используем ваш plain text secret (не Base64!)
        return Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }
}