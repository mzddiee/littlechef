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