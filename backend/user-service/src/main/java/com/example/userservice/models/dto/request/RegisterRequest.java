package com.example.userservice.models.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

@Schema(description = "Запрос на регистрацию пользователя")
public record RegisterRequest (
        @NotBlank(message = "Username is required")
        String name,

        @Schema(description = "Email пользователя", example = "user@example.com")
        @Email(message = "Invalid email")
        @NotBlank(message = "Email is required")
        String email,

        @Schema(description = "Пароль", example = "Password", minLength = 8)
        @NotBlank(message = "Password is required")
        String password,

        @Schema(description = "Информация об устройстве (опционально)", example = "Chrome 120, Windows 11", hidden = true)
        String deviceInfo
) {}
