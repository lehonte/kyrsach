package com.example.news_blog.dtoRequest;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
    @NotBlank(message = "Логин не может быть пустым")
    String username,

    @NotBlank(message = "Логин не может быть пустым")
    @Email(message = "Неккоректный email")
    String email,

    @NotBlank(message = "Пароль не должен быть пустым")
    @Size(min = 7, message = "Пароль минимум 7 символов")
    String password) {}