package com.example.news_blog.dtoRequest;

import com.example.news_blog.model.Article;
import com.example.news_blog.model.User;

public record LikeRequest(User user, Article article) {
}
