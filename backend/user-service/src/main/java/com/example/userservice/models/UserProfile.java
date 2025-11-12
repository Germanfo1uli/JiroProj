package com.example.userservice.models;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "user_profile", schema = "user_service_schema")
@Data
public class UserProfile {
    @Id
    private Long Id;

    @OneToOne
    @MapsId
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "name")
    private String Name;

    @Column(name = "bio")
    private String Bio;
}
