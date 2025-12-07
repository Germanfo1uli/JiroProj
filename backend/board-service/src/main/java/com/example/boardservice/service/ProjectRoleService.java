package com.example.boardservice.service;

import com.example.boardservice.cache.RedisCacheService;
import com.example.boardservice.config.PermissionMatrixProperties;
import com.example.boardservice.dto.data.PermissionEntry;
import com.example.boardservice.dto.models.ProjectMember;
import com.example.boardservice.dto.models.RolePermission;
import com.example.boardservice.dto.models.Project;
import com.example.boardservice.dto.models.ProjectRole;
import com.example.boardservice.dto.models.enums.ActionType;
import com.example.boardservice.dto.models.enums.EntityType;
import com.example.boardservice.dto.response.RoleResponse;
import com.example.boardservice.exception.RoleNotFoundException;
import com.example.boardservice.repository.ProjectMemberRepository;
import com.example.boardservice.repository.ProjectRoleRepository;
import com.example.boardservice.repository.RolePermissionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.TransactionSynchronization;
import org.springframework.transaction.support.TransactionSynchronizationManager;

import java.util.Arrays;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProjectRoleService {
    private final ProjectRoleRepository roleRepository;
    private final RolePermissionRepository permissionRepository;
    private final ProjectMemberRepository memberRepository;
    private final PermissionMatrixProperties matrixProps;
    private final RedisCacheService redisCacheService;

    @Transactional
    public ProjectRole createDefaultRoles(Long projectId) {
        ProjectRole owner = ProjectRole.builder()
                .project(Project.builder().id(projectId).build())
                .name("Owner")
                .isOwner(true)
                .isDefault(false)
                .build();

        ProjectRole user = ProjectRole.builder()
                .project(Project.builder().id(projectId).build())
                .name("User")
                .isOwner(false)
                .isDefault(true)
                .build();

        roleRepository.saveAll(List.of(owner, user));

        Set<RolePermission> ownerPerms = Arrays.stream(EntityType.values())
                .flatMap(entity -> matrixProps.getAllowedActions(entity).stream()
                        .map(action -> RolePermission.builder()
                                .role(owner)
                                .entity(entity)
                                .action(action)
                                .build()))
                .collect(Collectors.toSet());

        Set<RolePermission> userPerms = Arrays.stream(EntityType.values())
                .map(entity -> RolePermission.builder()
                        .role(user)
                        .entity(entity)
                        .action(ActionType.VIEW)
                        .build())
                .collect(Collectors.toSet());

        permissionRepository.saveAll(ownerPerms);
        permissionRepository.saveAll(userPerms);

        cacheRolePermissions(owner.getId(), ownerPerms);
        cacheRolePermissions(user.getId(), userPerms);

        log.info("Created default roles for project {}: Owner(ID:{}) and User(ID:{})",
                projectId, owner.getId(), user.getId());

        return owner;
    }

    @Transactional
    public RoleResponse createRole(Long userId, Long projectId, boolean isDefault, String roleName, Set<PermissionEntry> request) {
        if (roleName == null || roleName.isBlank()) {
            throw new IllegalArgumentException("Role name is required");
        }

        validatePermissions(request);

        ProjectRole role = ProjectRole.builder()
                .project(Project.builder().id(projectId).build())
                .name(roleName)
                .isDefault(isDefault)
                .isOwner(false)
                .build();

        role = roleRepository.save(role);

        Set<RolePermission> permissions = createPermissions(role, request);
        permissionRepository.saveAll(permissions);

        cacheRolePermissions(role.getId(), permissions);

        log.info("Created role '{}' (ID:{}) in project {}", roleName, role.getId(), projectId);

        return new RoleResponse(
                role.getId(),
                role.getName(),
                role.getIsDefault(),
                request
        );
    }

    @Transactional
    public RoleResponse updateRole(Long userId, Long roleId, Long projectId, boolean isDefault, String roleName, Set<PermissionEntry> request) {

        ProjectRole role = roleRepository.findById(roleId)
                .orElseThrow(() -> new RoleNotFoundException("Role with ID: " + roleId + " not found"));

        if (!Objects.equals(role.getProject().getId(), projectId)) {
            throw new RoleNotFoundException("Role with ID: " + roleId + " not found in project ID: " + projectId);
        }

        if (roleName != null && !roleName.isBlank()) {
            role.setName(roleName);
        }

        role.setIsDefault(isDefault);
        validatePermissions(request);

        redisCacheService.invalidateRolePermissions(roleId);

        permissionRepository.deleteByRoleId(roleId);

        Set<RolePermission> permissions = createPermissions(role, request);
        permissionRepository.saveAll(permissions);
        role.setPermissions(permissions);

        invalidateUsersByRole(roleId);

        cacheRolePermissions(role.getId(), permissions);

        log.info("Updated role '{}' (ID:{}) in project {}",
                role.getName(), roleId, projectId);

        return new RoleResponse(
                role.getId(),
                role.getName(),
                role.getIsDefault(),
                request
        );
    }

    @Transactional
    public void deleteRole(Long userId, Long roleId, Long projectId) {
        ProjectRole role = roleRepository.findById(roleId)
                .orElseThrow(() -> new RoleNotFoundException("Role with ID: " + roleId + " not found"));

        if (!Objects.equals(role.getProject().getId(), projectId)) {
            throw new RoleNotFoundException("Role with ID: " + roleId + " not found in project ID: " + projectId);
        }

        List<ProjectMember> membersWithRole = memberRepository.findAllByRole_IdAndProject_Id(roleId, projectId);
        ProjectRole defaultRole = roleRepository.findByProject_IdAndIsDefaultTrue(projectId)
                .orElseThrow(() -> new RoleNotFoundException("Default role not found in project " + projectId));

        log.info("Deleting role {} in project {}, reassigning {} members to default role {}",
                roleId, projectId, membersWithRole.size(), defaultRole.getId());

        if (!membersWithRole.isEmpty()) {
            membersWithRole.forEach(member -> member.setRole(defaultRole));
            memberRepository.saveAll(membersWithRole);
        }

        permissionRepository.deleteByRoleId(roleId);
        roleRepository.delete(role);

        TransactionSynchronizationManager.registerSynchronization(
                new TransactionSynchronization() {
                    @Override
                    public void afterCommit() {
                        redisCacheService.invalidateRolePermissions(roleId);

                        membersWithRole.forEach(member ->
                                redisCacheService.invalidateUserRole(member.getUserId(), projectId)
                        );

                        log.info("Transaction committed: invalidated caches for {} users and role {}",
                                membersWithRole.size(), roleId);
                    }
                }
        );
    }

    @Transactional(readOnly = true)
    public List<ProjectRole> getRolesByProjectId(Long projectId) {
        return roleRepository.findByProject_Id(projectId);
    }

    private void validatePermissions(Set<PermissionEntry> permissions) {
        for (PermissionEntry entry : permissions) {
            if (!matrixProps.isAllowed(entry.getEntity(), entry.getAction())) {
                throw new IllegalArgumentException(
                        "Invalid permission: " + entry.getEntity() + "+" + entry.getAction()
                );
            }
        }
    }

    private Set<RolePermission> createPermissions(ProjectRole role, Set<PermissionEntry> entries) {
        return entries.stream()
                .map(entry -> RolePermission.builder()
                        .role(role)
                        .entity(entry.getEntity())
                        .action(entry.getAction())
                        .build())
                .collect(Collectors.toSet());
    }

    private void invalidateUsersByRole(Long roleId) {
        List<ProjectMember> members = memberRepository.findAllByRoleId(roleId);

        TransactionSynchronizationManager.registerSynchronization(
                new TransactionSynchronization() {
                    @Override
                    public void afterCommit() {
                        members.forEach(member -> {
                            redisCacheService.invalidateUserRole(member.getUserId(), member.getProject().getId());
                        });
                        log.info("Invalidated user-role caches for {} members with role {}",
                                members.size(), roleId);
                    }
                }
        );
    }

    private void cacheRolePermissions(Long roleId, Set<RolePermission> permissions) {
        Set<String> permStrings = permissions.stream()
                .map(p -> p.getEntity().name() + ":" + p.getAction().name())
                .collect(Collectors.toSet());

        redisCacheService.cacheRolePermissions(roleId, permStrings);
    }
}