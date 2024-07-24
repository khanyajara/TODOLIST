import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './TodoList.css';
import axios from 'axios';

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

  // Fetch initial data from database on component mount
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/todolist');
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
      const timestamp = new Date().toLocaleString();
      const newTask = {
        title: newTodo,
        description: newTodoDescription,
        date: timestamp,
        priority: priority,
        completed: false
      };

      try {
        const response = await axios.post('http://localhost:3000/api/todolist', newTask);

        if (response.status === 201) { // Assuming your backend returns 201 for created resources
          await fetchData(); // Fetch updated data after adding task
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
      const response = await axios.delete(`http://localhost:3000/api/todolist/${id}`);

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
    setEditingTodo(todoToEdit.title);
    setEditingDescription(todoToEdit.description);
    setEditingPriority(todoToEdit.priority);
    setEditingCompleted(todoToEdit.completed);
  };

  const handleUpdateTodo = async () => {
    if (editingTodo.trim()) {
      const updatedTodo = {
        title: editingTodo,
        description: editingDescription,
        priority: editingPriority,
        completed: editingCompleted,
      };

      try {
        const response = await axios.put(`http://localhost:3000/api/todolist/${todos[editingIndex].id}`, updatedTodo);

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
      const response = await axios.put(`http://localhost:3000/api/todolist/${todos[index].id}`, updatedTodos[index]);

      if (response.status !== 200) {
        throw new Error('Failed to update completion status');
      }
    } catch (error) {
      console.error('Error updating completion status:', error);
    }
  };

  const filteredTodos = todos.filter((todo) =>
    todo.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="todo-list">
      <h2>To-Do List</h2>
      <input
        type="text"
        id="newTodo"
        name="newTodo"
        value={newTodo}
        onChange={handleInputChange}
        placeholder="Add a new task"
      />
      <textarea
        id="newTodoDescription"
        name="newTodoDescription"
        value={newTodoDescription}
        onChange={handleInputChange}
        placeholder="Add a task description"
      />
      <select value={priority} onChange={handlePriorityChange}>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
      <button onClick={handleAddTodo}>Add</button>

      <input
        type="text"
        id="searchQuery"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search"
      />

      <Link to={{ pathname: "/tasks-completed", state: { completedTodos: todos.filter(todo => todo.completed) } }}>
        <button>View Completed Tasks</button>
      </Link>

      <ul>
        {filteredTodos.map((todo, index) => (
          <li key={todo.id} style={{ color: getPriorityColor(todo.priority) }}>
            <div>
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => handleToggleComplete(index)}
              />
              {todo.title} ({todo.date})
              <div>
                {editingIndex === index ? (
                  <>
                    <input
                      type="text"
                      value={editingTodo}
                      onChange={(e) => setEditingTodo(e.target.value)}
                    />
                    <textarea
                      value={editingDescription}
                      onChange={(e) => setEditingDescription(e.target.value)}
                    />
                    <select
                      value={editingPriority}
                      onChange={(e) => setEditingPriority(e.target.value)}
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                    <label>
                      Completed:
                      <input
                        type="checkbox"
                        checked={editingCompleted}
                        onChange={(e) => setEditingCompleted(e.target.checked)}
                      />
                    </label>
                    <button onClick={handleUpdateTodo}>Update</button>
                    <button onClick={handleCancelEdit}>Cancel</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => handleDeleteTodo(todo.id)}>Delete</button>
                    <button onClick={() => handleEditTodo(index)}>Edit</button>
                  </>
                )}
              </div>
              <div className="collapsible">
                <button
                  className="collapsible-button"
                  onClick={() => {
                    const collapsibleContent = document.getElementById(`collapsible-content-${todo.id}`);
                    collapsibleContent.style.display = collapsibleContent.style.display === 'block' ? 'none' : 'block';
                  }}
                >
                  {todo.description ? 'Show description' : 'No description'}
                </button>
                <div className="collapsible-content" id={`collapsible-content-${todo.id}`}>
                  <p>{todo.description}</p>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

const getPriorityColor = (priority) => {
  switch (priority) {
    case 'high':
      return 'red';
    case 'medium':
      return 'orange';
    case 'low':
      return 'green';
    default:
      return 'black';
  }
};

export default TodoList;
