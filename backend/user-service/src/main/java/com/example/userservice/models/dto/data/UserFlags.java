package com.example.userservice.models.dto.data;

import java.time.LocalDateTime;

public record UserFlags(LocalDateTime lockedAt, LocalDateTime deletedAt) {
    public boolean isLocked() { return lockedAt != null; }
    public boolean isDeleted() { return deletedAt != null; }
}
