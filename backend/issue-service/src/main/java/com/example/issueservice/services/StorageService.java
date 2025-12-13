package com.example.issueservice.services;

import jakarta.annotation.Resource;

import java.io.InputStream;

public interface StorageService {
    void upload(String key, InputStream inputStream, String contentType, long size);
    Resource download(String key);
    void delete(String key);
    boolean exists(String key);
}