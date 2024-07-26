import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import './TodoList.css';

function TodoList() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [newTodoDescription, setNewTodoDescription] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [priority, setPriority] = useState('low');
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingTodo, setEditingTodo] = useState('');
  const [editingDescription, setEditingDescription] = useState('');
  const [editingPriority, setEditingPriority] = useState('low');
  const [editingCompleted, setEditingCompleted] = useState(false);
  const location = useLocation(); // Hook to access location object

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:3000/tasks');
      if (response.status === 200) {
        setTodos(response.data);
      } else {
        throw new Error('Failed to fetch data');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
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
    setPriority(e.target.value);
  };

  const handleAddTodo = async () => {
    if (newTodo.trim()) {
      const newTask = {
        name: newTodo,
        description: newTodoDescription,
        priority,
        completed: false
      };

      try {
        const response = await axios.post('http://localhost:3000/tasks', newTask);
        if (response.status === 201) {
          await fetchData();
          setNewTodo('');
          setNewTodoDescription('');
          setPriority('low');
        } else {
          throw new Error('Failed to add new task');
        }
      } catch (error) {
        console.error('Error adding new task:', error);
      }
    } else {
      console.warn('New task title is empty or contains only whitespace.');
    }
  };

  const handleDeleteTodo = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:3000/tasks/${id}`);
      if (response.status === 200) {
        await fetchData();
      } else {
        throw new Error('Failed to delete task');
      }
    } catch (error) {
      console.error('Error deleting task:', error);
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
    if (editingTodo.trim()) {
      const updatedTodo = {
        name: editingTodo,
        description: editingDescription,
        priority: editingPriority,
        completed: editingCompleted
      };

      try {
        const response = await axios.put(`http://localhost:3000/tasks/${todos[editingIndex].id}`, updatedTodo);
        if (response.status === 200) {
          await fetchData();
          setEditingIndex(null);
          setEditingTodo('');
          setEditingDescription('');
        } else {
          throw new Error('Failed to update task');
        }
      } catch (error) {
        console.error('Error updating task:', error);
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditingTodo('');
    setEditingDescription('');
  };

  const handleToggleComplete = async (index) => {
    const updatedTodos = [...todos];
    updatedTodos[index].completed = !updatedTodos[index].completed;
    setTodos(updatedTodos);

    try {
      const response = await axios.put(`http://localhost:3000/tasks/${todos[index].id}`, updatedTodos[index]);
      if (response.status !== 200) {
        throw new Error('Failed to toggle task completion');
      }
    } catch (error) {
      console.error('Error toggling task completion:', error);
    }
  };

  const filteredTodos = todos.filter(todo =>
    todo.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="todo-container">
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
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <button onClick={handleAddTodo}>Add Task</button>
      </div>
      <div className="todo-list">
        {filteredTodos.map((todo, index) => (
          <div key={todo.id} className="todo-item">
            {editingIndex === index ? (
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
                <select value={editingPriority} onChange={(e) => setEditingPriority(e.target.value)}>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
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
            ) : (
              <div className="todo-content">
                <span className={todo.completed ? 'completed' : ''}>{todo.name}</span>
                <button onClick={() => handleEditTodo(index)}>Edit</button>
                <button onClick={() => handleToggleComplete(index)}>
                  {todo.completed ? 'Undo' : 'Complete'}
                </button>
                <button onClick={() => handleDeleteTodo(todo.id)}>Delete</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default TodoList;
