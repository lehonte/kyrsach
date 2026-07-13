package com.example.news_blog.repository;

import com.example.news_blog.model.Article;
import com.example.news_blog.model.Like;
import com.example.news_blog.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface LikeRepository extends JpaRepository<Like, Long> {
    Optional<Like> findByUserAndArticle(User user, Article article);
}
