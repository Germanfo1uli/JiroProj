package com.example.userservice.service;

import com.example.userservice.models.dto.response.ChangeProfileResponse;
import com.example.userservice.models.entity.User;
import com.example.userservice.models.entity.UserProfile;
import com.example.userservice.repository.UserProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.concurrent.CompletableFuture;

@Service
@RequiredArgsConstructor
public class ProfileService {
    private final UserProfileRepository userProfileRepository;

    public UserProfile createProfile(User user, String name) {
        UserProfile profile = new UserProfile();
        profile.setName(name);
        profile.setUser(user);
        return userProfileRepository.save(profile);
    }

    @Async
    public CompletableFuture<ChangeProfileResponse> updateProfileById(Long userId, String name, String bio) {
        return CompletableFuture.supplyAsync(() -> {
            UserProfile profile = userProfileRepository.findUserProfileById(userId);
            profile.setBio(bio);
            profile.setName(name);
            UserProfile savedProfile = userProfileRepository.save(profile);
            return new ChangeProfileResponse(
                    savedProfile.getId(), savedProfile.getName(), savedProfile.getBio()
            );
        });
    }
}
