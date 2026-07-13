package com.example.news_blog.dtoRequest;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.hibernate.validator.constraints.URL;

public record LoginRequest(
    @NotBlank(message = "Логин не может быть пустым")
    String username,

    @NotBlank(message = "Пароль не должен быть пустым")
    @Size(min = 10, message = "Пароль минимум 10 символов")
    String password) {}