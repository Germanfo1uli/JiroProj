package com.example.userservice.models.dto.response;

public record ChangeProfileResponse (
        Long id,
        String name,
        String bio
) {}
