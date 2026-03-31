package com.example.news_blog.config;

import com.example.news_blog.model.User;
import com.example.news_blog.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        createDefaultAdmin();
    }

    private void createDefaultAdmin() {
        if (!userRepository.existsByUsername("admin")) {
            try {
                User admin = new User("admin", "admin@newsblog.com", passwordEncoder.encode("admin123"));
                admin.setRole("ROLE_ADMIN");
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
}
