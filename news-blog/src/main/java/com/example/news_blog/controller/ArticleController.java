package com.example.news_blog.controller;

import com.example.news_blog.dto.ArticleResponse;
import com.example.news_blog.dtoRequest.ArticleRequest;
import com.example.news_blog.service.ArticleService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;

import java.util.List;

@RestController
@RequestMapping("/api/articles")
@RequiredArgsConstructor
public class ArticleController {

    private final ArticleService articleService;

    @GetMapping
    public ResponseEntity<List<ArticleResponse>> getAll(@RequestParam(required = false) String category) {
        if (category != null && !category.isEmpty()) {
            return ResponseEntity.status(HttpStatus.OK ).body(articleService.getByCategory(category));
        }
        return ResponseEntity.status(HttpStatus.OK ).body(articleService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ArticleResponse> getById(@PathVariable Long id) {
        return ResponseEntity.status(HttpStatus.OK).body(articleService.findById(id));
    }

    @PostMapping
    public ResponseEntity<ArticleResponse> create(@Valid @RequestBody ArticleRequest request,
                                                  Authentication auth) {
        return ResponseEntity.status(HttpStatus.CREATED).body(articleService.create(request, auth.getName()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ArticleResponse> update(@PathVariable Long id,
                                                  @Valid @RequestBody ArticleRequest request,
                                                  Authentication auth) {
        boolean isAdmin = auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        return ResponseEntity.status(HttpStatus.OK).body(articleService.update(id, request, auth.getName(), isAdmin));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id, Authentication auth) {
        boolean isAdmin = auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        articleService.delete(id, auth.getName(), isAdmin);
        return ResponseEntity.noContent().build();
    }

}