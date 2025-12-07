package com.example.boardservice.dto.data;

import com.example.boardservice.dto.models.enums.ActionType;
import com.example.boardservice.dto.models.enums.EntityType;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.Embeddable;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;

@Schema(description = "Право доступа (тип сущность + действие)")
@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PermissionEntry implements Serializable {
    @Schema(
            description = "Тип сущности",
            example = "ISSUE",
            requiredMode = Schema.RequiredMode.REQUIRED
    )
    @Enumerated(EnumType.STRING)
    private EntityType entity;

    @Schema(
            description = "Тип действия",
            example = "VIEW",
            requiredMode = Schema.RequiredMode.REQUIRED
    )
    @Enumerated(EnumType.STRING)
    private ActionType action;
}