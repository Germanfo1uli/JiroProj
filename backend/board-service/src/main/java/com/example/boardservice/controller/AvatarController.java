package com.example.boardservice.controller;

import com.example.boardservice.dto.models.ProjectAvatar;
import com.example.boardservice.service.AvatarValidator;
import com.example.boardservice.service.ProjectAvatarService;
import com.example.boardservice.security.JwtUser;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.CacheControl;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Map;
import java.util.concurrent.TimeUnit;

@RestController
@RequestMapping("api/projects")
@RequiredArgsConstructor
@Validated
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Avatar Management", description = "Управление аватарами проектов")
public class AvatarController {
    public final ProjectAvatarService avatarService;
    public final AvatarValidator validator;

    @Operation(summary = "Загрузить аватар (< 10 МБ, JPG, PNG, WebP, Gif)")
    @PostMapping(value = "/{projectId}/avatar", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Map<String, String>> uploadAvatar(
            @PathVariable Long projectId,
            @AuthenticationPrincipal JwtUser principal,
            @RequestParam("file") MultipartFile file) {

        validator.validate(file);
        avatarService.uploadAvatar(principal.userId(), projectId, file);

        return ResponseEntity.ok(Map.of(
                "message", "Avatar is uploaded",
                "avatarUrl", "/api/projects/" + projectId + "/avatar"
        ));
    }

    @Operation(summary = "Получить аватар проекта")
    @GetMapping("/{projectId}/avatar")
    public ResponseEntity<byte[]> getUserAvatar(
            @PathVariable Long projectId,
            @AuthenticationPrincipal JwtUser principal) {

        return getAvatarResponse(principal.userId(), projectId);
    }

    private ResponseEntity<byte[]> getAvatarResponse(Long userId, Long projectId) {
        ProjectAvatar avatar = avatarService.findByProjectId(userId, projectId)
                .orElse(null);

        if (avatar == null) {
            return ResponseEntity.notFound().build();
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.parseMediaType(avatar.getMimeType()));
        headers.setContentLength(avatar.getFileSize());

        // кеширование аватарок
        headers.setCacheControl(CacheControl.maxAge(30, TimeUnit.DAYS).cachePublic());
        headers.setExpires(Instant.now().plus(30, ChronoUnit.DAYS));

        return ResponseEntity.ok()
                .headers(headers)
                .body(avatar.getData());
    }

    @Operation(summary = "Удалить свой аватар")
    @DeleteMapping("/{projectId}/avatar")
    public ResponseEntity<Void> deleteAvatar(
            @PathVariable Long projectId,
            @AuthenticationPrincipal JwtUser principal) {

        avatarService.deleteAvatar(principal.userId(), projectId);
        return ResponseEntity.noContent().build();
    }
}
