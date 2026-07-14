package com.example.news_blog.dtoRequest;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.hibernate.validator.constraints.URL;

public record ArticleRequest(
    @NotBlank(message = "Заголовок не может быть пустым")
    String title,

    @NotBlank(message = "Содержимое статьи не может быть пустым")
    @Size(min = 10, message = "Статья должна содержать минимум 10 символов")
    String content,

    @NotBlank(message = "Автор должен быть указан")
    String user,

    @NotBlank(message = "Категория должна быть указана")
    String category,

    @URL(message = "Ссылка на изображение должна быть корректным URL-адресом")
    String imageUrl) {}