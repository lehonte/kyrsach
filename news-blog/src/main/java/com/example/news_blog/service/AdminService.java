package com.example.news_blog.service;

import com.example.news_blog.dto.StatisticResponse;
import com.example.news_blog.enums.Roles;
import com.example.news_blog.model.User;
import com.example.news_blog.repository.ArticleRepository;
import com.example.news_blog.repository.CategoryRepository;
import com.example.news_blog.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final ArticleRepository articleRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;

    public void makeAdmin(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Пользователь не найден"));
        user.setRole(Roles.ADMIN);
        userRepository.save(user);
    }

    public StatisticResponse getStatistic() {
        return StatisticResponse.builder()
                .users(userRepository.count())
                .articles(articleRepository.count())
                .categories(categoryRepository.count()).build();
    }
}
