const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const sqlite3 = require('better-sqlite3');
const path = require('path');
const jwt = require('jsonwebtoken');

const app = express();
const port = process.env.PORT || 3000;
const secretKey = 'your_secret_key'; // You should store this in an environment variable

// SQLite database initialization
const dbPath = path.join(__dirname, 'database.db');
const db = new sqlite3(dbPath);

// Configure CORS to allow requests from the specific origin
const corsOptions = {
  origin: 'http://localhost:3001', // Your frontend's origin
  methods: 'GET,POST,PUT,DELETE',
  allowedHeaders: 'Content-Type,Authorization',
  credentials: true,
};
app.use(cors(corsOptions));

// Middleware setup
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

// Create task table if not exists
const createTaskTable = () => {
  const sql = `
    CREATE TABLE IF NOT EXISTS task (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      priority TEXT CHECK (priority IN('high', 'medium', 'low')),
      timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      completed BOOLEAN NOT NULL DEFAULT 0,
      user_id INTEGER NOT NULL,
      FOREIGN KEY (user_id) REFERENCES user(id)
    )
  `;
  db.exec(sql);
};

createTaskTable();

// Handle user registration
app.post(
  '/register',
  [
    body('firstname').isString().trim().notEmpty().escape(),
    body('lastname').isString().trim().notEmpty().escape(),
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }).escape(),
    body('confirmPassword').custom((value, { req }) => value === req.body.password),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { firstname, lastname, email, password } = req.body;
    try {
      // Check if user already exists
      const existingUser = db.prepare('SELECT * FROM user WHERE email = ?').get(email);
      if (existingUser) {
        return res.status(400).json({ error: 'User already exists with this email' });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 12);

      // Insert new user into database
      const insertUser = db.prepare('INSERT INTO user (firstname, lastname, email, password) VALUES (?, ?, ?, ?)');
      const result = insertUser.run(firstname, lastname, email, hashedPassword);

      if (result.changes === 1) {
        res.status(200).json({ message: 'Registration successful' });
      } else {
        throw new Error('Failed to insert user');
      }
    } catch (error) {
      console.error('Error registering user:', error);
      res.status(500).json({ error: 'Error registering user' });
    }
  }
);

// Handle user login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = db.prepare('SELECT * FROM user WHERE email = ?').get(email);

  if (user && (await bcrypt.compare(password, user.password))) {
    // Generate a JWT token
    const token = jwt.sign({ userId: user.id }, secretKey, { expiresIn: '1h' });
    res.json({ message: 'Login successful', token });
  } else {
    res.status(401).json({ error: 'Invalid email or password' });
  }
});

// Middleware to check if the user is authenticated
const isAuthenticated = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    jwt.verify(token, secretKey, (err, user) => {
      if (err) {
        return res.status(403).json({ error: 'Forbidden' });
      }
      req.user = user;
      next();
    });
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
};

// Create a new task
app.post(
  '/tasks',
  isAuthenticated,
  [
    body('name').isString().trim().notEmpty().escape(),
    body('description').optional().isString().trim().escape(),
    body('priority').isInt({ min: 1, max: 5 }),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, description, priority } = req.body;
    const userId = req.user.userId;

    try {
      const insertTask = db.prepare('INSERT INTO task (name, description, priority, user_id) VALUES (?, ?, ?, ?)');
      const result = insertTask.run(name, description, priority, userId);

      if (result.changes === 1) {
        res.status(201).json({ message: 'Task created successfully' });
      } else {
        throw new Error('Failed to insert task');
      }
    } catch (error) {
      console.error('Error creating task:', error);
      res.status(500).json({ error: 'Error creating task' });
    }
  }
);

// Retrieve tasks for a user
app.get('/tasks', isAuthenticated, (req, res) => {
  const userId = req.user.userId;
  try {
    const stmt = db.prepare('SELECT * FROM task WHERE user_id = ?');
    const tasks = stmt.all(userId);
    res.status(200).json({ tasks });
  } catch (err) {
    res.status(500).send('Error fetching tasks');
  }
});

// Update a task
app.put(
  '/tasks/:id',
  isAuthenticated,
  [
    body('name').optional().isString().trim().notEmpty().escape(),
    body('description').optional().isString().trim().escape(),
    body('priority').optional().isInt({ min: 1, max: 5 }),
    body('completed').optional().isBoolean(),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, description, priority, completed } = req.body;
    const updateTask = db.prepare(
      'UPDATE task SET name = ?, description = ?, priority = ?, completed = ? WHERE id = ? AND user_id = ?'
    );
    const result = updateTask.run(name, description, priority, completed, req.params.id, req.user.userId);

    if (result.changes === 1) {
      res.json({ message: 'Task updated successfully' });
    } else {
      res.status(404).json({ error: 'Task not found' });
    }
  }
);

// Delete a task
app.delete('/tasks/:id', isAuthenticated, (req, res) => {
  const deleteTask = db.prepare('DELETE FROM task WHERE id = ? AND user_id = ?');
  const result = deleteTask.run(req.params.id, req.user.userId);

  if (result.changes === 1) {
    res.json({ message: 'Task deleted successfully' });
  } else {
    res.status(404).json({ error: 'Task not found' });
  }
});

// Delete account route
app.delete('/users/:id', isAuthenticated, (req, res) => {
  const userId = req.params.id;

  // First, delete all tasks associated with the user
  db.prepare('DELETE FROM task WHERE user_id = ?').run(userId);

  // Then, delete the user
  const result = db.prepare('DELETE FROM user WHERE id = ?').run(userId);

  if (result.changes === 1) {
    res.status(200).json({ message: 'Account deleted successfully' });
  } else {
    res.status(404).json({ error: 'User not found' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
