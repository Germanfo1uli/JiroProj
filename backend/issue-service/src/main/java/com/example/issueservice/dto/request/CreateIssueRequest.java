package com.example.issueservice.dto.request;

import com.example.issueservice.dto.models.enums.IssueType;
import com.example.issueservice.dto.models.enums.Priority;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;

import java.time.LocalDateTime;

public record CreateIssueRequest(
        @Schema(description = "ID родительской задачи", example = "123")
        Long parentId,

        @Schema(description = "Уровень задачи в иерархии", example = "1")
        @NotBlank(message = "Level is required")
        Integer level,

        @Schema(description = "Название задачи", example = "Сделать микросервисы")
        @NotBlank(message = "Title is required")
        String title,

        @Schema(description = "Описание задачи", example = "Сделать по отдельности каждый микросервис, связать их")
        @NotBlank(message = "Description is required")
        String description,

        @Schema(description = "Тип задачи", example = "EPIC")
        @NotBlank(message = "Type is required")
        IssueType type,

        @Schema(description = "Приоритет задачи", example = "MEDIUM")
        @NotBlank(message = "Priority is required")
        Priority priority,

        @Schema(description = "Дедлайн задачи", example = "времяяяя")
        LocalDateTime deadline
) {}
