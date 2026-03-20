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

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});