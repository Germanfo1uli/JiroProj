package com.example.userservice.dto.data;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.List;

public record IdListRequest(
        @NotNull
        @Size(min = 1, max = 100)
        List<@Min(1) Long> userIds
) {}
