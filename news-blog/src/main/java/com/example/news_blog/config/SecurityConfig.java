package com.example.news_blog.config;

import com.example.news_blog.security.JwtAuthFilter;
import com.example.news_blog.security.JwtTokenProvider;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration //сообщает Spring Boot, что этот класс содержит настройки (бины), которые нужно создать и применить при старте приложения
@EnableWebSecurity //включает встроенную поддержку безопасности Spring Security в проекте
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(); //это сильный хэш-алгоритм для паролей
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http, JwtTokenProvider tokenProvider) throws Exception {
        http
                .csrf(csrf -> csrf.disable()) //отключает защиту от межсайтовой подделки запросов
                .cors(cors -> cors.configurationSource(request -> {
                    var c = new org.springframework.web.cors.CorsConfiguration();
                    c.setAllowedOrigins(java.util.List.of("http://localhost:5173", "http://localhost:5174")); // разрешает делать запросы только с этих адресов
                    c.setAllowedMethods(java.util.List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
                    c.setAllowedHeaders(java.util.List.of("Authorization", "Content-Type")); //разрешает клиенту передавать заголовки Content-Type (для JSON) и Authorization (для отправки JWT-токена)
                    c.setAllowCredentials(true); //разрешает передавать куки или системные файлы авторизации, если это потребуется фронтенду

                    return c;
                }))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/auth/**").permitAll()
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")
                        .requestMatchers("/api/articles/**").authenticated()
                        .requestMatchers("/api/categories/**").authenticated()
                        .requestMatchers(HttpMethod.POST, "/api/users/login", "/api/users/register").permitAll()
                        .requestMatchers("/api/users/**").hasRole("ADMIN")
                        .anyRequest().permitAll()
                )
                .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS)) //JWT самодостаточен: В архитектуре с JWT-токенами серверу больше не нужно ничего хранить в своей памяти. Клиент сам при каждом запросе присылает токен в заголовке Authorization.
                .addFilterBefore(new JwtAuthFilter(tokenProvider),
                        UsernamePasswordAuthenticationFilter.class); // встраивает ваш кастомный фильтр JwtAuthFilter в цепочку проверок прямо перед стандартным фильтром UsernamePasswordAuthenticationFilter
        return http.build();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager(); //менеджер Spring Security, отвечающий за проверку подлинности пользователя
    }

}
