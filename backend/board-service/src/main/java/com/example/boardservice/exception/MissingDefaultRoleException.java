package com.example.boardservice.exception;

public class MissingDefaultRoleException extends RuntimeException {
    public MissingDefaultRoleException(String message) {
        super(message);
    }
}
