package com.example.userservice.models.dto.request;

import jakarta.validation.constraints.NotBlank;

public record RefreshRequest(
        @NotBlank(message = "Refresh token обязателен")
        String refreshToken,
        String deviceInfo
) {}