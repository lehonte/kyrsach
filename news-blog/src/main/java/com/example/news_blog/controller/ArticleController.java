package com.example.news_blog.controller;

import com.example.news_blog.model.Article;
import com.example.news_blog.service.ArticleService;
import com.example.news_blog.dto.ArticleRequest;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;
import java.util.List;

@RestController
@RequestMapping("/api/articles")
public class ArticleController {

    private final ArticleService articleService;

    public ArticleController(ArticleService articleService) {
        this.articleService = articleService;
    }

    @GetMapping
    public List<Article> getAll(@RequestParam(required = false) String category) {
        if (category != null && !category.isEmpty()) {
            return articleService.getByCategory(category);
        }
        return articleService.getAll();
    }

    @GetMapping("/{id}")
    public Article getById(@PathVariable Long id) {
        return articleService.findById(id)
                .orElseThrow(() -> new RuntimeException("Статья не найдена"));
    }

    @PostMapping
    public Article create(@RequestBody ArticleRequest request, Authentication auth) {
        return articleService.create(
                request.title(),
                request.content(),
                auth.getName(),
                request.category(),
                request.imageUrl()
        );
    }

    @PutMapping("/{id}")
    public Article update(@PathVariable Long id,
                          @RequestBody ArticleRequest request,
                          Authentication auth) {
        return articleService.update(
                id,
                request.title(),
                request.content(),
                request.category(),
                auth.getName(),
                request.imageUrl(),
                auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"))
        );
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id, Authentication auth) {
        articleService.delete(id, auth.getName(),
                auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN")));
    }

    @PostMapping("/toggle-like/{id}")
    public Article toggleLike(@PathVariable Long id, Authentication auth) {
        articleService.toggleLike(id, auth.getName());
        return articleService.findById(id)
                .orElseThrow(() -> new RuntimeException("Статья не найдена"));
    }

    @GetMapping("/liked")
    public List<Article> liked(Authentication auth) {
        return articleService.getArticlesLikedByUser(auth.getName());
    }
}