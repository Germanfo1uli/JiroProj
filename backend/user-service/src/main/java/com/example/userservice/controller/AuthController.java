package com.example.userservice.controller;

import com.example.userservice.models.dto.request.*;
import com.example.userservice.models.dto.response.LoginResponse;
import com.example.userservice.models.dto.response.TokenPair;
import com.example.userservice.security.JwtUser;
import com.example.userservice.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("api/auth")
@RequiredArgsConstructor
@Validated
public class AuthController {

    public final AuthService authService;

    @Operation(summary = "User registration")
    @PostMapping("/register")
    public ResponseEntity<LoginResponse> register(
            @Valid @RequestBody RegisterRequest request) {

        LoginResponse response = authService.register(
                request.name(), request.email(), request.password(), request.deviceInfo());
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "User authentication")
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(
            @Valid @RequestBody LoginRequest request) {

        LoginResponse response = authService.login(
                request.email(), request.password(), request.deviceInfo());
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Get new tokens")
    @PostMapping("/refresh")
    public ResponseEntity<TokenPair> refresh(
            @Valid @RequestBody RefreshRequest request) {

        TokenPair response = authService.refresh(
                request.refreshToken(), request.deviceInfo());
        return ResponseEntity.ok(response);
    }

    @Operation(
            summary = "Password change",
            security = @SecurityRequirement(name = "bearerAuth")
    )
    @PatchMapping("/change-password")
    public ResponseEntity<TokenPair> changePassword(
            @Valid @RequestBody ChangePasswordRequest request,
            @AuthenticationPrincipal JwtUser principal) {

        TokenPair response = authService.changePassword(
                principal.userId(), request.oldPassword(),
                request.newPassword(), request.refreshToken(),
                request.deviceInfo());
        return ResponseEntity.ok(response);
    }

    @Operation(
            summary = "Email change",
            security = @SecurityRequirement(name = "bearerAuth")
    )
    @PatchMapping("/change-email")
    public ResponseEntity<TokenPair> changeEmail(
            @Valid @RequestBody ChangeEmailRequest request,
            @AuthenticationPrincipal JwtUser principal) {

        TokenPair response = authService.changeEmail(
                principal.userId(), request.newEmail(),
                request.password(), request.refreshToken(),
                request.deviceInfo());
        return ResponseEntity.ok(response);
    }

    @Operation(
            summary = "User logout",
            security = @SecurityRequirement(name = "bearerAuth")
    )
    @PostMapping("/logout")
    public ResponseEntity<?> logout(
            @Valid @RequestBody LogoutRequest request) {

        authService.logout(request.refreshToken());
        return ResponseEntity.ok(Map.of("message", "Logout was successfully"));
    }
}
