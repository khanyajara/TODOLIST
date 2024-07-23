const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors'); // Import cors package
const { createTodoList, getTodoList, updateTodoList, deleteTodoList } = require('./db/statements.js');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors()); // Enable CORS for all routes

// Serve static assets if in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

// API endpoints (example endpoints, adjust as per your needs)
app.get('/api/todolist', async (req, res) => {
  try {
    const todoList = await getTodoList();
    res.json(todoList);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/todolist', async (req, res) => {
  const { title, description, date } = req.body;
  try {
    await createTodoList(title, description, date);
    res.status(201).send('Todo created successfully');
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/todolist/:id', async (req, res) => {
  const { id } = req.params;
  const { title, description, priority, completed } = req.body;
  try {
    await updateTodoList(id, title, description, priority, completed);
    res.send('Todo updated successfully');
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/todolist/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await deleteTodoList(id);
    res.send('Todo deleted successfully');
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
