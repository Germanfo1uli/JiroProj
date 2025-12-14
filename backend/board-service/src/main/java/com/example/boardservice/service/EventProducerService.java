package com.example.boardservice.service;

import com.example.boardservice.dto.rabbit.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

@Service
public class EventProducerService {
    private final RabbitTemplate rabbitTemplate;
    private final ObjectMapper objectMapper;

    public EventProducerService(RabbitTemplate rabbitTemplate, ObjectMapper objectMapper) {
        this.rabbitTemplate = rabbitTemplate;
        this.objectMapper = objectMapper;
    }

    public void sendProjectCreatedEvent(ProjectCreatedEvent event) {
        try {
            String json = objectMapper.writeValueAsString(event);
            rabbitTemplate.convertAndSend("activity.exchange", "project.created", json);
        } catch (Exception e) {
        }
    }

    public void sendProjectUpdatedEvent(ProjectUpdatedEvent event) {
        try {
            String json = objectMapper.writeValueAsString(event);
            rabbitTemplate.convertAndSend("activity.exchange", "project.updated", json);
        } catch (Exception e) {
        }
    }

    public void sendProjectDeletedEvent(ProjectDeletedEvent event) {
        try {
            String json = objectMapper.writeValueAsString(event);
            rabbitTemplate.convertAndSend("activity.exchange", "project.deleted", json);
        } catch (Exception e) {
        }
    }

    public void sendProjectMemberAddedEvent(ProjectMemberAddedEvent event) {
        try {
            String json = objectMapper.writeValueAsString(event);
            rabbitTemplate.convertAndSend("activity.exchange", "project.member.added", json);
        } catch (Exception e) {
        }
    }

    public void sendProjectMemberRemovedEvent(ProjectMemberRemovedEvent event) {
        try {
            String json = objectMapper.writeValueAsString(event);
            rabbitTemplate.convertAndSend("activity.exchange", "project.member.removed", json);
        } catch (Exception e) {
        }
    }
}