package com.example.boardservice.controller;

import com.example.boardservice.dto.response.ProjectMemberResponse;
import com.example.boardservice.security.JwtUser;
import com.example.boardservice.service.ProjectMemberService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("api/projects")
@RequiredArgsConstructor
@Validated
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Member Management", description = "Управление участниками проекта")
@Slf4j
public class MemberController {
    private final ProjectMemberService memberService;

    @Operation(summary = "Получение полной информации об участниках проекта")
    @GetMapping("/{projectId}/members")
    public ResponseEntity<List<ProjectMemberResponse>> getProjectMembers(
            @PathVariable Long projectId,
            @AuthenticationPrincipal JwtUser principal) {

        log.info("Fetching members for project {}", projectId);
        List<ProjectMemberResponse> response = memberService.getProjectMembersWithProfiles(principal.userId(), projectId);
        return ResponseEntity.ok(response);
    }
}
