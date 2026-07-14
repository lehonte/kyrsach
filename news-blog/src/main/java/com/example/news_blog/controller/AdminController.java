package com.example.news_blog.controller;

import com.example.news_blog.dto.CategoryResponse;
import com.example.news_blog.dto.StatisticResponse;
import com.example.news_blog.dtoRequest.CategoryRequest;
import com.example.news_blog.service.AdminService;
import com.example.news_blog.service.CategoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {
    private final AdminService adminService;
    private final CategoryService categoryService;

    @GetMapping("/stats")
    public ResponseEntity<StatisticResponse> getStatistic() {
        return ResponseEntity.status(HttpStatus.OK ).body(adminService.getStatistic());
    }

    @PostMapping("/categories")
    public ResponseEntity<CategoryResponse> createCategory(@Valid @RequestBody CategoryRequest categoryRequest) {
        return ResponseEntity.status(HttpStatus.CREATED).body(categoryService.createCategory(categoryRequest));
    }

    @PostMapping("/users/{id}/make-admin")
    public ResponseEntity<Void> makeAdmin(@PathVariable Long id) {
        adminService.makeAdmin(id);
        return ResponseEntity.noContent().build();
    }
}

