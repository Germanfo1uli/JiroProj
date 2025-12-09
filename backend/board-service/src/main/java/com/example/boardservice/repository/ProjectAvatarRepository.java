package com.example.boardservice.repository;

import com.example.boardservice.dto.models.ProjectAvatar;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ProjectAvatarRepository extends JpaRepository<ProjectAvatar, Long> {
    Optional<ProjectAvatar> findByProjectId(Long projectId);
}
