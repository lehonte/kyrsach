package com.example.news_blog.dto;

import lombok.Builder;


@Builder
public record ArticleResponse(Long id, String title, String author, String content, String category, String imageUrl) {
}
