package com.example.boardservice.repository;

import com.example.boardservice.dto.models.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface ProjectRepository extends JpaRepository<Project, Long> {
    Optional<Project> findByInviteToken(String token);
    @Query("SELECT p.deletedAt IS NOT NULL FROM Project p WHERE p.id = :projectId")
    boolean isDeleted(@Param("projectId") Long projectId);
}
