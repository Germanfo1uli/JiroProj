package com.example.userservice.service;

import com.example.userservice.dto.models.RefreshToken;
import com.example.userservice.repository.TokenRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TokenRevocationService {
    private final TokenRepository tokenRepository;

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void revokeAllByUser(Long userId) {
        List<RefreshToken> active = tokenRepository.findAllByUser_IdAndRevokedFalse(userId);
        active.forEach(t -> t.setRevoked(true));
        tokenRepository.saveAll(active);
    }
}
