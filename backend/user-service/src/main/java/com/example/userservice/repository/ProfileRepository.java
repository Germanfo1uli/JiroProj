package com.example.userservice.repository;

import com.example.userservice.models.entity.UserProfile;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProfileRepository extends JpaRepository<UserProfile, Long> {
    UserProfile findUserProfileById(Long id);
}
