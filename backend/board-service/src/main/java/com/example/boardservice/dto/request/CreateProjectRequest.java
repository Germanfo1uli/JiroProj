package com.example.boardservice.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;

@Schema(description = "Запрос на создание проекта")
public record CreateProjectRequest(
        @Schema(description = "Название проекта", example = "TaskFlow")
        @NotBlank(message = "Name is required")
        String name,

        @Schema(description = "Описание проекта", example = "TaskFlow - лучший проект в мире")
        @NotBlank(message = "Description is required")
        String description
) {}
