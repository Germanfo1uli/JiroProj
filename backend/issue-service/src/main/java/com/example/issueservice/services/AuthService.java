package com.example.issueservice.services;

import com.example.issueservice.config.PermissionCacheReader;
import com.example.issueservice.dto.models.enums.ActionType;
import com.example.issueservice.dto.models.enums.EntityType;
import com.example.issueservice.dto.response.UserPermissionsResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {
    private final PermissionCacheReader cacheReader;

    public boolean hasPermission(Long userId, Long projectId, EntityType entity, ActionType action) {
        UserPermissionsResponse perms = cacheReader.getUserPermissions(userId, projectId);
        return perms.permissions().contains(entity.name() + ":" + action.name());
    }

    public UserPermissionsResponse getUserPermissions(Long userId, Long projectId) {
        return cacheReader.getUserPermissions(userId, projectId);
    }
}