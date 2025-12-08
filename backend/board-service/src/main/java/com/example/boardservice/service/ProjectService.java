package com.example.boardservice.service;

import com.example.boardservice.dto.models.Project;
import com.example.boardservice.dto.models.ProjectMember;
import com.example.boardservice.dto.models.ProjectRole;
import com.example.boardservice.dto.models.enums.ActionType;
import com.example.boardservice.dto.models.enums.EntityType;
import com.example.boardservice.dto.response.CreateProjectResponse;
import com.example.boardservice.dto.response.GetProjectResponse;
import com.example.boardservice.dto.response.ProjectListItem;
import com.example.boardservice.exception.AccessDeniedException;
import com.example.boardservice.exception.ProjectNotFoundException;
import com.example.boardservice.exception.UserNotFoundException;
import com.example.boardservice.repository.ProjectMemberRepository;
import com.example.boardservice.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProjectService {
    private final ProjectRepository projectRepository;
    private final ProjectInviteService inviteService;
    private final ProjectMemberService memberService;
    private final ProjectMemberRepository memberRepository;
    private final ProjectRoleService roleService;
    private final AuthService authService;

    @Transactional
    public CreateProjectResponse createProject(Long ownerId, String name, String description) {
        Project project = Project.builder()
                .name(name)
                .ownerId(ownerId)
                .description(description)
                .inviteToken(inviteService.generateSecureToken())
                .build();
        project = projectRepository.save(project);

        ProjectRole ownerRole = roleService.createDefaultRoles(project.getId());

        memberService.addOwner(ownerId, project, ownerRole);

        return new CreateProjectResponse(project.getId(), project.getName());
    }

    public List<ProjectListItem> getUserProjects(Long userId) {
        List<ProjectMember> memberships = memberRepository.findAllByUserId(userId);

        return memberships.stream()
                .map(m -> new ProjectListItem(
                        m.getProject().getId(),
                        m.getProject().getName(),
                        m.getProject().getDescription(),
                        m.getRole().getName(),
                        memberRepository.countByProjectId(m.getProject().getId())
                ))
                .collect(Collectors.toList());
    }

    public GetProjectResponse getProjectDetail(Long userId, Long projectId) {

        authService.checkPermission(userId, projectId, EntityType.PROJECT, ActionType.VIEW);

        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ProjectNotFoundException(projectId));

        ProjectMember user = memberRepository.findByUserIdAndProject_Id(userId, projectId)
                .orElseThrow(() -> new AccessDeniedException("User with ID: " + userId + " not found in project ID: " + projectId));

        return new GetProjectResponse(
                projectId,
                project.getOwnerId(),
                project.getName(),
                project.getDescription(),
                project.getCreatedAt(),
                user.getRole().getName()
        );
    }
}
