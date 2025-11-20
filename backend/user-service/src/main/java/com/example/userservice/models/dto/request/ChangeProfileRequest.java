package com.example.userservice.models.dto.request;

import jakarta.validation.constraints.NotBlank;

public record ChangeProfileRequest (
    @NotBlank(message = "Name is required")
    String name,

    String bio
) {}
