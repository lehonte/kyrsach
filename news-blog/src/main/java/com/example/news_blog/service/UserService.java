package com.example.news_blog.service;

import com.example.news_blog.dto.LoginResponse;
import com.example.news_blog.dto.UserResponse;
import com.example.news_blog.dtoRequest.LoginRequest;
import com.example.news_blog.dtoRequest.RegisterRequest;
import com.example.news_blog.enums.Roles;
import com.example.news_blog.model.User;
import com.example.news_blog.repository.UserRepository;
import com.example.news_blog.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;

    private final JwtTokenProvider tokenProvider;
    private final AuthenticationManager authManager;


    public UserResponse register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.username())) {
            throw new RuntimeException("Имя пользователя '" + request.username() + "' уже занято");
        }
        if (userRepository.existsByEmail(request.email())) {
            throw new RuntimeException("Email '" + request.email() + "' уже используется");
        }

        User user = new User();
        user.setUsername(request.username());
        user.setEmail(request.email());
        user.setPassword(passwordEncoder.encode(request.password()));
        user.setRole(Roles.USER);
        userRepository.save(user);
        return UserResponse.builder().username(request.username()).email(request.email()).role(Roles.USER).build();
    }

    public List<UserResponse> getAll() {
        return userRepository.findAll().stream()
                .map(user -> new UserResponse(user.getId(),
                        user.getUsername(),
                        user.getEmail(),
                        user.getRole())).toList();
    }

    public LoginResponse login(LoginRequest request) {

        Authentication auth = authManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.username(), request.password()));
        User user = userRepository.findByUsername(request.username())
                .orElseThrow(() -> new RuntimeException("Пользователь не найден"));
        String token = tokenProvider.generateToken(user.getUsername(), user.getRole());
        return LoginResponse.builder().id(user.getId()).username(user.getUsername()).token(token).email(user.getEmail()).build();
    }
}