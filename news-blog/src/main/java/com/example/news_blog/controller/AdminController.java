package com.example.news_blog.controller;

import com.example.news_blog.model.Category;
import com.example.news_blog.service.ArticleService;
import com.example.news_blog.service.CategoryService;
import com.example.news_blog.service.UserService;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final ArticleService articleService;
    private final CategoryService categoryService;
    private final UserService userService;

    public AdminController(ArticleService articleService,
                           CategoryService categoryService,
                           UserService userService) {
        this.articleService = articleService;
        this.categoryService = categoryService;
        this.userService = userService;
    }

    @GetMapping("/stats")
    public Map<String, Object> stats() {
        return Map.of(
                "articles", articleService.getAll().size(),
                "users", userService.getAll().size(),
                "categories", categoryService.getAll().size()
        );
    }

    @PostMapping("/categories")
    public Category createCategory(@RequestParam String name) {
        return categoryService.createCategory(name);
    }

    @PostMapping("/users/{id}/make-admin")
    public void makeAdmin(@PathVariable Long id) {
        userService.makeAdmin(id);
    }
}
