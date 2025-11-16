package com.example.userservice.service;

import com.example.userservice.exception.EmailAlreadyExistsException;
import com.example.userservice.exception.InvalidCredentialsException;
import com.example.userservice.exception.UserNotFoundException;
import com.example.userservice.models.dto.data.LoginData;
import com.example.userservice.models.dto.response.LoginResponse;
import com.example.userservice.models.dto.response.TokenResponse;
import com.example.userservice.models.entity.User;
import com.example.userservice.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Async;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.concurrent.CompletableFuture;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final BCryptPasswordEncoder passwordEncoder;

    @Async
    public CompletableFuture<LoginResponse> registerAsync(
            String email, String password, String deviceInfo) {

        return CompletableFuture.supplyAsync(() -> {
            if (userRepository.existsByEmail(email)) {
                throw new EmailAlreadyExistsException("Email уже зарегистрирован");
            }

            User user = new User();
            user.setEmail(email);
            user.setCreatedAt(LocalDateTime.now());
            user.setPasswordHash(passwordEncoder.encode(password));
            return userRepository.save(user);
        }).thenCompose(savedUser -> createLoginResponse(savedUser, deviceInfo));
    }

    @Async
    public CompletableFuture<LoginResponse> loginAsync(
            String email, String password, String deviceInfo) {

        return CompletableFuture.supplyAsync(() -> {
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new InvalidCredentialsException("Неверный логин или пароль"));

            if (!passwordEncoder.matches(password, user.getPasswordHash())) {
                throw new InvalidCredentialsException("Неверный логин или пароль");
            }
            return user;
        }).thenCompose(user -> createLoginResponse(user, deviceInfo));
    }

    @Async
    public CompletableFuture<LoginResponse> createLoginResponse(User user, String deviceInfo) {
        return CompletableFuture.supplyAsync(() -> {
            String accessToken = jwtService.generateAccessToken(user);
            String refreshToken = jwtService.generateRefreshToken(user, deviceInfo);
            return new LoginData(user, accessToken, refreshToken);
        }).thenCompose(data ->
                jwtService.saveRefreshTokenAsync(data.user(), data.refreshToken(), deviceInfo)
                        .thenApply(saved -> new LoginResponse(
                                data.user().getEmail(),
                                data.accessToken(),
                                data.refreshToken()
                        ))
        );
    }

    @Async
    public CompletableFuture<TokenResponse> refreshTokenAsync(
            String refreshToken, String deviceInfo) {

        return jwtService.validateAndRevokeRefreshTokenAsync(refreshToken)
                .thenCompose(user -> {
                    String newAccess = jwtService.generateAccessToken(user);
                    String newRefresh = jwtService.generateRefreshToken(user, deviceInfo);

                    return jwtService.saveRefreshTokenAsync(user, newRefresh, deviceInfo)
                            .thenApply(saved -> new TokenResponse(newAccess, newRefresh));
                });
    }

    @Async
    public CompletableFuture<TokenResponse> changePasswordAsync(
            String oldPassword, String newPassword, String refreshToken, String deviceInfo) {

        return jwtService.revokeAllRefreshTokensForUser(refreshToken)
                .thenCompose(ignored -> CompletableFuture.supplyAsync(() -> {
                    Long userId = jwtService.extractUserId(refreshToken);
                    User user = userRepository.findById(userId)
                            .orElseThrow(() -> new UserNotFoundException(userId));

                    if (!passwordEncoder.matches(oldPassword, user.getPasswordHash())) {
                        throw new InvalidCredentialsException("Неверный старый пароль");
                    }
                    if (oldPassword.equals(newPassword)) {
                        throw new InvalidCredentialsException("Новый пароль должен отличаться");
                    }

                    user.setPasswordHash(passwordEncoder.encode(newPassword));
                    userRepository.save(user);

                    String newAccess = jwtService.generateAccessToken(user);
                    String newRefresh = jwtService.generateRefreshToken(user, deviceInfo);

                    jwtService.saveRefreshTokenAsync(user, newRefresh, deviceInfo);

                    return new TokenResponse(newAccess, newRefresh);
                }));
    }
}
