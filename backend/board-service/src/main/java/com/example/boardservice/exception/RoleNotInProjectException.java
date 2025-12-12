package com.example.boardservice.exception;

public class RoleNotInProjectException extends RuntimeException {
    public RoleNotInProjectException(String message) {
        super(message);
    }
}
