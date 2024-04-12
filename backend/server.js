const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

app.use(cors());
app.use(express.json());

// Example: Error handling in GET /api/transactions
app.get('/api/transactions', async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM transactions ORDER BY id DESC');
      res.json({ transactions: result.rows });
    } catch (error) {
      console.error('Error fetching transactions:', error.message); // Log detailed error message
      res.status(500).json({ error: 'Failed to fetch transactions' }); // Send meaningful error response to client
    }
  });
  
  // Example: Error handling in POST /api/transactions
  app.post('/api/transactions', async (req, res) => {
    const { description, amount, type } = req.body;
    try {
      const result = await pool.query(
        'INSERT INTO transactions (description, amount, type) VALUES ($1, $2, $3) RETURNING *',
        [description, amount, type]
      );
      res.json(result.rows[0]);
    } catch (error) {
      console.error('Error adding transaction:', error.message); // Log detailed error message
      res.status(500).json({ error: 'Failed to add transaction' }); // Send meaningful error response to client
    }
  });
  

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
