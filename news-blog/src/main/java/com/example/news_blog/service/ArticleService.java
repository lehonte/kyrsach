package com.example.news_blog.service;

import com.example.news_blog.model.Article;
import com.example.news_blog.repository.ArticleRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class ArticleService {
    private final ArticleRepository articleRepository;

    public ArticleService(ArticleRepository articleRepository) {
        this.articleRepository = articleRepository;
    }

    @Transactional
    public void toggleLike(Long articleId, String username) {
        Optional<Article> articleOptional = articleRepository.findById(articleId);
        if (articleOptional.isEmpty()) {
            throw new RuntimeException("Статья не найдена");
        }

        Article article = articleOptional.get();

        if (article.getLikedByUsers().contains(username)) {
            article.getLikedByUsers().remove(username);
        } else {
            article.getLikedByUsers().add(username);
        }

        articleRepository.save(article);
    }

    public List<Article> getArticlesLikedByUser(String username) {
        List<Article> allArticles = articleRepository.findAll();
        return allArticles.stream()
                .filter(article -> article.getLikedByUsers().contains(username))
                .toList();
    }


    public Article create(String title, String content, String author, String category, String imageUrl) {
        Article article = new Article(title, content, author, category);
        article.setImageUrl(imageUrl);
        article.setRating(0.0);
        return articleRepository.save(article);
    }

    public List<Article> getAll() {
        return articleRepository.findAll();
    }

    public List<Article> getByCategory(String category) {
        return articleRepository.findByCategory(category);
    }

    public Optional<Article> findById(Long id) {
        return articleRepository.findById(id);
    }

    public void delete(Long articleId, String currentUsername, boolean isAdmin) {
        Optional<Article> article = articleRepository.findById(articleId);
        if (article.isEmpty()) {
            throw new RuntimeException("Статья не найдена");
        }
        Article foundArticle = article.get();
        boolean isAuthor = foundArticle.getAuthor().equals(currentUsername);
        if (!isAuthor && !isAdmin) {
            throw new RuntimeException("Вы можете удалять только свои статьи");
        }
        articleRepository.deleteById(articleId);
    }

    public Article update(Long articleId, String title, String content, String category, String currentUsername, String imageUrl, boolean isAdmin) {
        Optional<Article> article = articleRepository.findById(articleId);
        if (article.isEmpty()) {
            throw new RuntimeException("Статья не найдена");
        }
        Article foundArticle = article.get();
        boolean isAuthor = foundArticle.getAuthor().equals(currentUsername);
        if (!isAuthor && !isAdmin) {
            throw new RuntimeException("Вы можете редактировать только свои статьи");
        }
        foundArticle.setTitle(title);
        foundArticle.setContent(content);
        foundArticle.setCategory(category);
        foundArticle.setImageUrl(imageUrl);
        return articleRepository.save(foundArticle);
    }
}
