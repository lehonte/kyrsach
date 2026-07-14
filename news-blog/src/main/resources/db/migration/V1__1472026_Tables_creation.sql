CREATE TABLE users (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(10) NOT NULL
);

CREATE TABLE categories (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE articles (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    user_id BIGINT NOT NULL REFERENCES users(id),
    category_id BIGINT NOT NULL REFERENCES categories(id),
    image_url VARCHAR(2083)
);

CREATE TABLE likes (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id),
    article_id BIGINT NOT NULL REFERENCES articles(id)
);

ALTER TABLE likes ADD CONSTRAINT unique_user_article_like UNIQUE (user_id, article_id);
INSERT INTO users (username, email, password, role)
VALUES (
           '${admin_username}',
           '${admin_email}',
           '${admin_password_hash}',
           'ADMIN'
       ) ON CONFLICT (email) DO NOTHING;
