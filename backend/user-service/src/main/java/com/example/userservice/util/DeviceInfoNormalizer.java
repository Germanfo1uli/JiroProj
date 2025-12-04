package com.example.userservice.util;

import lombok.extern.slf4j.Slf4j;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

@Slf4j
public class DeviceInfoNormalizer {

    // позволяет из строки с браузером убрать версию
    public static String normalize(String userAgent) {
        if (userAgent == null) return "Unknown";

        return userAgent
                .replaceAll("Chrome/\\d+\\.\\d+\\.\\d+\\.\\d+", "Chrome")
                .replaceAll("Firefox/\\d+\\.\\d+", "Firefox")
                .replaceAll("OPR/\\d+\\.\\d+\\.\\d+\\.\\d+", "Opera")
                .replaceAll("Safari/\\d+\\.\\d+", "Safari")
                .replaceAll("Version/\\d+\\.\\d+", "")
                .replaceAll("Windows NT \\d+\\.\\d+", "Windows")
                .replaceAll("macOS \\d+\\.\\d+", "macOS")
                .replaceAll("\\(Edition[^)]*\\)", "")
                .trim();
    }

    // создаем хеш из полученной информации
    public static String getDeviceFingerprint(String userAgent) {
        log.info("User agent was got: {}", userAgent);
        String normalized = normalize(userAgent);

        log.info("User agent was normalized: {}", normalized);

        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(normalized.getBytes());

            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }
            return hexString.toString();

        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("SHA-256 algorithm not available", e);
        }
    }
}