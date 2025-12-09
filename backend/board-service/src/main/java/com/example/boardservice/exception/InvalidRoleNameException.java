package com.example.boardservice.exception;

public class InvalidRoleNameException extends RuntimeException {
    public InvalidRoleNameException(String message) {
        super(message);
    }
}
