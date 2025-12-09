package com.example.boardservice.controller;

import com.example.boardservice.dto.response.InternalProjectResponse;
import com.example.boardservice.security.SystemPrincipal;
import com.example.boardservice.service.ProjectService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirements;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/internal")
@RequiredArgsConstructor
@Slf4j
@PreAuthorize("hasRole('SYSTEM')")
@SecurityRequirements
@Tag(name = "Internal Management", description = "Внутренние запросы для других микросервисов")
public class InternalController {

    private final ProjectService projectService;

    @Operation(summary = "Получение информации о проекте по projectId")
    @GetMapping("/projects/{projectId}")
    public ResponseEntity<InternalProjectResponse> getProjectById(
            @AuthenticationPrincipal SystemPrincipal principal,
            @PathVariable Long projectId) {

        if (principal == null) {
            throw new AccessDeniedException("Missing service authentication");
        }

        log.info("Service {} requested info for project {}", principal.getUsername(), projectId);
        InternalProjectResponse response = projectService.getProjectInternal(projectId);
        return ResponseEntity.ok(response);
    }
}
