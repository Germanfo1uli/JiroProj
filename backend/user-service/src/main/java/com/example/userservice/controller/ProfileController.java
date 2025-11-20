package com.example.userservice.controller;

import com.example.userservice.models.dto.request.ChangeProfileRequest;
import com.example.userservice.models.dto.response.ChangeProfileResponse;
import com.example.userservice.service.ProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;

@RestController
@RequestMapping("api/user-profile")
@RequiredArgsConstructor
@Validated
public class ProfileController {

    public final ProfileService profileService;

    @Operation(summary = "Обновление профиля пользователя")
    @PatchMapping("/update")
    public ResponseEntity<ChangeProfileResponse> updateUserProfile(
            @Valid @RequestBody ChangeProfileRequest request,
            @AuthenticationPrincipal Long userId) {

        ChangeProfileResponse response = profileService.updateProfileById(
                userId, request.name(), request.bio()).join();
        return ResponseEntity.ok(response);
    }
}
