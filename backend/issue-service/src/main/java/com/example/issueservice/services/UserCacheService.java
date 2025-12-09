package com.example.issueservice.services;

import com.example.issueservice.client.UserServiceClient;
import com.example.issueservice.dto.data.UserBatchRequest;
import com.example.issueservice.dto.response.PublicProfileResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserCacheService {

    private final UserServiceClient userClient;
    @Cacheable(
            value = "userProfilesBatch",
            key = "T(java.util.TreeSet).new(#userIds).toString()",
            unless = "#result == null"
    )
    public Map<Long, PublicProfileResponse> getUserProfilesBatch(Set<Long> userIds) {
        if (userIds == null || userIds.isEmpty()) {
            return Collections.emptyMap();
        }

        log.info("Cache miss for user profiles: {}. Fetching from UserService...", userIds);

        try {
            UserBatchRequest request = new UserBatchRequest(new ArrayList<>(userIds));
            List<PublicProfileResponse> profiles = userClient.getProfilesByIds(request);

            return profiles.stream()
                    .collect(Collectors.toMap(PublicProfileResponse::id, p -> p));
        } catch (Exception e) {
            log.error("Failed to fetch profiles for users: {}", userIds, e);
            return null;
        }
    }

    @CacheEvict(value = "userProfilesBatch", allEntries = true)
    public void invalidateAllUserProfiles() {
        log.info("Invalidated all user profile caches");
    }
}