package com.example.news_blog.controller;

import com.example.news_blog.dto.LikeResponse;
import com.example.news_blog.service.LikeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/articles/likes")
@RequiredArgsConstructor
public class LikeController {

    private final LikeService likeService;

    @PostMapping("/toggle-like/{id}")
    public ResponseEntity<LikeResponse> toggleLike(@PathVariable Long id,
                                                   Authentication auth) {
        return ResponseEntity.status(HttpStatus.OK).body(likeService.toggleLike(id, auth.getName()));
    }
}
