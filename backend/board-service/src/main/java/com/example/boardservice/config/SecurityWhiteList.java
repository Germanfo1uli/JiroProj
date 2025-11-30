package com.example.boardservice.config;

import org.springframework.stereotype.Component;

import java.util.List;

@Component
public final class SecurityWhiteList {

    public static final List<String> PUBLIC_ENDPOINTS = List.of(
            "/api/auth/register",
            "/api/auth/login",
            "/api/auth/refresh",
            "/swagger-ui/**",
            "/swagger-ui.html",
            "/v3/api-docs/**",
            "/swagger-resources/**",
            "/webjars/**"
    );

    private SecurityWhiteList() {}
}