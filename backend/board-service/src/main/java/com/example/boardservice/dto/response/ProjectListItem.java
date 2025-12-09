package com.example.boardservice.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;

public record ProjectListItem(
        @Schema(description = "ID проекта")
        Long id,

        @Schema(description = "Название проекта")
        String name,

        @Schema(description = "Описание проекта")
        String description,

        @Schema(description = "Ваша роль в проекте")
        String yourRole,

        @Schema(description = "Количество участников")
        Long memberCount
) {}
