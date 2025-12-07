package com.example.boardservice.cache;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.Set;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class RedisCacheService {
    private final RedisTemplate<String, String> redisTemplate;

    public void cacheUserRole(Long userId, Long projectId, Long roleId) {
        String key = String.format(RedisConstants.USER_ROLE_KEY, userId, projectId);
        redisTemplate.opsForValue().set(key, roleId.toString(), RedisConstants.USER_ROLE_TTL);
    }

    public Long getUserRoleFromCache(Long userId, Long projectId) {
        String key = String.format(RedisConstants.USER_ROLE_KEY, userId, projectId);
        String value = redisTemplate.opsForValue().get(key);
        return (value != null && !value.equals("-1")) ? Long.parseLong(value) : null;
    }

    public void invalidateUserRole(Long userId, Long projectId) {
        String key = String.format(RedisConstants.USER_ROLE_KEY, userId, projectId);
        redisTemplate.delete(key);
    }

    public void cacheRolePermissions(Long roleId, Set<String> permissions) {
        String key = String.format(RedisConstants.ROLE_PERMS_KEY, roleId);
        redisTemplate.opsForSet().add(key, permissions.toArray(new String[0]));
        redisTemplate.expire(key, RedisConstants.ROLE_PERMS_TTL);
    }

    public Set<String> getRolePermissionsFromCache(Long roleId) {
        String key = String.format(RedisConstants.ROLE_PERMS_KEY, roleId);
        return redisTemplate.opsForSet().members(key);
    }

    public void invalidateRolePermissions(Long roleId) {
        String key = String.format(RedisConstants.ROLE_PERMS_KEY, roleId);
        redisTemplate.delete(key);
    }

    public void cacheUserProfile(Long userId, String jsonProfile) {
        String key = String.format(RedisConstants.USER_PROFILE_KEY, userId);
        redisTemplate.opsForValue().set(key, jsonProfile, RedisConstants.USER_PROFILE_TTL);
    }

    public String getUserProfileFromCache(Long userId) {
        String key = String.format(RedisConstants.USER_PROFILE_KEY, userId);
        return redisTemplate.opsForValue().get(key);
    }

    public void invalidateAllUsersInProject(Long projectId) {
        String pattern = String.format("user:*:project:%d", projectId);
        Set<String> keys = redisTemplate.keys(pattern);
        if (!keys.isEmpty()) {
            redisTemplate.delete(keys);
        }
    }
}