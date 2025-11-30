package com.example.gateway.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.ReactiveRedisTemplate;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.time.Duration;

@Service
@RequiredArgsConstructor
public class TokenBlacklistService {
    private static final String BLACKLIST_PREFIX = "blacklist:token:";
    private final ReactiveRedisTemplate<String, String> redisTemplate;

    public Mono<Boolean> isBlacklisted(String token) {
        String key = BLACKLIST_PREFIX + token.hashCode();
        return redisTemplate.hasKey(key);
    }

    public Mono<Void> blacklist(String token, Duration ttl) {
        String key = BLACKLIST_PREFIX + token.hashCode();
        return redisTemplate.opsForValue().set(key, "revoked", ttl).then();
    }
}