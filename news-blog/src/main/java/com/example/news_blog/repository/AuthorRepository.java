package com.example.news_blog.repository;

import com.example.news_blog.model.Author;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AuthorRepository extends JpaRepository {
    Optional<Author> findByUser_Username(String username);
}
