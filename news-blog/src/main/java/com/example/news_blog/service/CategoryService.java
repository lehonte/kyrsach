package com.example.news_blog.service;

import com.example.news_blog.model.Category;
import com.example.news_blog.repository.CategoryRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class CategoryService {
    private static final Logger logger = LoggerFactory.getLogger(CategoryService.class);
    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    public Category create(String name) {
        logger.info("Созданные категории: {}", name);

        if (categoryRepository.existsByName(name)) {
            throw new RuntimeException("Категория '" + name + "' уже существует");
        }

        Category category = new Category(name);
        return categoryRepository.save(category);
    }

    public List<Category> getAll() {
        List<Category> categories = categoryRepository.findAll();
        logger.info("Получены {} категории", categoryRepository.count());
        return categories;
    }

    public Category createCategory(String name) {
        return create(name);
    }
}