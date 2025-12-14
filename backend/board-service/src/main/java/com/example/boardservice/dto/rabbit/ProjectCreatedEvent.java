package com.example.boardservice.dto.rabbit;

import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Setter
@Getter
public class ProjectCreatedEvent {
    private long projectId;
    private String projectName = "";
    private long creatorId;
    private Instant createdAtUtc = Instant.now();
}