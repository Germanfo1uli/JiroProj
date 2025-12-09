package com.example.issueservice.dto.models;

import com.example.issueservice.dto.models.enums.IssueStatus;
import com.example.issueservice.dto.models.enums.IssueType;
import com.example.issueservice.dto.models.enums.Priority;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "issues", schema = "issue_service_schema")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Issue {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "project_id", nullable = false)
    private Long projectId;

    @Column(name = "creator_id", nullable = false)
    private Long creatorId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_issue_id")
    private Issue parentIssue;

    @OneToMany(mappedBy = "parentIssue", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Issue> childIssues = new ArrayList<>();

    @Column(nullable = false)
    private Integer level;

    @OneToMany(mappedBy = "issue", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<IssueComment> comments = new ArrayList<>();

    @OneToMany(mappedBy = "issue", cascade = CascadeType.ALL, orphanRemoval = true
    )
    private List<Attachment> attachments = new ArrayList<>();

    @Column(name = "assignee_id")
    private Long assigneeId;

    @Column(name = "code_reviewer_id")
    private Long codeReviewerId;

    @Column(name = "qa_engineer_id")
    private Long qaEngineerId;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "issue_tags",
            joinColumns = @JoinColumn(name = "issue_id"),
            inverseJoinColumns = @JoinColumn(name = "tag_id")
    )
    private Set<ProjectTag> tags = new HashSet<>();

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    private IssueStatus status;

    @Enumerated(EnumType.STRING)
    private IssueType type;

    @Enumerated(EnumType.STRING)
    private Priority priority;

    private LocalDateTime deadline;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
