package com.example.userservice.dto.response;

public record TokenPair (
        String accessToken,
        String refreshToken
) {}
