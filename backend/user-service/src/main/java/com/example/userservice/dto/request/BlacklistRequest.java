package com.example.userservice.dto.request;

public record BlacklistRequest(
        String token,
        long ttl
) {}
