package com.example.userservice.models.dto.response;

public record LoginResponse(
    String email,
    String accessToken,
    String refreshToken
) {}
