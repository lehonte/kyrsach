package com.example.news_blog.dtoRequest;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Builder;

@Builder
public record LoginRequest(
    @NotBlank(message = "Логин не может быть пустым")
    String username,

    @NotBlank(message = "Пароль не должен быть пустым")
    @Size(min = 7, message = "Пароль минимум 7 символов")
    String password) {}