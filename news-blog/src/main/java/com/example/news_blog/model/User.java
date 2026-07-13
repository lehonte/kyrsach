package com.example.news_blog.model;

import com.example.news_blog.enums.Roles;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "username", unique = true, nullable = false)
    private String username;

    @Column(name = "email",unique = true, nullable = false)
    private String email;

    @Column(name = "password",nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(name = "role",nullable = false)
    private Roles role = Roles.USER;

    @OneToOne(mappedBy = "user")
    private Author author;

}
