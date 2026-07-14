package com.example.news_blog.dtoRequest;

import jakarta.validation.constraints.NotBlank;

public record CategoryRequest(
        @NotBlank(message = "Название категории не может быть пустым")
        String name) {
}
