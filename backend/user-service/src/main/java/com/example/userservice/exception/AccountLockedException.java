package com.example.userservice.exception;

public class AccountLockedException extends RuntimeException {
    public AccountLockedException() {
        super("Account is locked");
    }
}
