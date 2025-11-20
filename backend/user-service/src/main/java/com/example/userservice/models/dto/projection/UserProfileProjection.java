package com.example.userservice.models.dto.projection;

import org.springframework.beans.factory.annotation.Value;

import java.time.LocalDateTime;

public interface UserProfileProjection {

    Long getId();

    String getEmail();

    LocalDateTime getCreatedAt();

    @Value("#{target.profile?.name}")
    String getName();

    @Value("#{target.profile?.bio}")
    String getBio();
}