const express = require('express');
const cors = require('cors');
const pool = require('./db');

const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));

function normalizeUploadPayload(body) {
  return {
    image_name: body.image_name || null,
    image_data: body.image_data || null
  };
}

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
        recipe.image_name,
        recipe.image_data,
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
    const { image_name, image_data } = normalizeUploadPayload(req.body);
    const [result] = await pool.execute(
      'INSERT INTO recipe (name, instruction, status, user_id, cuisine_id, image_name, image_data) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [name, instruction, status, user_id, cuisine_id, image_name, image_data]
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
    const { image_name, image_data } = normalizeUploadPayload(req.body);
    const [result] = await pool.execute(
      'UPDATE recipe SET name = ?, instruction = ?, status = ?, user_id = ?, cuisine_id = ?, image_name = ?, image_data = ? WHERE recipe_id = ?',
      [name, instruction, status, user_id, cuisine_id, image_name, image_data, id]
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

app.get('/blog-posts', async (req, res) => {
  try {
    const { title } = req.query;
    let sql = `
      SELECT
        blog_post.blog_post_id,
        blog_post.title,
        blog_post.content,
        blog_post.status,
        blog_post.author_user_id,
        blog_post.recipe_id,
        blog_post.image_name,
        blog_post.image_data,
        blog_post.created_at,
        blog_post.updated_at,
        users.username AS author_username,
        recipe.name AS recipe_name
      FROM blog_post
      JOIN users ON blog_post.author_user_id = users.user_id
      LEFT JOIN recipe ON blog_post.recipe_id = recipe.recipe_id
    `;
    const params = [];

    if (title) {
      sql += ' WHERE blog_post.title LIKE ?';
      params.push(`%${title}%`);
    }

    sql += ' ORDER BY blog_post.blog_post_id DESC';

    const [rows] = await pool.execute(sql, params);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/blog-posts', async (req, res) => {
  try {
    const { title, content, status, author_user_id, recipe_id } = req.body;
    const { image_name, image_data } = normalizeUploadPayload(req.body);
    const [result] = await pool.execute(
      `INSERT INTO blog_post
       (title, content, status, author_user_id, recipe_id, image_name, image_data)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        title,
        content,
        status,
        author_user_id,
        recipe_id || null,
        image_name,
        image_data
      ]
    );

    res.json({ message: 'Inserted', insertId: result.insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/blog-posts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, status, author_user_id, recipe_id } = req.body;
    const { image_name, image_data } = normalizeUploadPayload(req.body);
    const [result] = await pool.execute(
      `UPDATE blog_post
       SET title = ?, content = ?, status = ?, author_user_id = ?, recipe_id = ?, image_name = ?, image_data = ?
       WHERE blog_post_id = ?`,
      [
        title,
        content,
        status,
        author_user_id,
        recipe_id || null,
        image_name,
        image_data,
        id
      ]
    );

    res.json({ message: 'Updated', affectedRows: result.affectedRows });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/blog-posts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.execute(
      'DELETE FROM blog_post WHERE blog_post_id = ?',
      [id]
    );

    res.json({ message: 'Deleted', affectedRows: result.affectedRows });
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

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
