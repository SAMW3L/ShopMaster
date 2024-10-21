// server.js
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 5000; // Define the port for the server

// Middleware
app.use(cors());
app.use(bodyParser.json());

// PostgreSQL pool connection
const pool = new Pool({
  user: 'shop_admin', // Your PostgreSQL user
  host: 'localhost', // The host, usually localhost
  database: 'supermarket_db', // Your PostgreSQL database
  password: 'your_password', // Your PostgreSQL password
  port: 5432, // Default PostgreSQL port
});

// Route to fetch all products
app.get('/products', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products');
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Route to add a new product (admin feature)
app.post('/products', async (req, res) => {
  const { name, category, price, stock } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO products (name, category, price, stock) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, category, price, stock]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error adding product');
  }
});

// Route to update stock (when items are added to cart)
app.put('/products/:id/stock', async (req, res) => {
  const { id } = req.params;
  const { stock } = req.body;
  try {
    const result = await pool.query(
      'UPDATE products SET stock = $1 WHERE id = $2 RETURNING *',
      [stock, id]
    );
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error updating stock');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
