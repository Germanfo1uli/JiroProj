package com.example.userservice.exception;

public class AccountDeletedException extends RuntimeException {
    public AccountDeletedException() {
        super("Account is deleted");
    }
}
