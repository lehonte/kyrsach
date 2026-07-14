package com.example.news_blog.dto;

import lombok.Builder;

@Builder
public record LoginResponse(Long id, String token, String username, String email, String role) {}
