package com.example.userservice.models.dto.data;

import com.example.userservice.models.entity.User;

public record LoginData (
        User user,
        String accessToken,
        String refreshToken
) {}
