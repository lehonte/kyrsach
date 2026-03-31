package com.example.news_blog.model;

import jakarta.persistence.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "articles")
public class Article {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @Column(nullable = false)
    private String author;
    @Column(nullable = false)
    private String category;

    @Column(name = "image_url", length = 2083)
    private String imageUrl;

    @Column(name = "rating")
    private Double rating;
    @ElementCollection
    @CollectionTable(
            name = "article_likes",
            joinColumns = @JoinColumn(name = "article_id")
    )
    @Column(name = "username")
    private Set<String> likedByUsers = new HashSet<>();
    public Article() {
        this.rating = 0.0;
    }
    public Article(String title, String content, String author, String category) {
        this.title = title;
        this.content = content;
        this.author = author;
        this.category = category;
        this.rating = 0.0;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getAuthor() {
        return author;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public Set<String> getLikedByUsers() { return likedByUsers; }
    public void setLikedByUsers(Set<String> likedByUsers) { this.likedByUsers = likedByUsers; }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }
    public int getLikesCount() {
        return likedByUsers != null ? likedByUsers.size() : 0;
    }

    public Double getRating() {
        return rating;
    }

    public void setRating(Double rating) {
        this.rating = rating;
    }
}



