package com.example.news_blog.dto;

import lombok.Builder;

@Builder
public record CategoryResponse(Long id,String name) {
}
