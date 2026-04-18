//require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pool = require('./db');

const app = express();

app.use(cors());
app.use(express.json());

// test connection
app.get('/test-db', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT NOW() AS now_time');
    res.json({
      success: true,
      message: 'Database connected successfully',
      data: rows
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Database connection failed',
      error: error.message
    });
  }
});

// test search for users
app.get('/users', async (req, res) => {
  try {
    const { name } = req.query;
    let sql = 'SELECT * FROM users';
    const params = [];

    if (name) {
      sql += ' WHERE username LIKE ?';
      params.push(`%${name}%`);
    }

    const [rows] = await pool.execute(sql, params);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/users', async (req, res) => {
  try {
    const { username, role } = req.body;
    const [result] = await pool.execute(
      'INSERT INTO users (username, role) VALUES (?, ?)',
      [username, role]
    );
    res.json({ message: 'Inserted', insertId: result.insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { username, role } = req.body;
    const [result] = await pool.execute(
      'UPDATE users SET username = ?, role = ? WHERE user_id = ?',
      [username, role, id]
    );
    res.json({ message: 'Updated', affectedRows: result.affectedRows });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.execute(
      'DELETE FROM users WHERE user_id = ?',
      [id]
    );
    res.json({ message: 'Deleted', affectedRows: result.affectedRows });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/recipes', async (req, res) => {
  try {
    const { name } = req.query;
    let sql = `
      SELECT
        recipe.recipe_id,
        recipe.name,
        recipe.instruction,
        recipe.status,
        recipe.user_id,
        recipe.cuisine_id,
        users.username,
        cuisine.cuisine_name
      FROM recipe
      JOIN users ON recipe.user_id = users.user_id
      JOIN cuisine ON recipe.cuisine_id = cuisine.cuisine_id
    `;
    const params = [];

    if (name) {
      sql += ' WHERE recipe.name LIKE ?';
      params.push(`%${name}%`);
    }

    sql += ' ORDER BY recipe.recipe_id';

    const [rows] = await pool.execute(sql, params);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/recipes', async (req, res) => {
  try {
    const { name, instruction, status, user_id, cuisine_id } = req.body;
    const [result] = await pool.execute(
      'INSERT INTO recipe (name, instruction, status, user_id, cuisine_id) VALUES (?, ?, ?, ?, ?)',
      [name, instruction, status, user_id, cuisine_id]
    );
    res.json({ message: 'Inserted', insertId: result.insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/recipes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, instruction, status, user_id, cuisine_id } = req.body;
    const [result] = await pool.execute(
      'UPDATE recipe SET name = ?, instruction = ?, status = ?, user_id = ?, cuisine_id = ? WHERE recipe_id = ?',
      [name, instruction, status, user_id, cuisine_id, id]
    );
    res.json({ message: 'Updated', affectedRows: result.affectedRows });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/recipes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.execute(
      'DELETE FROM recipe WHERE recipe_id = ?',
      [id]
    );
    res.json({ message: 'Deleted', affectedRows: result.affectedRows });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/favorites', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        f.user_id,
        u.username,
        f.recipe_id,
        r.name AS recipe_name
      FROM favorites f
      JOIN users u ON f.user_id = u.user_id
      JOIN recipe r ON f.recipe_id = r.recipe_id
      ORDER BY f.user_id
    `);

    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/favorites', async (req, res) => {
  try {
    const { user_id, recipe_id } = req.body;

    const [result] = await pool.execute(
      'INSERT INTO favorites (user_id, recipe_id) VALUES (?, ?)',
      [user_id, recipe_id]
    );

    res.json({
      message: 'Favorite added',
      insertId: result.insertId
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/favorites', async (req, res) => {
  try {
    const { user_id, recipe_id } = req.body;

    const [result] = await pool.execute(
      'DELETE FROM favorites WHERE user_id = ? AND recipe_id = ?',
      [user_id, recipe_id]
    );

    res.json({
      message: 'Favorite removed',
      affectedRows: result.affectedRows
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/ingredients', async (req, res) => {
  try {
    const { name } = req.query;
    let sql = 'SELECT * FROM ingredient';
    const params = [];

    if (name) {
      sql += ' WHERE ingredient_name LIKE ?';
      params.push(`%${name}%`);
    }

    sql += ' ORDER BY ingredient_id';

    const [rows] = await pool.execute(sql, params);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/ingredients', async (req, res) => {
  try {
    const { ingredient_name } = req.body;
    const [result] = await pool.execute(
      'INSERT INTO ingredient (ingredient_name) VALUES (?)',
      [ingredient_name]
    );
    res.json({ message: 'Inserted', insertId: result.insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/ingredients/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { ingredient_name } = req.body;
    const [result] = await pool.execute(
      'UPDATE ingredient SET ingredient_name = ? WHERE ingredient_id = ?',
      [ingredient_name, id]
    );
    res.json({ message: 'Updated', affectedRows: result.affectedRows });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/ingredients/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.execute(
      'DELETE FROM ingredient WHERE ingredient_id = ?',
      [id]
    );
    res.json({ message: 'Deleted', affectedRows: result.affectedRows });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// search for cuisine
app.get('/cuisines', async (req, res) => {
  try {
    const { name } = req.query;

    let sql = 'SELECT * FROM cuisine';
    let params = [];

    if (name) {
      sql += ' WHERE cuisine_name LIKE ?';
      params.push(`%${name}%`);
    }

    const [rows] = await pool.execute(sql, params);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// insert for cuisine
app.post('/cuisines', async (req, res) => {
  try {
    const { cuisine_name } = req.body;

    const [result] = await pool.execute(
      'INSERT INTO cuisine (cuisine_name) VALUES (?)',
      [cuisine_name]
    );

    res.json({
      message: 'Inserted',
      insertId: result.insertId
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// update for cuisine
app.put('/cuisines/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { cuisine_name } = req.body;

    const [result] = await pool.execute(
      'UPDATE cuisine SET cuisine_name = ? WHERE cuisine_id = ?',
      [cuisine_name, id]
    );

    res.json({
      message: 'Updated',
      affectedRows: result.affectedRows
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/cuisines/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.execute(
      'DELETE FROM cuisine WHERE cuisine_id = ?',
      [id]
    );

    res.json({
      message: 'Deleted',
      affectedRows: result.affectedRows
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/reviews', async (req, res) => {
  try {
    const { recipe_id } = req.query;
    let sql = `
      SELECT r.review_id, r.rating, r.comment, r.user_id, r.recipe_id,
             u.username, rec.name AS recipe_name
      FROM review r
      JOIN users u ON r.user_id = u.user_id
      JOIN recipe rec ON r.recipe_id = rec.recipe_id
    `;
    const params = [];
    if (recipe_id) {
      sql += ' WHERE r.recipe_id = ?';
      params.push(recipe_id);
    }
    sql += ' ORDER BY r.review_id DESC';
    const [rows] = await pool.execute(sql, params);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/reviews', async (req, res) => {
  try {
    const { rating, comment, user_id, recipe_id } = req.body;
    const [result] = await pool.execute(
      'INSERT INTO review (rating, comment, user_id, recipe_id) VALUES (?, ?, ?, ?)',
      [rating, comment || null, user_id, recipe_id]
    );
    res.json({ message: 'Review inserted', insertId: result.insertId });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'This user has already reviewed this recipe.' });
    }
    res.status(500).json({ error: error.message });
  }
});

app.put('/reviews/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;
    const [result] = await pool.execute(
      'UPDATE review SET rating = ?, comment = ? WHERE review_id = ?',
      [rating, comment || null, id]
    );
    res.json({ message: 'Review updated', affectedRows: result.affectedRows });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/reviews/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.execute(
      'DELETE FROM review WHERE review_id = ?', [id]
    );
    res.json({ message: 'Review deleted', affectedRows: result.affectedRows });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/reviews/avg/:recipe_id', async (req, res) => {
  try {
    const { recipe_id } = req.params;
    const [rows] = await pool.execute(
      `SELECT COUNT(*) AS total_reviews, ROUND(AVG(rating), 1) AS avg_rating
       FROM review WHERE recipe_id = ?`,
      [recipe_id]
    );
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});