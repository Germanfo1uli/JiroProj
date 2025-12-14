package com.example.boardservice.service;

import com.example.boardservice.dto.rabbit.ProjectUpdatedEvent;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

@Service
@RequiredArgsConstructor
public class ProjectEventPublisher {

    private final EventProducerService eventProducerService;

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void handleProjectUpdate(ProjectUpdatedEvent event) {
        eventProducerService.sendProjectUpdatedEvent(event);
    }
}