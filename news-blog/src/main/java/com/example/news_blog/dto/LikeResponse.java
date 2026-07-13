package com.example.news_blog.dto;

import lombok.Builder;

@Builder
public record LikeResponse(boolean isLiked) {
}
