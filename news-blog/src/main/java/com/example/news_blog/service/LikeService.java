package com.example.news_blog.service;

import com.example.news_blog.dto.LikeResponse;
import com.example.news_blog.model.Article;
import com.example.news_blog.model.Like;
import com.example.news_blog.model.User;
import com.example.news_blog.repository.ArticleRepository;
import com.example.news_blog.repository.LikeRepository;
import com.example.news_blog.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class LikeService {

    private final UserRepository userRepository;
    private final LikeRepository likeRepository;
    private final ArticleRepository articleRepository;

    public LikeResponse toggleLike(Long id, String auth) {
        User user = userRepository.findByUsername(auth)
                .orElseThrow(() -> new RuntimeException("Пользователь не найден"));
        Article article = articleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Статья не найдена"));

        Optional<Like> existingLike = likeRepository.findByUserAndArticle(user, article);

        if (existingLike.isPresent()) {
            likeRepository.delete(existingLike.get());
            return LikeResponse.builder().isLiked(false).build();
        } else {
            Like like = new Like();
            like.setUser(user);
            like.setArticle(article);
            likeRepository.save(like);
            return LikeResponse.builder().isLiked(true).build();
        }

    }
}
