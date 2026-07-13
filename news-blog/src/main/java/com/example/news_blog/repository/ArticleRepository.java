package com.example.news_blog.repository;

import com.example.news_blog.model.Article;
import com.example.news_blog.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ArticleRepository extends JpaRepository<Article, Long> {
    List<Article> findByCategory_Name(String category);
}