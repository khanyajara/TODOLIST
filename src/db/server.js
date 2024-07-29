const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const sqlite3 = require("better-sqlite3");
const path = require("path");

const app = express();
const port = process.env.PORT || 3000;

// SQLite database initialization
const dbPath = path.join(__dirname, "database.db");
const db = new sqlite3(dbPath);

// Middleware setup
app.use(cors());
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
      priority TEXT CHECK (priority IN ('high', 'medium', 'low')),
      timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      completed BOOLEAN NOT NULL DEFAULT 0,
      user_id INTEGER,
      FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE
    )
  `;
  db.exec(sql);
};
createTaskTable();

// Handle user registration
app.post(
  "/register",
  [
    body("firstname").isString().trim().notEmpty().escape(),
    body("lastname").isString().trim().notEmpty().escape(),
    body("email").isEmail().normalizeEmail(),
    body("password").isLength({ min: 6 }).escape(),
    body("confirmPassword").custom((value, { req }) => value === req.body.password)
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { firstname, lastname, email, password } = req.body;
    try {
      // Check if user already exists
      const existingUser = db.prepare("SELECT * FROM user WHERE email = ?").get(email);
      if (existingUser) {
        return res.status(400).json({ error: "User already exists with this email" });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 12);

      // Insert new user into database
      const insertUser = db.prepare(
        "INSERT INTO user (firstname, lastname, email, password) VALUES (?, ?, ?, ?)"
      );
      const result = insertUser.run(firstname, lastname, email, hashedPassword);

      if (result.changes === 1) {
        res.status(200).json({ message: "Registration successful" });
      } else {
        throw new Error("Failed to insert user");
      }
    } catch (error) {
      console.error("Error registering user:", error);
      res.status(500).json({ error: "Error registering user" });
    }
  }
);

// Handle user login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = db.prepare("SELECT * FROM user WHERE email = ?").get(email);

  if (user && await bcrypt.compare(password, user.password)) {
    res.json({ message: 'Login successful', user: { ...user, id: user.id } });
  } else {
    res.status(401).json({ error: 'Invalid email or password' });
  }
});

// Create a new task
app.post('/tasks', [
  body('name').isString().trim().notEmpty().escape(),
  body('description').optional().isString().trim().escape(),
  body('priority').isIn(['high', 'medium', 'low']),
  body('user_id').isInt()
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, description, priority, user_id } = req.body;
  
  // Validate user_id exists
  const user = db.prepare("SELECT * FROM user WHERE id = ?").get(user_id);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  try {
    const insertTask = db.prepare(
      "INSERT INTO task (name, description, priority, user_id) VALUES (?, ?, ?, ?)"
    );
    const result = insertTask.run(name, description, priority, user_id);

    if (result.changes === 1) {
      res.status(201).json({ message: "Task created successfully" });
    } else {
      throw new Error("Failed to insert task");
    }
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({ error: "Error creating task" });
  }
});

// Retrieve all tasks for a specific user
app.get('/tasks', async (req, res) => {
  const userId = req.query.user_id;

  if (!userId) {
    return res.status(400).json({ error: 'Missing user ID' });
  }

  try {
    const tasks = db.prepare("SELECT * FROM task WHERE user_id = ?").all(userId);
    res.json({ tasks });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Error fetching tasks' });
  }
});

// Update a task
app.put('/tasks/:id', [
  body('name').optional().isString().trim().notEmpty().escape(),
  body('description').optional().isString().trim().escape(),
  body('priority').optional().isIn(['high', 'medium', 'low']),
  body('completed').optional().isBoolean()
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, description, priority, completed } = req.body;
  try {
    const updateTask = db.prepare(
      "UPDATE task SET name = ?, description = ?, priority = ?, completed = ? WHERE id = ?"
    );
    const result = updateTask.run(name, description, priority, completed, req.params.id);

    if (result.changes === 1) {
      res.json({ message: "Task updated successfully" });
    } else {
      res.status(404).json({ error: "Task not found" });
    }
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({ error: "Error updating task" });
  }
});

// Delete a task
app.delete('/tasks/:id', (req, res) => {
  try {
    const deleteTask = db.prepare("DELETE FROM task WHERE id = ?");
    const result = deleteTask.run(req.params.id);

    if (result.changes === 1) {
      res.json({ message: "Task deleted successfully" });
    } else {
      res.status(404).json({ error: "Task not found" });
    }
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({ error: "Error deleting task" });
  }
});

// Retrieve all users
app.get('/users', (req, res) => {
  try {
    const users = db.prepare("SELECT * FROM user").all();
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Error fetching users' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});