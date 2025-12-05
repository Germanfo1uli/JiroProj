package com.example.boardservice.security;

import com.example.boardservice.config.SecurityWhiteList;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

@Component
@Slf4j
public class GatewayAuthFilter extends OncePerRequestFilter {
    // фильтр нужен, чтобы проверить, откуда идет запрос и является ли эндпоинт публичным путем
    // запрос всегда (только если не публичный эндпоинт) должен идти от гейтвея и ниоткуда более
    // проверка осуществляется передачей header'а с secret key в запросе

    // также фильтр парсит остальные хедеры и маппит их в principal (userId, role, email)
    // эти данные затем используются контроллерами

    @Value("${gateway.secret.header.name}")
    private String gatewaySecretHeader;

    @Value("${gateway.secret.value:default-secret}")
    private String expectedSecret;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain chain) throws IOException, ServletException {

        String path = request.getServletPath();
        String gatewaySource = request.getHeader(gatewaySecretHeader);
        String userId = request.getHeader("X-User-Id");
        String role = request.getHeader("X-User-Role");
        String email = request.getHeader("X-User-Email");

        log.info("Received headers: {}, {}, {}, {}", gatewaySource, userId, role, email);

        // скип публичных эндпоинтов
        if (isPublicEndpoint(path)) {
            log.debug("Public endpoint accessed: {}", path);
            chain.doFilter(request, response);
            return;
        }

        // проверка, откуда идет запрос
        if (expectedSecret.equals(gatewaySource) && userId != null && role != null) {
            try {
                JwtUser principal = new JwtUser(Long.parseLong(userId), role, email);

                UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(
                        principal,
                        null,
                        principal.getAuthorities()
                );

                // если все проверки прошли, аутентификация проходит
                SecurityContextHolder.getContext().setAuthentication(auth);
                log.debug("Authenticated via gateway: userId={}, role={}", userId, role);

            } catch (NumberFormatException e) {
                log.error("Invalid userId format: {}", userId);
                sendUnauthorized(response, "Invalid user ID format");
                return;
            }
        } else if (!isPublicEndpoint(request.getServletPath())) {
            log.warn("Unauthorized direct access attempt: {}, headers: {}", request.getServletPath(), gatewaySource);
            sendUnauthorized(response, "Invalid user ID format");
            return;
        }

        chain.doFilter(request, response);
    }

    // метод для быстрой отправки ответа 401
    private void sendUnauthorized(HttpServletResponse response, String message) throws IOException {
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType("application/json");
        response.getWriter().write(
                String.format("{\"timestamp\":%d,\"status\":401,\"error\":\"%s\"}",
                        System.currentTimeMillis(), message)
        );
    }

    // проверка на публичные эндпоинты
    private boolean isPublicEndpoint(String path) {
        return SecurityWhiteList.PUBLIC_ENDPOINTS.stream()
                .anyMatch(pattern -> {
                    if (pattern.endsWith("/**")) {
                        return path.startsWith(pattern.replace("/**", ""));
                    }
                    return path.equals(pattern) || path.matches(pattern.replace("*", ".*"));
                });
    }
}