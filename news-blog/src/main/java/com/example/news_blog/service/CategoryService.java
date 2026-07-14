package com.example.news_blog.service;

import com.example.news_blog.dto.CategoryResponse;
import com.example.news_blog.dtoRequest.CategoryRequest;
import com.example.news_blog.model.Category;
import com.example.news_blog.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryService {
    private static final Logger logger = LoggerFactory.getLogger(CategoryService.class);
    private final CategoryRepository categoryRepository;

    public List<CategoryResponse> getAll() {
        logger.info("Получены {} категории", categoryRepository.count());
        return categoryRepository.findAll().stream()
                .map(category -> new CategoryResponse(
                        category.getId(),
                        category.getName())).toList();
    }

    public CategoryResponse createCategory(CategoryRequest request) {
        Category category = new Category();
        category.setName(request.name());
        categoryRepository.save(category);
        return CategoryResponse.builder().id(category.getId()).name(category.getName()).build();
    }
}