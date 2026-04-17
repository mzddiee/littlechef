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
    const [rows] = await pool.query('SELECT * FROM users');
    res.json(rows);
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