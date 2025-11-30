package com.example.gateway.security;

import com.example.gateway.service.TokenBlacklistService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.time.Duration;

@Component
@Slf4j
@RequiredArgsConstructor
public class TokenRevocationFilter implements GlobalFilter, Ordered {

    private final TokenBlacklistService blacklistService;

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        String path = exchange.getRequest().getURI().getPath();
        String method = exchange.getRequest().getMethod().toString();

        // Определяем, нужно ли ревокировать токен
        boolean shouldRevoke = isRevocationEndpoint(path, method);

        if (!shouldRevoke) {
            return chain.filter(exchange);
        }

        // Сохраняем токен на будущее
        String token = extractToken(exchange);
        if (token != null) {
            exchange.getAttributes().put("token-to-revoke", token);
        }

        // Выполняем запрос
        return chain.filter(exchange)
                .then(Mono.fromRunnable(() -> {
                    // ПОСЛЕ успеха ревокируем
                    String tokenToRevoke = exchange.getAttribute("token-to-revoke");
                    if (tokenToRevoke != null) {
                        blacklistService.blacklist(tokenToRevoke, Duration.ofMinutes(15))
                                .doOnSuccess(v -> log.debug("Token revoked: {}", tokenToRevoke.hashCode()))
                                .doOnError(e -> log.error("Failed to revoke token", e))
                                .subscribe(); // Асинхронно
                    }
                }));
    }

    private boolean isRevocationEndpoint(String path, String method) {
        return ("/api/auth/logout".equals(path) && "POST".equals(method)) ||
                ("/api/auth/change-password".equals(path) && "PATCH".equals(method)) ||
                ("/api/auth/change-email".equals(path) && "PATCH".equals(method));
    }

    private String extractToken(ServerWebExchange exchange) {
        String authHeader = exchange.getRequest().getHeaders().getFirst(HttpHeaders.AUTHORIZATION);
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            return authHeader.substring(7);
        }
        return null;
    }

    @Override
    public int getOrder() {
        return Ordered.LOWEST_PRECEDENCE;
    }
}