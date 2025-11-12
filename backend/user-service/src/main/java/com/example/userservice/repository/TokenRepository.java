package com.example.userservice.repository;

import com.example.userservice.models.RefreshToken;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface TokenRepository extends JpaRepository<RefreshToken, Long> {
    RefreshToken findByJti(UUID jti);
}
