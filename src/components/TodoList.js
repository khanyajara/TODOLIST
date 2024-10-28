import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './TodoList.css';

function TodoList() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [newTodoDescription, setNewTodoDescription] = useState('');
  const [priority, setPriority] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingTodoId, setEditingTodoId] = useState(null);
  const [editingTodo, setEditingTodo] = useState('');
  const [editingDescription, setEditingDescription] = useState('');
  const [editingPriority, setEditingPriority] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const API_URL = 'http://localhost:5000';

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/tasks`, { withCredentials: true });
      if (response.status === 200) {
        setTodos(response.data);
      }
    } catch (error) {
      console.error('Error fetching todos:', error);
      setErrorMessage('Error fetching todos. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const addTodo = async () => {
    if (newTodo.trim() === '') {
      setErrorMessage('Please enter a task name');
      return;
    }

    if (priority < 1 || priority > 5) {
      setErrorMessage('Priority must be between 1 and 5');
      return;
    }

    setLoading(true);
    setErrorMessage('');
    try {
      const response = await axios.post(`${API_URL}/tasks`, {
        name: newTodo,
        description: newTodoDescription,
        priority: priority,
      });

      if (response.status === 201) {
        setTodos((prevTodos) => [...prevTodos, response.data]);
        setNewTodo('');
        setNewTodoDescription('');
        setPriority(1);
      } else {
        throw new Error('Failed to create task');
      }
    } catch (error) {
      console.error('Error creating task:', error);
      setErrorMessage(error.response?.data?.errors || 'Error creating task. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const deleteTodo = async (id) => {
    setLoading(true);
    setErrorMessage('');
    try {
      const response = await axios.delete(`${API_URL}/tasks/${id}`, { withCredentials: true });
      if (response.status === 200) {
        setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
      } else {
        throw new Error('Failed to delete task');
      }
    } catch (error) {
      console.error('Error deleting task:', error);
      setErrorMessage('Error deleting task. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const editTodo = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      const response = await axios.put(`${API_URL}/tasks/${editingTodoId}`, {
        name: editingTodo,
        description: editingDescription,
        priority: editingPriority,
        completed: todos.find(todo => todo.id === editingTodoId)?.completed,
      }, { withCredentials: true });

      if (response.status === 200) {
        setTodos((prevTodos) =>
          prevTodos.map((todo) =>
            todo.id === editingTodoId ? { ...todo, name: editingTodo, description: editingDescription, priority: editingPriority } : todo
          )
        );
        cancelEdit();
      } else {
        throw new Error('Failed to update task');
      }
    } catch (error) {
      console.error('Error updating task:', error);
      setErrorMessage('Error updating task. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const cancelEdit = () => {
    setEditingTodoId(null);
    setEditingTodo('');
    setEditingDescription('');
    setEditingPriority(1);
  };

  const filteredTodos = todos.filter(todo => todo.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="todo-list">
      <h1>Todo List</h1>
      <input
        type="text"
        value={newTodo}
        onChange={(e) => setNewTodo(e.target.value)}
        placeholder="Task Name"
        disabled={loading}
        aria-label="Task Name"
      />
      <input
        type="text"
        value={newTodoDescription}
        onChange={(e) => setNewTodoDescription(e.target.value)}
        placeholder="Task Description"
        disabled={loading}
        aria-label="Task Description"
      />
      <input
        type="number"
        value={priority}
        onChange={(e) => setPriority(Number(e.target.value))}
        min="1"
        max="5"
        placeholder="Priority (1-5)"
        disabled={loading}
        aria-label="Priority (1-5)"
      />
      <button onClick={addTodo} disabled={loading}>Add Todo</button>

      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search Tasks"
        disabled={loading}
        aria-label="Search Tasks"
      />

      {errorMessage && <p className="error-message">{errorMessage}</p>}

      {filteredTodos.map((todo) => (
        <div 
          key={todo.id} 
          className={`todo-item 
            ${todo.priority === 1 ? 'priority-low' : ''}
            ${todo.priority === 2 ? 'priority-low' : ''}
            ${todo.priority === 3 ? 'priority-medium' : ''}
            ${todo.priority === 4 ? 'priority-high' : ''}
            ${todo.priority === 5 ? 'priority-high' : ''}
          `}
        >
          <h3>{todo.name}</h3>
          <p>{todo.description}</p>
          <p>Priority: {todo.priority}</p>
          <p>Status: {todo.completed ? 'Completed' : 'Pending'}</p>
          <button onClick={() => deleteTodo(todo.id)} disabled={loading}>Delete</button>
          <button onClick={() => {
            setEditingTodoId(todo.id);
            setEditingTodo(todo.name);
            setEditingDescription(todo.description);
            setEditingPriority(todo.priority);
          }} disabled={loading}>Edit</button>
        </div>
      ))}

      {editingTodoId && (
        <form onSubmit={editTodo}>
          <h2>Edit Todo</h2>
          <input
            type="text"
            value={editingTodo}
            onChange={(e) => setEditingTodo(e.target.value)}
            placeholder="Edit Task Name"
            required
            aria-label="Edit Task Name"
          />
          <input
            type="text"
            value={editingDescription}
            onChange={(e) => setEditingDescription(e.target.value)}
            placeholder="Edit Task Description"
            required
            aria-label="Edit Task Description"
          />
          <input
            type="number"
            value={editingPriority}
            onChange={(e) => setEditingPriority(Number(e.target.value))}
            min="1"
            max="5"
            placeholder="Priority (1-5)"
            required
            aria-label="Edit Priority (1-5)"
          />
          <button type="submit">Update Todo</button>
          <button type="button" onClick={cancelEdit}>Cancel</button>
        </form>
      )}

      {loading && <p>Loading...</p>}
    </div>
  );
}

export default TodoList;
