package com.example.userservice.repository;

import com.example.userservice.models.entity.User;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    boolean existsByEmail(String email);
    Optional<User> findByEmail(String email);
    @EntityGraph(attributePaths = "profile")
    Optional<User> findWithProfileById(Long id);
}
