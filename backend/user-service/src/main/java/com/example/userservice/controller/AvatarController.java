package com.example.userservice.controller;

import com.example.userservice.dto.models.Avatar;
import com.example.userservice.security.JwtUser;
import com.example.userservice.service.AvatarService;
import com.example.userservice.service.AvatarValidator;
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
@RequestMapping("api/users")
@RequiredArgsConstructor
@Validated
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Avatar Management", description = "Управление аватарами пользователей")
public class AvatarController {
    public final AvatarService avatarService;
    public final AvatarValidator validator;

    @Operation(summary = "Загрузить аватар (< 10 МБ, JPG, PNG, WebP, Gif)")
    @PostMapping(value = "/me/avatar", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Map<String, String>> uploadAvatar(
            @AuthenticationPrincipal JwtUser principal,
            @RequestParam("file") MultipartFile file) {

        validator.validate(file);
        avatarService.uploadAvatar(principal.userId(), file);

        return ResponseEntity.ok(Map.of(
                "message", "Avatar is uploaded",
                "avatarUrl", "/api/users/me/avatar"
        ));
    }

    @Operation(summary = "Получить личный аватар")
    @GetMapping("/me/avatar")
    public ResponseEntity<byte[]> getMyAvatar(@AuthenticationPrincipal JwtUser principal) {
        return getAvatarResponse(principal.userId());
    }

    @Operation(summary = "Получить аватар другого пользователя")
    @GetMapping("/{userId}/avatar")
    public ResponseEntity<byte[]> getUserAvatar(@PathVariable Long userId) {
        return getAvatarResponse(userId);
    }

    private ResponseEntity<byte[]> getAvatarResponse(Long userId) {
        Avatar avatar = avatarService.findByUserId(userId)
                .orElse(null);

        if (avatar == null) {
            return ResponseEntity.notFound().build();
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.parseMediaType(avatar.getMimeType()));
        headers.setContentLength(avatar.getFileSize());

        // кэширование аватарок
        headers.setCacheControl(CacheControl.maxAge(30, TimeUnit.DAYS).cachePublic());
        headers.setExpires(Instant.now().plus(30, ChronoUnit.DAYS));

        return ResponseEntity.ok()
                .headers(headers)
                .body(avatar.getData());
    }

    @Operation(summary = "Удалить свой аватар")
    @DeleteMapping("/me/avatar")
    public ResponseEntity<Void> deleteAvatar(@AuthenticationPrincipal JwtUser principal) {
        avatarService.deleteAvatar(principal.userId());
        return ResponseEntity.noContent().build();
    }
}
