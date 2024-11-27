const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { body, validationResult } = require('express-validator');
const sqlite3 = require('better-sqlite3');
const path = require('path');
const bcrypt = require('bcrypt');

const app = express();
const port = 5000;


const dbPath = path.join(__dirname, 'database.db');
const db = new sqlite3(dbPath);


app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());
app.use(bodyParser.json());


db.exec(`
  CREATE TABLE IF NOT EXISTS user (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    firstname TEXT NOT NULL,
    lastname TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
  );
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS task (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    priority INTEGER NOT NULL,
    completed BOOLEAN NOT NULL DEFAULT 0
  );
`);


app.post('/register', [
  body('firstname').isString().trim().notEmpty(),
  body('lastname').isString().trim().notEmpty(),
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('confirmPassword').custom((value, { req }) => value === req.body.password).withMessage('Passwords do not match'),
], async (req, res) => {
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
      return res.status(201).json({ message: 'Registration successful' });
    } else {
      return res.status(500).json({ error: 'Failed to insert user' });
    }
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});


app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const user = db.prepare('SELECT * FROM user WHERE email = ?').get(email);
  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  try {
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (passwordMatch) {
      return res.json({ message: 'Login successful', user: { id: user.id, firstname: user.firstname, lastname: user.lastname, email: user.email } });
    } else {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Error during login:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/tasks', (req, res) => {
  const { name, description, priority } = req.body;

  
  if (typeof name !== 'string' || typeof description !== 'string' || typeof priority !== 'number') {
    return res.status(400).send({ error: 'Invalid input types' });
  }

  const insertTask = db.prepare(`INSERT INTO task (name, description, priority) VALUES (?, ?, ?)`);
  try {
    const result = insertTask.run(name, description, priority);
    res.status(201).send({ id: result.lastInsertRowid, name, description, priority });
  } catch (err) {
    console.error('Error adding task:', err);
    res.status(500).send({ error: 'Error adding task' });
  }
});


app.delete('/tasks/:id', (req, res) => {
  const taskId = req.params.id;

  const deleteTask = db.prepare('DELETE FROM task WHERE id = ?');
  const result = deleteTask.run(taskId);

  if (result.changes === 1) {
    return res.status(200).json({ message: 'Task deleted successfully' });
  } else {
    return res.status(404).json({ error: 'Task not found' });
  }
});


app.put('/tasks/:id', [
  body('name').isString().trim().notEmpty(),
  body('description').optional().isString().trim(),
  body('priority').isInt({ min: 1, max: 5 }),
  body('completed').isBoolean(),
], (req, res) => {
  const taskId = req.params.id;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, description, priority, completed } = req.body;

  const updateTask = db.prepare('UPDATE task SET name = ?, description = ?, priority = ?, completed = ? WHERE id = ?');
  const result = updateTask.run(name, description, priority, completed, taskId);

  if (result.changes === 1) {
    return res.status(200).json({ message: 'Task updated successfully' });
  } else {
    return res.status(404).json({ error: 'Task not found' });
  }
});


app.get('/tasks', (req, res) => {
  const tasks = db.prepare('SELECT * FROM task').all();
  return res.json(tasks);
});


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
