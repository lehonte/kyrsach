package com.example.news_blog.dto;

import lombok.Builder;

@Builder
public record StatisticResponse(Long articles, Long users, Long categories) {
}
