USE little_chef;

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
