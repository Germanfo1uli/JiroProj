package com.example.issueservice.services;

import com.example.issueservice.client.BoardServiceClient;
import com.example.issueservice.client.UserServiceClient;
import com.example.issueservice.dto.models.enums.*;
import com.example.issueservice.dto.response.CreateIssueResponse;
import com.example.issueservice.dto.response.IssueSummaryResponse;
import com.example.issueservice.exception.IssueNotFoundException;
import com.example.issueservice.dto.models.Issue;
import com.example.issueservice.repositories.IssueRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;


@Slf4j
@Service
@RequiredArgsConstructor
public class IssueService {

    private final IssueRepository issueRepository;
    private final IssueHierarchyValidator hierarchyValidator;
    private final AuthService authService;
    private final BoardServiceClient boardClient;
    private final UserServiceClient userClient;

    @Transactional
    public CreateIssueResponse createIssue(
            Long userId, Long projectId, Long parentId, String title, String description,
            IssueType type, Priority priority, LocalDateTime deadline) {

        authService.hasPermission(userId, projectId, EntityType.ISSUE, ActionType.CREATE);

        log.info("Creating new issue for project: {}", projectId);

        Issue parentIssue = null;
        if (parentId != null) {
            parentIssue = issueRepository.findById(parentId)
                    .orElseThrow(() -> new IllegalArgumentException(
                            "Parent issue with id " + parentId + " not found"));
            log.info("Found parent issue: {}", parentIssue.getTitle());
        }

        Issue newIssue = Issue.builder()
                .creatorId(userId)
                .title(title)
                .description(description)
                .type(type)
                .priority(priority)
                .deadline(deadline)
                .status(IssueStatus.TO_DO)
                .build();

        newIssue.setParentIssue(parentIssue);

        hierarchyValidator.validateHierarchy(newIssue, parentIssue);

        Issue savedIssue = issueRepository.save(newIssue);
        log.info("Successfully created issue with id: {}, level: {}",
                savedIssue.getId(), savedIssue.getLevel());

        return CreateIssueResponse.from(savedIssue);
    }

    public CreateIssueResponse getIssueById(
            Long userId, Long projectId, Long id) {

        authService.hasPermission(userId, projectId, EntityType.ISSUE, ActionType.CREATE);

        log.info("Fetching issue by id: {}", id);

        Issue issue = issueRepository.findById(id)
                .orElseThrow(() -> new IssueNotFoundException("Issue with id " + id + " not found"));

        log.info("Found issue: '{}'. Enriching with data from other services...", issue.getTitle());
        return enrichIssueWithDetails(issue);
    }

    public List<CreateIssueResponse> getIssuesByProject(Long projectId) {
        log.info("Fetching all issues for project: {}", projectId);
        List<Issue> issues = issueRepository.findByProjectId(projectId);
        return issues.stream()
                .map(this::enrichIssueWithDetails)
                .collect(Collectors.toList());
    }

    public List<IssueSummaryResponse> getIssueSummariesByProject(Long projectId) {
        log.info("Fetching all issue SUMMARIES for project: {}", projectId);
        List<Issue> issues = issueRepository.findByProjectId(projectId);

        return issues.stream()
                .map(this::convertToSummaryDto)
                .collect(Collectors.toList());
    }
    @Transactional
    public void addAssignee(Long issueId, Long userId) {
        log.info("Adding user {} as assignee to issue {}", userId, issueId);
        if (issueAssigneeRepository.existsByIssueIdAndUserId(issueId, userId)) {
            log.warn("User {} is already an assignee for issue {}", userId, issueId);
            return;
        }
        IssueAssignee newAssignee = IssueAssignee.builder()
                .issue(Issue.builder().id(issueId).build())
                .userId(userId)
                .build();
        issueAssigneeRepository.save(newAssignee);
        log.info("Successfully added assignee.");
    }

    @Transactional
    public void removeAssignee(Long issueId, Long userId) {
        log.info("Removing user {} from assignees of issue {}", userId, issueId);
        issueAssigneeRepository.deleteByIssueIdAndUserId(issueId, userId);
        log.info("Successfully removed assignee.");
    }

    private CreateIssueResponse enrichIssueWithDetails(Issue issue) {

        try {
            // TODO: здесь будут полноценные DTO, а не строки
            String projectName = restTemplate.getForObject(projectUrl, String.class);
            String creatorName = restTemplate.getForObject(userUrl, String.class);

            // TODO: Сделать один вызов в user-service с пачкой ID

            return CreateIssueResponse.builder()
                    .id(issue.getId())
                    .title(issue.getTitle())
                    .description(issue.getDescription())
                    .status(issue.getStatus())
                    .type(issue.getType())
                    .priority(issue.getPriority())
                    .deadline(issue.getDeadline())
                    .createdAt(issue.getCreatedAt())
                    .updatedAt(issue.getUpdatedAt())
                    .creatorName(creatorName)
                    .assigneeNames(List.of("User1", "User2"))
                    .build();

        } catch (Exception e) {
            log.error("Error while enriching issue {}. Returning partial data.", issue.getId(), e);
            return CreateIssueResponse.from(issue);
        }
    }

    private IssueSummaryResponse convertToSummaryDto(Issue issue) {
        return IssueSummaryResponse.builder()
                .id(issue.getId())
                .title(issue.getTitle())
                .status(issue.getStatus())
                .type(issue.getType())
                .priority(issue.getPriority())
                .deadline(issue.getDeadline())
                .createdAt(issue.getCreatedAt())
                // TODO: Когда будет RabbitMQ, здесь можно будет добавлять projectName, creatorName и т.д.
                .build();
    }
}


