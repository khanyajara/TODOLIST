const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { body, validationResult } = require('express-validator');
const sqlite3 = require('better-sqlite3');
const path = require('path');
const bcrypt = require('bcrypt');

const app = express();
const port = 5000;

// Database setup
const dbPath = path.join(__dirname, 'database.db');
const db = new sqlite3(dbPath);

// CORS options
const corsOptions = {
  origin: 'http://localhost:3000', // Your React app's URL
  credentials: true, // Allow credentials (cookies, authorization headers)
};

// Middleware
app.use(cors(corsOptions)); // Use cors with specified options
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Create user table if not exists
const createUserTable = () => {
  const sql = `
    CREATE TABLE IF NOT EXISTS user (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      firstname TEXT NOT NULL,
      lastname TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL
    )
  `;
  db.exec(sql);
};

createUserTable();

// Handle user registration
app.post(
  '/register',
  [
    body('firstname').isString().trim().notEmpty().escape(),
    body('lastname').isString().trim().notEmpty().escape(),
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }).escape(),
    body('confirmPassword').custom((value, { req }) => value === req.body.password).withMessage('Passwords do not match'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { firstname, lastname, email, password } = req.body;

    const existingUser = db.prepare('SELECT * FROM user WHERE email = ?').get(email);
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists with this email' });
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const insertUser = db.prepare('INSERT INTO user (firstname, lastname, email, password) VALUES (?, ?, ?, ?)');
      const result = insertUser.run(firstname, lastname, email, hashedPassword);

      if (result.changes === 1) {
        res.status(201).json({ message: 'Registration successful' });
      } else {
        res.status(500).json({ error: 'Failed to insert user' });
      }
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

// Login endpoint
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  console.log('Login attempt:', { email, password });

  // Find user by email
  const user = db.prepare('SELECT * FROM user WHERE email = ?').get(email);
  if (!user) {
    console.log('User not found');
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  try {
    // Compare the provided password with the stored password
    const passwordMatch = await bcrypt.compare(password, user.password);
    console.log('Password match:', passwordMatch); // Debug line

    if (passwordMatch) {
      // On successful login, return user details (omit sensitive info)
      res.json({ message: 'Login successful', user: { id: user.id, firstname: user.firstname, lastname: user.lastname, email: user.email } });
    } else {
      console.log('Invalid password');
      res.status(401).json({ error: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
