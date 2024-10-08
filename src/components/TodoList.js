import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import './TodoList.css';

function TodoList() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [newTodoDescription, setNewTodoDescription] = useState('');
  const [priority, setPriority] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingTodo, setEditingTodo] = useState('');
  const [editingDescription, setEditingDescription] = useState('');
  const [editingPriority, setEditingPriority] = useState(1);
  const [editingCompleted, setEditingCompleted] = useState(false);
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/tasks';

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      fetchData(storedUserId);
    }
  }, []);

  const fetchData = async (userId) => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/user/${userId}`, { withCredentials: true });
      if (response.status === 200) {
        setTodos(response.data.tasks);
      } else {
        throw new Error('Failed to fetch data');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      alert('Error fetching tasks. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'newTodo') {
      setNewTodo(value);
    } else if (name === 'newTodoDescription') {
      setNewTodoDescription(value);
    }
  };

  const handlePriorityChange = (e) => {
    setPriority(parseInt(e.target.value, 10));
  };

  const handleAddTodo = async () => {
    if (newTodo.trim()) {
      const storedUserId = localStorage.getItem('userId');
      const token = localStorage.getItem('token'); // Assuming you store the token in localStorage
      const newTask = {
        name: newTodo,
        description: newTodoDescription,
        priority,
        completed: false,
        user_id: storedUserId
      };
  
      try {
        const response = await axios.post(API_URL, newTask, {
          headers: {
            Authorization: `Bearer ${token}`
          },
          withCredentials: true
        });
        if (response.status === 201) {
          fetchData(storedUserId);
          setNewTodo('');
          setNewTodoDescription('');
          setPriority(1);
        } else {
          throw new Error('Failed to add new task');
        }
      } catch (error) {
        console.error('Error adding new task:', error);
        alert('Error adding new task. Please try again later.');
      }
    } else {
      alert('New task title cannot be empty.');
    }
  };
  

  const handleDeleteTodo = async (id) => {
    const storedUserId = localStorage.getItem('userId');
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        const response = await axios.delete(`${API_URL}/${id}?user_id=${storedUserId}`, { withCredentials: true });
        if (response.status === 200) {
          fetchData(storedUserId);
        } else {
          throw new Error('Failed to delete task');
        }
      } catch (error) {
        console.error('Error deleting task:', error);
        alert('Error deleting task. Please try again later.');
      }
    }
  };

  const handleEditTodo = (index) => {
    const todoToEdit = todos[index];
    setEditingIndex(index);
    setEditingTodo(todoToEdit.name);
    setEditingDescription(todoToEdit.description);
    setEditingPriority(todoToEdit.priority);
    setEditingCompleted(todoToEdit.completed);
  };

  const handleUpdateTodo = async () => {
    const storedUserId = localStorage.getItem('userId');
    if (editingTodo.trim()) {
      const updatedTodo = {
        name: editingTodo,
        description: editingDescription,
        priority: editingPriority,
        completed: editingCompleted,
        user_id: storedUserId
      };

      try {
        const response = await axios.put(`${API_URL}/${todos[editingIndex].id}`, updatedTodo, { withCredentials: true });
        if (response.status === 200) {
          fetchData(storedUserId);
          handleCancelEdit();
        } else {
          throw new Error('Failed to update task');
        }
      } catch (error) {
        console.error('Error updating task:', error);
        alert('Error updating task. Please try again later.');
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditingTodo('');
    setEditingDescription('');
  };

  const handleToggleComplete = async (index) => {
    const storedUserId = localStorage.getItem('userId');
    const updatedTodo = {
      ...todos[index],
      completed: !todos[index].completed,
      user_id: storedUserId
    };

    try {
      const response = await axios.put(`${API_URL}/${todos[index].id}`, updatedTodo, { withCredentials: true });
      if (response.status === 200) {
        fetchData(storedUserId);
      } else {
        throw new Error('Failed to toggle task completion');
      }
    } catch (error) {
      console.error('Error toggling task completion:', error);
      alert('Error toggling task completion. Please try again later.');
    }
  };

  const filteredTodos = todos.filter(todo =>
    todo.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getPriorityClass = (priority) => {
    switch (priority) {
      case 1:
        return 'priority-low';
      case 2:
        return 'priority-medium';
      case 3:
        return 'priority-high';
      case 4:
        return 'priority-very-high';
      case 5:
        return 'priority-critical';
      default:
        return '';
    }
  };

  return (
    <div className="todo-container">
      {loading && <p>Loading...</p>}
      <div className="todo-header">
        <h1>Todo List</h1>
        {location.state && location.state.welcomeMessage && (
          <h2>{location.state.welcomeMessage}</h2>
        )}
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div className="todo-input">
        <input
          type="text"
          name="newTodo"
          value={newTodo}
          onChange={handleInputChange}
          placeholder="New task title"
        />
        <textarea
          name="newTodoDescription"
          value={newTodoDescription}
          onChange={handleInputChange}
          placeholder="Description (optional)"
        />
        <select value={priority} onChange={handlePriorityChange}>
          <option value={1}>Low</option>
          <option value={2}>Medium</option>
          <option value={3}>High</option>
          <option value={4}>Very High</option>
          <option value={5}>Critical</option>
        </select>
        <button onClick={handleAddTodo}>Add Task</button>
      </div>
      <div className="todo-list">
        {filteredTodos.map((todo, index) => (
          <div key={todo.id} className={`todo-item ${getPriorityClass(todo.priority)}`}>
            {todo.completed ? <span className="completed">{todo.name}</span> : <span>{todo.name}</span>}
            <button onClick={() => handleEditTodo(index)}>Edit</button>
            <button onClick={() => handleToggleComplete(index)}>
              {todo.completed ? 'Undo' : 'Complete'}
            </button>
            <button onClick={() => handleDeleteTodo(todo.id)}>Delete</button>
          </div>
        ))}
      </div>
      {editingIndex !== null && (
        <div className="todo-edit">
          <input
            type="text"
            value={editingTodo}
            onChange={(e) => setEditingTodo(e.target.value)}
          />
          <textarea
            value={editingDescription}
            onChange={(e) => setEditingDescription(e.target.value)}
          />
          <select value={editingPriority} onChange={(e) => setEditingPriority(parseInt(e.target.value, 10))}>
            <option value={1}>Low</option>
            <option value={2}>Medium</option>
            <option value={3}>High</option>
            <option value={4}>Very High</option>
            <option value={5}>Critical</option>
          </select>
          <label>
            Completed
            <input
              type="checkbox"
              checked={editingCompleted}
              onChange={() => setEditingCompleted(!editingCompleted)}
            />
          </label>
          <button onClick={handleUpdateTodo}>Save</button>
          <button onClick={handleCancelEdit}>Cancel</button>
        </div>
      )}
    </div>
  );
}

export default TodoList;
