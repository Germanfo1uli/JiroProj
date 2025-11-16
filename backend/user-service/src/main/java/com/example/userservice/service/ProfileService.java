package com.example.userservice.service;

import com.example.userservice.repository.UserProfileRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Transactional
public class ProfileService {
    private final UserProfileRepository userProfileRepository;
}
