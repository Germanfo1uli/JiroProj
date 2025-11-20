package com.example.userservice.models.dto.response;

import java.time.LocalDateTime;

public record UserProfileResponse (
        Long id,
        String email,
        String name,
        String bio,
        LocalDateTime createdAt
) {}
