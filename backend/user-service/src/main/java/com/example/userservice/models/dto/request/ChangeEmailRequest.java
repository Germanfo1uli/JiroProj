package com.example.userservice.models.dto.request;

import jakarta.validation.constraints.NotBlank;

public record ChangeEmailRequest (
        @NotBlank(message = "Email is required")
        String newEmail,

        @NotBlank(message = "Password is required")
        String password,

        @NotBlank(message = "Token is required")
        String refreshToken,

        String deviceInfo
) {}
