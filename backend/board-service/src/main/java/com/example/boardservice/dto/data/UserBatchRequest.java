package com.example.boardservice.dto.data;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.List;

public record UserBatchRequest(
        @NotNull @Size(min = 1, max = 100)
        List<@NotNull Long> userIds
) {}