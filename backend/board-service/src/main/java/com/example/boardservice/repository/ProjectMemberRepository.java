package com.example.boardservice.repository;

import com.example.boardservice.dto.models.ProjectMember;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ProjectMemberRepository extends JpaRepository<ProjectMember, Long> {
    boolean existsByProject_IdAndUserId(Long projectId, Long userId);
    List<ProjectMember> findAllByRoleId(Long roleId);
    List<ProjectMember> findAllByRole_IdAndProject_Id(Long roleId, Long projectId);
    Optional<ProjectMember> findByUserIdAndProject_Id(Long userId, Long projectId);
}
