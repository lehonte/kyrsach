package com.example.news_blog.service;

import com.example.news_blog.model.User;
import com.example.news_blog.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public User register(String username, String email, String rawPassword) {
        if (username == null || username.trim().isEmpty()) {
            throw new RuntimeException("Имя пользователя не может быть пустым");
        }
        if (email == null || !email.contains("@")) {
            throw new RuntimeException("Некорректный email");
        }
        if (rawPassword == null || rawPassword.length() < 5) {
            throw new RuntimeException("Пароль должен быть не менее 5 символов");
        }
        if (userRepository.existsByUsername(username)) {
            throw new RuntimeException("Имя пользователя '" + username + "' уже занято");
        }
        if (userRepository.existsByEmail(email)) {
            throw new RuntimeException("Email '" + email + "' уже используется");
        }

        User user = new User(username, email, passwordEncoder.encode(rawPassword));
        user.setRole("ROLE_USER");
        return userRepository.save(user);
    }

    public void makeAdmin(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Пользователь не найден"));
        user.setRole("ROLE_ADMIN");
        userRepository.save(user);
    }
    public List<User> getAll() {
        return userRepository.findAll();
    }
    public User findByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Пользователь не найден"));
    }
}