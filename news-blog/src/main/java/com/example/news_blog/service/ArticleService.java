package com.example.news_blog.service;

import com.example.news_blog.dto.ArticleResponse;
import com.example.news_blog.dtoRequest.ArticleRequest;
import com.example.news_blog.model.Article;
import com.example.news_blog.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ArticleService {
    private final ArticleRepository articleRepository;
    private final AuthorRepository authorRepository;
    private final CategoryRepository categoryRepository;

    public ArticleResponse create(ArticleRequest request, String auth) {
        Article article = new Article();
        article.setTitle(request.title());
        article.setAuthor(authorRepository
                .findByUser_Username(auth).orElseThrow(() -> new RuntimeException("Неверный автор")));
        article.setContent(request.content());
        article.setCategory(categoryRepository
                .findCategoryByName(request.category()).orElseThrow(() -> new RuntimeException("Неверная категория")));
        article.setImageUrl(request.imageUrl());

        Article saved = articleRepository.save(article);
        return ArticleResponse.builder()
                .id(saved.getId())
                .title(saved.getTitle())
                .content(saved.getContent())
                .imageUrl(saved.getImageUrl())
                .author(saved.getAuthor().getUser().getUsername())
                .category(saved.getCategory().getName())
                .build();
    }

    public List<ArticleResponse> getAll() {
        return articleRepository.findAll().stream()
                .map(article -> new ArticleResponse(article.getId(),
                        article.getTitle(),
                        article.getContent(),
                        article.getImageUrl(),
                        article.getAuthor().getUser().getUsername(),
                        article.getCategory().getName()))
                .toList();
    }

    public List<ArticleResponse> getByCategory(ArticleRequest request) {
        return articleRepository.findByCategory_Name(request.category()).stream()
                .map(article -> new ArticleResponse(article.getId(),
                        article.getTitle(),
                        article.getContent(),
                        article.getImageUrl(),
                        article.getAuthor().getUser().getUsername(),
                        article.getCategory().getName()))
                .toList();
    }

    public ArticleResponse findById(Long id) {
        Article article = articleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Статья не найдена"));
        return ArticleResponse.builder()
                .id(article.getId())
                .title(article.getTitle())
                .content(article.getContent())
                .imageUrl(article.getImageUrl())
                .author(article.getAuthor().getUser().getUsername())
                .category(article.getCategory().getName())
                .build();
    }

    public ArticleResponse delete(Long id, String auth, boolean isAdmin) {
        Article article = articleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Статья не найдена"));

        boolean isAuthor = article.getAuthor().getUser().getUsername().equals(auth);
        if (!isAuthor && !isAdmin) {
            throw new RuntimeException("Вы можете удалять только свои статьи");
        }

        articleRepository.delete(article);
        return ArticleResponse.builder().build();
    }

    public ArticleResponse update(Long id, ArticleRequest request, String auth, boolean isAdmin) {
        Article article = articleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Статья не найдена"));

        boolean isAuthor = article.getAuthor().getUser().getUsername().equals(auth);
        if (!isAuthor && !isAdmin) {
            throw new RuntimeException("Вы можете редактировать только свои статьи");
        }

        article.setTitle(request.title());
        article.setContent(request.content());
        article.setCategory(categoryRepository
                .findCategoryByName(request.category()).orElseThrow(() -> new RuntimeException("Неверная категория")));
        article.setImageUrl(request.imageUrl());


        Article saved = articleRepository.save(article);

        return ArticleResponse.builder()
                .id(saved.getId())
                .title(saved.getTitle())
                .content(saved.getContent())
                .imageUrl(saved.getImageUrl())
                .author(saved.getAuthor().getUser().getUsername())
                .category(saved.getCategory().getName())
                .build();
    }

}
