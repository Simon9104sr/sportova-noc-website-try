const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../db/connection');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { email, username, password, full_name } = req.body;

    if (!email || !username || !password) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const conn = await pool.getConnection();
    
    // Check if user exists
    const [rows] = await conn.query('SELECT * FROM users WHERE email = ? OR username = ?', [email, username]);
    if (rows.length > 0) {
      conn.release();
      return res.status(400).json({ message: 'Email or username already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    await conn.query(
      'INSERT INTO users (email, username, password_hash, full_name) VALUES (?, ?, ?, ?)',
      [email, username, hashedPassword, full_name || username]
    );

    const [newUser] = await conn.query('SELECT id, email, username, full_name FROM users WHERE email = ?', [email]);
    conn.release();

    const token = jwt.sign({ id: newUser[0].id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });

    res.status(201).json({ 
      message: 'User registered successfully', 
      user: newUser[0],
      token 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }

    const conn = await pool.getConnection();
    const [rows] = await conn.query('SELECT * FROM users WHERE email = ?', [email]);
    conn.release();

    if (rows.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = rows[0];
    const passwordMatch = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });

    res.json({
      message: 'Login successful',
      user: { id: user.id, email: user.email, username: user.username, full_name: user.full_name },
      token
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
});

// Get current user profile
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const conn = await pool.getConnection();
    const [rows] = await conn.query('SELECT id, email, username, full_name, bio, phone, city, created_at FROM users WHERE id = ?', [req.userId]);
    conn.release();

    if (rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch user', error: error.message });
  }
});

module.exports = router;