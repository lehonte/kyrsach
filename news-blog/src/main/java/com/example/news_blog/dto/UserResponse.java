package com.example.news_blog.dto;

import com.example.news_blog.enums.Roles;
import lombok.Builder;

@Builder
public record UserResponse(Long id, String username, String email, Roles role) {
}
