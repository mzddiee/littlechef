DROP DATABASE IF EXISTS little_chef;
CREATE DATABASE little_chef;
USE little_chef;

CREATE TABLE users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
    role ENUM('admin', 'chef', 'user') NOT NULL
);

CREATE TABLE cuisine (
    cuisine_id INT PRIMARY KEY AUTO_INCREMENT,
    cuisine_name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE recipe (
    recipe_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    instruction TEXT NOT NULL,
    status ENUM('in-progress', 'published', 'archived') NOT NULL,
    user_id INT NOT NULL,
    cuisine_id INT NOT NULL,
    image_name VARCHAR(255),
    image_data LONGTEXT,
    CONSTRAINT fk_recipe_user
        FOREIGN KEY (user_id) REFERENCES users(user_id),
    CONSTRAINT fk_recipe_cuisine
        FOREIGN KEY (cuisine_id) REFERENCES cuisine(cuisine_id)
);

CREATE TABLE ingredient (
    ingredient_id INT PRIMARY KEY AUTO_INCREMENT,
    ingredient_name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE unit (
    unit_id INT PRIMARY KEY AUTO_INCREMENT,
    unit_type VARCHAR(20) NOT NULL UNIQUE
);

CREATE TABLE tag (
    tag_id INT PRIMARY KEY AUTO_INCREMENT,
    tag_name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE review (
    review_id INT PRIMARY KEY AUTO_INCREMENT,
    rating INT NOT NULL,
    comment TEXT,
    user_id INT NOT NULL,
    recipe_id INT NOT NULL,
    CONSTRAINT chk_review_rating CHECK (rating BETWEEN 1 AND 5),
    CONSTRAINT fk_review_user
        FOREIGN KEY (user_id) REFERENCES users(user_id),
    CONSTRAINT fk_review_recipe
        FOREIGN KEY (recipe_id) REFERENCES recipe(recipe_id),
    CONSTRAINT uq_review_user_recipe UNIQUE (user_id, recipe_id)
);

CREATE TABLE favorites (
    user_id INT NOT NULL,
    recipe_id INT NOT NULL,
    PRIMARY KEY (user_id, recipe_id),
    CONSTRAINT fk_favorites_user
        FOREIGN KEY (user_id) REFERENCES users(user_id),
    CONSTRAINT fk_favorites_recipe
        FOREIGN KEY (recipe_id) REFERENCES recipe(recipe_id)
);

CREATE TABLE recipe_has (
    recipe_id INT NOT NULL,
    tag_id INT NOT NULL,
    PRIMARY KEY (recipe_id, tag_id),
    CONSTRAINT fk_recipe_has_recipe
        FOREIGN KEY (recipe_id) REFERENCES recipe(recipe_id),
    CONSTRAINT fk_recipe_has_tag
        FOREIGN KEY (tag_id) REFERENCES tag(tag_id)
);

CREATE TABLE recipe_contains (
    recipe_id INT NOT NULL,
    ingredient_id INT NOT NULL,
    unit_id INT NOT NULL,
    quantity DECIMAL(6,2) NOT NULL,
    PRIMARY KEY (recipe_id, ingredient_id),
    CONSTRAINT fk_recipe_contains_recipe
        FOREIGN KEY (recipe_id) REFERENCES recipe(recipe_id),
    CONSTRAINT fk_recipe_contains_ingredient
        FOREIGN KEY (ingredient_id) REFERENCES ingredient(ingredient_id),
    CONSTRAINT fk_recipe_contains_unit
        FOREIGN KEY (unit_id) REFERENCES unit(unit_id),
    CONSTRAINT chk_recipe_contains_quantity CHECK (quantity > 0)
);

CREATE TABLE user_ingredient (
    user_id INT NOT NULL,
    ingredient_id INT NOT NULL,
    PRIMARY KEY (user_id, ingredient_id),
    CONSTRAINT fk_user_ingredient_user
        FOREIGN KEY (user_id) REFERENCES users(user_id),
    CONSTRAINT fk_user_ingredient_ingredient
        FOREIGN KEY (ingredient_id) REFERENCES ingredient(ingredient_id)
);

CREATE TABLE blog_post (
    blog_post_id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(150) NOT NULL,
    content TEXT NOT NULL,
    status ENUM('draft', 'published', 'archived') NOT NULL DEFAULT 'draft',
    author_user_id INT NOT NULL,
    recipe_id INT,
    image_name VARCHAR(255),
    image_data LONGTEXT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_blog_post_author
        FOREIGN KEY (author_user_id) REFERENCES users(user_id),
    CONSTRAINT fk_blog_post_recipe
        FOREIGN KEY (recipe_id) REFERENCES recipe(recipe_id)
);
