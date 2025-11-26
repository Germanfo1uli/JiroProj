package com.example.userservice.models.dto.response;

public record TokenPair (
        String accessToken,
        String refreshToken
) {}
