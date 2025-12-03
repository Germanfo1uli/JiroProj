package com.example.boardservice.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Ответ на создание проекта")
public record CreateProjectResponse(
        @Schema(description = "Название проекта", example = "TaskFlow")
        String name,

        @Schema(description = "Короткий тег проекта", example = "TF")
        String key
) {}
