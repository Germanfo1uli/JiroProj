package com.example.boardservice.exception;

public class ProjectDeletedException extends RuntimeException {
    public ProjectDeletedException(String message) {
        super(message);
    }
}
