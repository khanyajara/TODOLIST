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
  const [userName, setUserName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const API_URL = 'http://localhost:5000';

  useEffect(() => {
    const fetchUserData = async () => {
      const storedUserId = localStorage.getItem('userId');
      if (storedUserId) {
        setLoading(true);
        try {
          const response = await axios.get(`${API_URL}/user/${storedUserId}`, { withCredentials: true });
          if (response.status === 200) {
            setTodos(response.data.tasks);
            setUserName(response.data.user.name);
          } else {
            throw new Error('Failed to fetch data');
          }
        } catch (error) {
          console.error('Error fetching data:', error);
          setErrorMessage('Error fetching tasks. Please try again later.');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchUserData();
  }, []);

  const AddTodo = async () => {
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
        completed: false,
        userId: localStorage.getItem('userId'),
      }, { withCredentials: true });

      if (response.status === 201) {
        setTodos([...todos, response.data]);
        setNewTodo('');
        setNewTodoDescription('');
        setPriority(1);
      } else {
        throw new Error('Failed to create task');
      }
    } catch (error) {
      console.error('Error creating task:', error.response ? error.response.data : error.message);
      setErrorMessage('Error creating task. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const Delete = async (id) => {
    setLoading(true);
    setErrorMessage('');
    try {
      const response = await axios.delete(`${API_URL}/tasks/${id}`, { withCredentials: true });
      if (response.status === 200) {
        setTodos(todos.filter((todo) => todo.id !== id));
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

  const Edit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    try {
      const response = await axios.put(`${API_URL}/tasks/${editingTodoId}`, {
        name: editingTodo,
        description: editingDescription,
        priority: editingPriority,
        completed: false, // Adjust this as needed
        userId: localStorage.getItem('userId'),
      }, { withCredentials: true });

      if (response.status === 200) {
        setTodos(todos.map((todo) => 
          todo.id === editingTodoId ? { ...todo, name: editingTodo, description: editingDescription, priority: editingPriority } : todo
        ));
        // Reset editing states after updating a todo
        setEditingTodoId(null);
        setEditingTodo('');
        setEditingDescription('');
        setEditingPriority(1);
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

  return (
    <div className="todo-list">
      <h1>{userName}'s Todo List</h1>
      <input
        type="text"
        value={newTodo}
        onChange={(e) => setNewTodo(e.target.value)}
        placeholder="Task Name"
        disabled={loading}
      />
      <input
        type="text"
        value={newTodoDescription}
        onChange={(e) => setNewTodoDescription(e.target.value)}
        placeholder="Task Description"
        disabled={loading}
      />
      <input
        type="number"
        value={priority}
        onChange={(e) => setPriority(Number(e.target.value))}
        min="1"
        max="5"
        placeholder="Priority (1-5)"
        disabled={loading}
      />
      <button onClick={AddTodo} disabled={loading}>Add Todo</button>

      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search Tasks"
        disabled={loading}
      />

      {errorMessage && <p className="error-message">{errorMessage}</p>}

      {todos.filter(todo => todo.name.toLowerCase().includes(searchQuery.toLowerCase())).map((todo) => (
        <div key={todo.id} className="todo-item">
          <h3>{todo.name}</h3>
          <p>{todo.description}</p>
          <p>Priority: {todo.priority}</p>
          <p>Status: {todo.completed ? 'Completed' : 'Pending'}</p>
          <button onClick={() => Delete(todo.id)} disabled={loading}>Delete</button>
          <button onClick={() => {
            setEditingTodoId(todo.id);
            setEditingTodo(todo.name);
            setEditingDescription(todo.description);
            setEditingPriority(todo.priority);
          }}>Edit</button>
        </div>
      ))}

      {editingTodoId && (
        <form onSubmit={Edit}>
          <h2>Edit Todo</h2>
          <input
            type="text"
            value={editingTodo}
            onChange={(e) => setEditingTodo(e.target.value)}
            placeholder="Edit Task Name"
            disabled={loading}
          />
          <input
            type="text"
            value={editingDescription}
            onChange={(e) => setEditingDescription(e.target.value)}
            placeholder="Edit Task Description"
            disabled={loading}
          />
          <input
            type="number"
            value={editingPriority}
            onChange={(e) => setEditingPriority(Number(e.target.value))}
            min="1"
            max="5"
            placeholder="Edit Priority (1-5)"
            disabled={loading}
          />
          <button type="submit" disabled={loading}>Update Todo</button>
        </form>
      )}

      {loading && <p>Loading...</p>}
    </div>
  );
}

export default TodoList;
