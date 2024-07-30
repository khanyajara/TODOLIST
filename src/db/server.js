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
const createTask = () => {
  const sql = `
    CREATE TABLE IF NOT EXISTS task (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      priority TEXT CHECK (priority IN('high', 'medium', 'low')),
      timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      completed BOOLEAN NOT NULL DEFAULT 0,
      user_id INTEGER,
      FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE
    )
  `;
  db.prepare(sql).run();
};
createTask();

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
    res.json({ message: 'Login successful', user });
  } else {
    res.status(401).json({ error: 'Invalid email or password' });
  }
});

// Create a new task
app.post('/tasks', [
  body('name').isString().trim().notEmpty().escape(),
  body('description').optional().isString().trim().escape(),
  body('priority').isInt({ min:1, max: 5}),
  body('user_id').optional().isInt()
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, description, priority, user_id } = req.body;
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

let tasks = []; // Example in-memory store

// POST route to add a new task
app.post('/tasks', (req, res) => {
  const { name, description, priority, completed } = req.body;
  
  if (!name || typeof name !== 'string') {
    return res.status(400).json({ error: 'Invalid task name' });
  }

  const newTask = {
    id: tasks.length + 1, // Simple ID generation
    name,
    description,
    priority,
    completed
  };

  tasks.push(newTask);
  res.status(201).json(newTask);
});

// Retrieve all tasks
app.get('/tasks', (req, res) => {
  const tasks = db.prepare("SELECT * FROM task").all();
  res.json(tasks);
});

// Retrieve a task by ID
app.get('/tasks/:id', (req, res) => {
  const task = db.prepare("SELECT * FROM task WHERE id = ?").get(req.params.id);
  if (task) {
    res.json(task);
  } else {
    res.status(404).json({ error: "Task not found" });
  }
});

// Update a task
app.put('/tasks/:id', [
  body('name').optional().isString().trim().notEmpty().escape(),
  body('description').optional().isString().trim().escape(),
  body('priority').optional().isInt({ min: 1, max: 5 }),
  body('completed').optional().isBoolean()
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, description, priority, completed } = req.body;
  const updateTask = db.prepare(
    "UPDATE task SET name = ?, description = ?, priority = ?, completed = ? WHERE id = ?"
  );
  const result = updateTask.run(name, description, priority, completed, req.params.id);

  if (result.changes === 1) {
    res.json({ message: "Task updated successfully" });
  } else {
    res.status(404).json({ error: "Task not found" });
  }
});

// Delete a task
app.delete('/tasks/:id', (req, res) => {
  const deleteTask = db.prepare("DELETE FROM task WHERE id = ?");
  const result = deleteTask.run(req.params.id);

  if (result.changes === 1) {
    res.json({ message: "Task deleted successfully" });
  } else {
    res.status(404).json({ error: "Task not found" });
  }
});

// Retrieve all users
app.get('/users', (req, res) => {
  const users = db.prepare("SELECT * FROM user").all();
  res.json(users);
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});