package com.example.gateway.security;

import com.example.gateway.service.TokenService;
import com.example.gateway.service.TokenService.JwtClaims;
import com.example.gateway.service.TokenBlacklistService;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.time.Instant;
import java.util.List;

@Component
@Slf4j
public class JwtAuthenticationFilter extends AbstractGatewayFilterFactory<JwtAuthenticationFilter.Config> {

    private final TokenService tokenService;
    private final TokenBlacklistService blacklistService;
    private static final String BEARER_PREFIX = "Bearer ";

    public JwtAuthenticationFilter(TokenService tokenService, TokenBlacklistService blacklistService) {
        super(Config.class);
        this.tokenService = tokenService;
        this.blacklistService = blacklistService;
    }

    @Override
    public GatewayFilter apply(Config config) {
        return (exchange, chain) -> {
            String path = exchange.getRequest().getURI().getPath();

            // Пропускаем публичные пути
            if (config.getSkipPaths().stream().anyMatch(skipPath ->
                    path.equals(skipPath) || path.matches(skipPath.replace("*", ".*"))
            )) {
                log.debug("Skipping JWT check for public path: {}", path);
                return chain.filter(exchange);
            }

            String authHeader = exchange.getRequest().getHeaders().getFirst(HttpHeaders.AUTHORIZATION);

            if (authHeader == null || !authHeader.startsWith(BEARER_PREFIX)) {
                log.warn("Missing Authorization header for path: {}", path);
                return reject(exchange, HttpStatus.UNAUTHORIZED, "Missing token");
            }

            String token = authHeader.substring(BEARER_PREFIX.length());

            // Проверяем черный список
            return blacklistService.isBlacklisted(token)
                    .flatMap(isBlacklisted -> {
                        if (isBlacklisted) {
                            return reject(exchange, HttpStatus.UNAUTHORIZED, "Token revoked");
                        }

                        try {
                            JwtClaims claims = tokenService.parseToken(token);

                            // Проверяем expiration (опционально, JWT сам проверяет)
                            if (tokenService.isTokenExpired(token)) {
                                return reject(exchange, HttpStatus.UNAUTHORIZED, "Token expired");
                            }

                            // Добавляем заголовки
                            ServerWebExchange mutatedExchange = exchange.mutate()
                                    .request(r -> r.headers(headers -> {
                                        headers.add("X-User-Id", claims.userId().toString());
                                        headers.add("X-User-Role", claims.role());
                                        headers.add("X-User-Email", claims.email());
                                    }))
                                    .build();

                            log.debug("Authenticated user: {} for path: {}", claims.userId(), path);
                            return chain.filter(mutatedExchange);

                        } catch (Exception e) {
                            log.error("Token validation failed: {}", e.getMessage());
                            return reject(exchange, HttpStatus.UNAUTHORIZED, "Invalid token");
                        }
                    });
        };
    }

    private Mono<Void> reject(ServerWebExchange exchange, HttpStatus status, String message) {
        exchange.getResponse().setStatusCode(status);
        exchange.getResponse().getHeaders().add(HttpHeaders.CONTENT_TYPE, "application/json");

        String body = String.format(
                "{\"timestamp\":\"%s\",\"status\":%d,\"error\":\"%s\",\"message\":\"%s\"}",
                Instant.now().toString(),
                status.value(),
                status.getReasonPhrase(),
                message
        );

        return exchange.getResponse().writeWith(
                Mono.just(exchange.getResponse().bufferFactory().wrap(body.getBytes()))
        );
    }

    @Data
    public static class Config {
        private List<String> skipPaths = List.of();
    }
}