package com.example.boardservice.exception;

public class InvalidPermissionException extends RuntimeException {
    public InvalidPermissionException(String message) {
        super(message);
    }
}
