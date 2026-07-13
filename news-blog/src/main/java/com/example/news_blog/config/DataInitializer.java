package com.example.news_blog.config;

import com.example.news_blog.enums.Categories;
import com.example.news_blog.enums.Roles;
import com.example.news_blog.model.Category;
import com.example.news_blog.model.User;
import com.example.news_blog.repository.CategoryRepository;
import com.example.news_blog.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;


@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final CategoryRepository categoryRepository;

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    @Override
    public void run(String... args) throws Exception {
        createDefaultAdmin();
        initializeDefaultCategories();
    }

    private void createDefaultAdmin() {
        if (!userRepository.existsByUsername("admin")) {
            try {
                User admin = new User();
                admin.setUsername("admin");
                admin.setPassword(passwordEncoder.encode("admin123"));
                admin.setEmail("admin@newsblog.com");
                admin.setRole(Roles.ADMIN);
                userRepository.save(admin);
                System.out.println("Администратор создан успешно!");
            } catch (Exception e) {
                System.out.println("Ошибка создания администратора: " + e.getMessage());
                e.printStackTrace();
            }
        } else {
            System.out.println("Администратор уже существует");
        }
    }

    private void initializeDefaultCategories() {
        try {
            long count = categoryRepository.count();
            logger.info("Сейчас категории: {}", count);

            if (count == 0) {
                logger.info("Запуск инициализации дефолтных категорий");

                for (Categories c : Categories.values()) {
                    Category category = new Category();
                    category.setName(c.name());
                    categoryRepository.save(category);
                    logger.info("Создана категория: {}", c.name());
                }

                logger.info("Дефолт категории созданы успешно");
            }
        } catch (Exception e) {
            logger.error("Ошибка создания категорий: {}", e.getMessage(), e);
        }
    }
}
