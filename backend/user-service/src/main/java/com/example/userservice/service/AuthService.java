package com.example.userservice.service;

import com.example.userservice.models.entity.User;
import com.example.userservice.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordService passwordService;   // шифрование + policy
    private final TokenService tokenService;         // работа с RefreshToken
    private final JwtHelper jwtHelper;               // генерация/парсинг JWT

    @Transactional
    public LoginResponse register(String email, String rawPassword, String name, String deviceInfo) {

        if (userRepository.existsByEmail(email)) {
            throw new EmailAlreadyExistsException();
        }

        User user = User.builder()
                .email(email)
                .passwordHash(passwordService.encode(rawPassword))
                .build();
        userRepository.save(user);

        // доменный сервис профиля
        profileService.createProfile(user, name);

        TokenPair pair = tokenService.createTokenPair(user, deviceInfo);
        return LoginResponse.of(user.getEmail(), pair);
    }

    public LoginResponse login(String email, String rawPassword, String deviceInfo) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(InvalidCredentialsException::new);

        passwordService.verify(rawPassword, user.getPasswordHash());

        TokenPair pair = tokenService.createTokenPair(user, deviceInfo);
        return LoginResponse.of(user.getEmail(), pair);
    }

    public TokenResponse refresh(String refreshTokenString, String deviceInfo) {
        RefreshToken current = tokenService.validateAndRevoke(refreshTokenString);
        User user = current.getUser();
        TokenPair pair = tokenService.createTokenPair(user, deviceInfo);
        return TokenResponse.of(pair);
    }

    public void logout(String refreshTokenString) {
        tokenService.revokeByString(refreshTokenString);
    }

    public TokenResponse changePassword(Long userId, String oldRaw, String newRaw,
                                        String currentRefresh, String deviceInfo) {
        User user = userRepository.findById(userId)
                .orElseThrow(UserNotFoundException::new);

        passwordService.verifyAndChange(oldRaw, newRaw, user);
        tokenService.revokeAllExcept(user, currentRefresh);
        TokenPair pair = tokenService.createTokenPair(user, deviceInfo);
        return TokenResponse.of(pair);
    }

    public TokenResponse changeEmail(Long userId, String password, String newEmail,
                                     String currentRefresh, String deviceInfo) {
        User user = userRepository.findById(userId)
                .orElseThrow(UserNotFoundException::new);

        passwordService.verify(password, user.getPasswordHash());
        if (newEmail.equals(user.getEmail())) {
            throw new SameEmailException();
        }
        user.setEmail(newEmail);

        tokenService.revokeAllExcept(user, currentRefresh);
        TokenPair pair = tokenService.createTokenPair(user, deviceInfo);
        return TokenResponse.of(pair);
    }
}