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

INSERT INTO users (username, role) VALUES
('alice_home', 'user'),
('ben_bakes', 'chef'),
('carla_cooks', 'user'),
('dan_admin', 'admin'),
('ella_eats', 'user'),
('finn_flavor', 'chef'),
('gina_gourmet', 'user'),
('henry_home', 'user'),
('ivy_italian', 'chef'),
('jack_junior', 'user'),
('kira_kitchen', 'user'),
('liam_ladle', 'chef'),
('mona_meals', 'user'),
('nina_nutrition', 'admin'),
('owen_oven', 'user'),
('paula_plate', 'user'),
('quentin_quick', 'chef'),
('riley_recipe', 'user'),
('sara_spice', 'user'),
('tom_taste', 'user'),
('uma_umami', 'chef'),
('victor_vegan', 'user'),
('wendy_whisk', 'user'),
('xena_xpress', 'user'),
('yara_yum', 'chef'),
('zack_zest', 'user'),
('amy_apron', 'user'),
('brad_bistro', 'chef'),
('claire_chef', 'user'),
('dylan_dish', 'user');

INSERT INTO cuisine (cuisine_name) VALUES
('Italian'),
('Chinese'),
('Mexican'),
('American'),
('Indian'),
('Mediterranean'),
('Japanese'),
('French'),
('Thai'),
('Korean'),
('Vietnamese'),
('Spanish'),
('Greek'),
('Turkish'),
('Lebanese'),
('Moroccan'),
('German'),
('Brazilian'),
('Caribbean'),
('Ethiopian'),
('Filipino'),
('Peruvian'),
('Middle Eastern'),
('Southern'),
('Tex-Mex'),
('Fusion'),
('Seafood'),
('BBQ'),
('Vegetarian'),
('Polish');

INSERT INTO ingredient (ingredient_name) VALUES
('flour'),
('egg'),
('milk'),
('salt'),
('sugar'),
('butter'),
('olive oil'),
('garlic'),
('onion'),
('tomato'),
('chicken breast'),
('ground beef'),
('rice'),
('pasta'),
('cheddar cheese'),
('mozzarella'),
('black beans'),
('bell pepper'),
('carrot'),
('potato'),
('spinach'),
('mushroom'),
('basil'),
('oregano'),
('cumin'),
('paprika'),
('soy sauce'),
('ginger'),
('lemon'),
('yogurt');

INSERT INTO unit (unit_type) VALUES
('cup'),
('tbsp'),
('tsp'),
('g'),
('ml'),
('piece');

INSERT INTO tag (tag_name) VALUES
('quick'),
('vegan'),
('spicy'),
('healthy'),
('breakfast'),
('dinner'),
('dessert'),
('high-protein');

INSERT INTO recipe (name, instruction, status, user_id, cuisine_id) VALUES
('Garlic Butter Pasta', 'Boil pasta. Melt butter with garlic. Toss together and serve.', 'published', 2, 1),
('Veggie Fried Rice', 'Cook rice, stir-fry vegetables, add soy sauce, then combine.', 'published', 6, 2),
('Chicken Tacos', 'Cook chicken with spices, fill tortillas, and top as desired.', 'published', 9, 3),
('Classic Pancakes', 'Mix batter, pour on griddle, flip when bubbly, and serve.', 'published', 1, 4),
('Spinach Curry', 'Cook onions and spices, add spinach and simmer until tender.', 'published', 17, 5),
('Lemon Herb Chicken', 'Season chicken, bake with lemon and herbs until done.', 'published', 21, 6),
('Mushroom Omelet', 'Cook mushrooms, add beaten eggs, fold, and serve warm.', 'published', 5, 4),
('Tomato Basil Pasta', 'Simmer tomatoes with garlic and basil, mix with pasta.', 'published', 8, 1),
('Bean Burrito Bowl', 'Layer rice, beans, vegetables, and toppings in a bowl.', 'published', 25, 3),
('Veggie Stir Fry', 'Stir-fry mixed vegetables and season with soy sauce and ginger.', 'published', 12, 2),
('Cheesy Baked Potato', 'Bake potato, stuff with cheese, and heat until melted.', 'published', 13, 4),
('Chicken Rice Soup', 'Simmer chicken, rice, vegetables, and broth until tender.', 'published', 18, 4),
('Mediterranean Salad', 'Combine vegetables, lemon, olive oil, and herbs.', 'published', 28, 6),
('French Toast', 'Dip bread in egg mixture and cook until golden.', 'published', 3, 8),
('Spicy Tomato Rice', 'Cook rice with tomatoes, spices, and peppers.', 'published', 7, 5),
('Creamy Mushroom Pasta', 'Cook mushrooms in butter, add milk, and toss with pasta.', 'published', 11, 1),
('Veggie Quesadilla', 'Fill tortilla with vegetables and cheese, then grill.', 'published', 15, 3),
('Egg Fried Rice', 'Scramble eggs, stir-fry with rice and soy sauce.', 'published', 20, 2),
('Basil Chicken Pasta', 'Cook chicken, basil, and pasta together with seasoning.', 'published', 22, 1),
('Healthy Yogurt Bowl', 'Top yogurt with fruit and extras, then serve chilled.', 'published', 24, 6),
('Garlic Lemon Rice', 'Cook rice and finish with garlic, lemon, and herbs.', 'published', 26, 6),
('Stuffed Bell Peppers', 'Fill peppers with rice and meat, then bake.', 'published', 27, 4),
('Homestyle Scrambled Eggs', 'Whisk eggs and cook slowly with butter.', 'published', 29, 4),
('Roasted Veggie Medley', 'Roast assorted vegetables with oil and seasonings.', 'published', 30, 6),
('Simple Tomato Soup', 'Simmer tomato, onion, and seasoning, then blend.', 'published', 4, 4),
('Chicken Curry Bowl', 'Cook chicken with curry spices and serve over rice.', 'published', 10, 5),
('Cheese Pasta Bake', 'Bake pasta with tomato sauce and mozzarella.', 'published', 14, 1),
('Quick Breakfast Skillet', 'Cook potatoes, eggs, and peppers in one pan.', 'published', 16, 4),
('Vegan Rice Bowl', 'Combine rice, beans, vegetables, and spices.', 'published', 19, 6),
('Herb Butter Chicken', 'Pan-sear chicken with garlic butter and herbs.', 'published', 23, 8);

INSERT INTO review (rating, comment, user_id, recipe_id) VALUES
(5, 'Easy and delicious.', 1, 1),
(4, 'Very tasty for lunch.', 3, 2),
(5, 'Family loved it.', 5, 3),
(4, 'Perfect breakfast recipe.', 7, 4),
(5, 'Great spice balance.', 8, 5),
(4, 'Bright and fresh flavor.', 10, 6),
(5, 'Quick morning meal.', 11, 7),
(4, 'Simple weeknight pasta.', 13, 8),
(5, 'Filling and healthy.', 15, 9),
(4, 'Nice vegetable mix.', 16, 10),
(5, 'Comfort food done right.', 18, 11),
(4, 'Good soup for cold days.', 19, 12),
(5, 'Fresh and light.', 20, 13),
(4, 'Classic breakfast option.', 22, 14),
(5, 'Loved the spice.', 24, 15),
(5, 'Rich and creamy.', 2, 16),
(4, 'Very crispy.', 4, 17),
(5, 'Great use of leftovers.', 6, 18),
(4, 'Fresh basil smells fresh.', 9, 19),
(5, 'Heathy and yummy.', 12, 20),
(4, 'Simple side dish.', 14, 21),
(5, 'Healthy and colorful.', 17, 22),
(4, 'Soft eggs and nice texture.', 21, 23),
(5, 'Excellent roasted flavor.', 23, 24),
(4, 'Love the smoke flavor.', 25, 25),
(5, 'Perfect curry.', 26, 26),
(4, 'Cheesy and creamy.', 27, 27),
(5, 'Great breakfast option.', 28, 28),
(4, 'Balanced and budget friendly.', 29, 29),
(5, 'Sweet and spicy.', 30, 30);

INSERT INTO favorites (user_id, recipe_id) VALUES
(1, 2), (1, 4), (2, 1), (3, 3), (4, 5), (5, 6), (6, 7), (7, 8), (8, 9), (9, 10),
(10, 11), (11, 12), (12, 13), (13, 14), (14, 15), (15, 16), (16, 17), (17, 18), (18, 19), (19, 20),
(20, 21), (21, 22), (22, 23), (23, 24), (24, 25), (25, 26), (26, 27), (27, 28), (28, 29), (29, 30);

INSERT INTO recipe_has (recipe_id, tag_id) VALUES
(1, 1), (1, 6),
(2, 1), (2, 4),
(3, 6), (3, 8),
(4, 5),
(5, 2), (5, 3),
(6, 4), (6, 8),
(7, 5),
(8, 1),
(9, 2), (9, 4),
(10, 1), (10, 2),
(11, 6),
(12, 4),
(13, 4),
(14, 5),
(15, 3),
(16, 6),
(17, 1),
(18, 1),
(19, 8),
(20, 4),
(21, 4),
(22, 6),
(23, 5),
(24, 2),
(25, 4),
(26, 3),
(27, 6),
(28, 5),
(29, 2),
(30, 8);

INSERT INTO recipe_contains (recipe_id, ingredient_id, unit_id, quantity) VALUES
(1, 14, 1, 2.00), (1, 6, 2, 2.00), (1, 8, 2, 1.00),
(2, 13, 1, 2.00), (2, 9, 6, 1.00), (2, 18, 6, 1.00), (2, 27, 2, 1.00),
(3, 11, 4, 300.00), (3, 18, 6, 1.00), (3, 25, 3, 1.00),
(4, 1, 1, 1.50), (4, 2, 6, 2.00), (4, 3, 1, 1.00), (4, 5, 2, 2.00),
(5, 21, 4, 200.00), (5, 9, 6, 1.00), (5, 25, 3, 1.00),
(6, 11, 4, 250.00), (6, 29, 6, 1.00), (6, 23, 2, 1.00),
(7, 2, 6, 3.00), (7, 22, 4, 100.00), (7, 6, 2, 1.00),
(8, 10, 4, 250.00), (8, 23, 2, 1.00), (8, 14, 1, 2.00),
(9, 13, 1, 1.50), (9, 17, 1, 1.00), (9, 18, 6, 1.00),
(10, 18, 6, 1.00), (10, 19, 6, 1.00), (10, 27, 2, 1.00), (10, 28, 3, 1.00),
(11, 20, 6, 1.00), (11, 15, 4, 100.00),
(12, 11, 4, 200.00), (12, 13, 1, 1.00), (12, 19, 6, 1.00),
(13, 10, 6, 2.00), (13, 29, 6, 1.00), (13, 7, 2, 1.00),
(14, 2, 6, 2.00), (14, 3, 1, 0.50), (14, 5, 2, 1.00),
(15, 13, 1, 1.50), (15, 10, 4, 150.00), (15, 18, 6, 1.00),
(16, 22, 4, 150.00), (16, 3, 1, 1.00), (16, 14, 1, 2.00),
(17, 18, 6, 1.00), (17, 15, 4, 80.00), (17, 16, 4, 80.00),
(18, 2, 6, 2.00), (18, 13, 1, 2.00), (18, 27, 2, 1.00),
(19, 11, 4, 200.00), (19, 14, 1, 2.00), (19, 23, 2, 1.00),
(20, 30, 1, 1.00), (20, 29, 6, 1.00),
(21, 13, 1, 1.50), (21, 8, 2, 1.00), (21, 29, 6, 1.00),
(22, 18, 6, 3.00), (22, 13, 1, 1.00), (22, 12, 4, 150.00),
(23, 2, 6, 3.00), (23, 6, 2, 1.00),
(24, 18, 6, 1.00), (24, 19, 6, 1.00), (24, 20, 6, 1.00),
(25, 10, 4, 300.00), (25, 9, 6, 1.00), (25, 8, 2, 1.00),
(26, 11, 4, 250.00), (26, 13, 1, 1.00), (26, 25, 3, 1.00),
(27, 14, 1, 2.00), (27, 16, 4, 120.00), (27, 10, 4, 150.00),
(28, 20, 6, 1.00), (28, 2, 6, 2.00), (28, 18, 6, 1.00),
(29, 13, 1, 1.00), (29, 17, 1, 1.00), (29, 18, 6, 1.00),
(30, 11, 4, 250.00), (30, 6, 2, 1.00), (30, 8, 2, 1.00);

INSERT INTO user_ingredient (user_id, ingredient_id) VALUES
(1, 1), (1, 2), (1, 3), (1, 4), (1, 5),
(2, 8), (2, 10), (2, 14),
(3, 13), (3, 17), (3, 18),
(4, 11), (4, 25),
(5, 2), (5, 22),
(6, 20), (6, 15),
(7, 21), (7, 9),
(8, 29), (8, 23),
(9, 11), (9, 14),
(10, 18), (10, 19),
(11, 10), (11, 8),
(12, 30), (12, 29),
(13, 13), (13, 27),
(14, 12), (14, 18),
(15, 6), (15, 2);

SELECT 'users' AS table_name, COUNT(*) AS row_count FROM users
UNION ALL
SELECT 'recipe', COUNT(*) FROM recipe
UNION ALL
SELECT 'ingredient', COUNT(*) FROM ingredient
UNION ALL
SELECT 'cuisine', COUNT(*) FROM cuisine
UNION ALL
SELECT 'review', COUNT(*) FROM review
UNION ALL
SELECT 'favorites', COUNT(*) FROM favorites
UNION ALL
SELECT 'recipe_has', COUNT(*) FROM recipe_has
UNION ALL
SELECT 'recipe_contains', COUNT(*) FROM recipe_contains
UNION ALL
SELECT 'user_ingredient', COUNT(*) FROM user_ingredient;
