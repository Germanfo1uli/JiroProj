package com.example.userservice.dto.response;

import com.example.userservice.dto.models.User;
import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDateTime;

public record PublicProfileResponse(
        @Schema(description = "ID пользователя", example = "123")
        Long id,

        @Schema(description = "Имя пользователя", example = "Ziragon")
        String username,

        @Schema(description = "Тег пользователя", example = "1234")
        String tag,

        @Schema(description = "О себе", example = "Я лучший программист...")
        String bio,

        @Schema(description = "Дата создания аккаунта", example = "2025-01-01T10:30:00")
        LocalDateTime createdAt
) {
        public static PublicProfileResponse fromUser(User user) {
                if (user == null) {
                        throw new IllegalArgumentException("User cannot be null");
                }
                return new PublicProfileResponse(
                        user.getId(),
                        user.getUsername(),
                        user.getTag(),
                        user.getBio(),
                        user.getCreatedAt()
                );
        }
}
