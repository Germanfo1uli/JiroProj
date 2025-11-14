package com.example.userservice.service;

import com.example.userservice.exception.EmailAlreadyExistsException;
import com.example.userservice.exception.InvalidCredentialsException;
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
@Transactional
public class UserService {
    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final BCryptPasswordEncoder passwordEncoder;

    @Async
    public CompletableFuture<LoginResponse> registerAsync(String email, String password, String deviceInfo)
    {
        return CompletableFuture.supplyAsync(() -> {
            if(userRepository.existsByEmail(email)) {
                throw new EmailAlreadyExistsException("Email уже зарегистрирован");
            }

            User user = new User();
            user.setEmail(email);
            user.setCreatedAt(LocalDateTime.now());
            user.setPasswordHash(passwordEncoder.encode(password));

            User savedUser = userRepository.save(user);

            String accessToken = jwtService.generateAccessToken(savedUser);
            String refreshToken = jwtService.generateRefreshToken(savedUser, deviceInfo);

            jwtService.saveRefreshTokenAsync(savedUser, refreshToken, deviceInfo);

            return new LoginResponse(
                    savedUser.getEmail(),
                    accessToken,
                    refreshToken
            );
        });
    }

    @Async
    public CompletableFuture<LoginResponse> loginAsync(String email, String password, String deviceInfo)
    {
        return CompletableFuture.supplyAsync(() -> {
            User user = userRepository.findByEmail(email)
                    .orElseThrow(InvalidCredentialsException::new);

            if(!passwordEncoder.matches(password, user.getPasswordHash())) {
                throw new InvalidCredentialsException();
            }

            String accessToken = jwtService.generateAccessToken(user);
            String refreshToken = jwtService.generateRefreshToken(user, deviceInfo);

            jwtService.saveRefreshTokenAsync(user, refreshToken, deviceInfo);

            return new LoginResponse(
                    user.getEmail(),
                    accessToken,
                    refreshToken
            );
        });
    }

    @Async
    public CompletableFuture<TokenResponse> refreshTokenAsync(String refreshToken, String deviceInfo){
        return jwtService.validateAndRevokeRefreshTokenAsync(refreshToken)
                .thenApply(user -> {
                    String newAccess = jwtService.generateAccessToken(user);
                    String newRefresh = jwtService.generateRefreshToken(user, deviceInfo);

                    jwtService.saveRefreshTokenAsync(user, newRefresh, deviceInfo);

                    return new TokenResponse(
                            newAccess,
                            newRefresh
                    );
                });
    }
}
