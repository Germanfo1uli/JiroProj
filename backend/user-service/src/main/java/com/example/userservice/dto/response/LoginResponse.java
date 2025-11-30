package com.example.userservice.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Ответ на авторизацию пользователя")
public record LoginResponse(
        @Schema(description = "ID пользователя", example = "123")
        Long userId,

        @Schema(description = "Имя пользователя", example = "Ziragon")
        String username,

        @Schema(description = "Тег пользователя", example = "1234")
        String tag,

        @Schema(description = "Email пользователя", example = "user@example.com")
        String email,

        @Schema(description = "Пара токенов")
        TokenPair pair
) {}
