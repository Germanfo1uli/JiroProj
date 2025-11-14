package com.example.userservice.models.dto.response;

public record TokenResponse(
        String accessToken,
        String refreshToken
) {}