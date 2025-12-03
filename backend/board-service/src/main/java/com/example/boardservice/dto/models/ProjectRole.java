package com.example.boardservice.dto.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "project_roles", schema = "board_service_schema")
@Builder(toBuilder = true)
@NoArgsConstructor
@AllArgsConstructor
public class ProjectRole {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "role_permissions",
            joinColumns = @JoinColumn(name = "role_id"),
            inverseJoinColumns = @JoinColumn(name = "permission_id")
    )
    private Set<ProjectPermission> permissions = new HashSet<>();

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "is_default")
    private Boolean isDefault = false;

    @Column(name = "is_owner")
    private Boolean isOwner = false;
}
