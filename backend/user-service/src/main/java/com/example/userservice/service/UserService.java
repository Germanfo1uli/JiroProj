package com.example.userservice.service;

import com.example.userservice.exception.UserNotFoundException;
import com.example.userservice.models.dto.projection.UserProfileProjection;
import com.example.userservice.models.dto.response.ChangeProfileResponse;
import com.example.userservice.models.dto.response.UserProfileResponse;
import com.example.userservice.models.entity.User;
import com.example.userservice.models.entity.UserProfile;
import com.example.userservice.repository.ProfileRepository;
import com.example.userservice.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.concurrent.CompletableFuture;


@Service
@RequiredArgsConstructor
public class UserService {
    private final ProfileRepository profileRepository;
    private final UserRepository userRepository;

    @Transactional
    public UserProfile createProfile(User user, String name) {
        UserProfile profile = new UserProfile();
        profile.setName(name);
        profile.setUser(user);
        return profileRepository.save(profile);
    }

    @Async
    public CompletableFuture<ChangeProfileResponse> updateProfileByIdAsync(Long userId, String name, String bio) {
        return CompletableFuture.supplyAsync(() -> {
            UserProfile profile = profileRepository.findUserProfileById(userId);
            profile.setBio(bio);
            profile.setName(name);
            UserProfile savedProfile = profileRepository.save(profile);
            return new ChangeProfileResponse(
                    savedProfile.getId(), savedProfile.getName(), savedProfile.getBio()
            );
        });
    }

    @Async
    public CompletableFuture<UserProfileResponse> getProfileByIdAsync(Long userId) {
        return CompletableFuture.supplyAsync(() -> {
            UserProfileProjection proj = userRepository.findUserById(userId)
                    .orElseThrow(() -> new UserNotFoundException(userId));

            return new UserProfileResponse(
                    userId,
                    proj.getEmail(),
                    proj.getName(),
                    proj.getBio(),
                    proj.getCreatedAt()
            );
        });
    }
}
