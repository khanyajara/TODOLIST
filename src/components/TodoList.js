import React, { useState } from 'react';
import { Link } from 'react-router-dom';
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

  const handleAddTodo = () => {
    if (newTodo.trim()) {
      const timestamp = new Date().toLocaleString();
      const newTask = { task: newTodo, description: newTodoDescription, timestamp, priority, completed: false };
      setTodos([...todos, newTask]);
      setNewTodo('');
      setNewTodoDescription('');
      setPriority('low');
    }
  };

  const handleDeleteTodo = (index) => {
    setTodos(todos.filter((_, i) => i !== index));
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleEditTodo = (index) => {
    setEditingIndex(index);
    setEditingTodo(todos[index].task);
    setEditingDescription(todos[index].description);
    setEditingPriority(todos[index].priority);
    setEditingCompleted(todos[index].completed);
  };

  const handleUpdateTodo = () => {
    if (editingTodo.trim()) {
      const updatedTask = {
        task: editingTodo,
        description: editingDescription,
        timestamp: todos[editingIndex].timestamp,
        priority: editingPriority,
        completed: editingCompleted
      };
      const updatedTodos = [...todos];
      updatedTodos[editingIndex] = updatedTask;
      setTodos(updatedTodos);
      setEditingIndex(null);
      setEditingTodo('');
      setEditingDescription('');
    }
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditingTodo('');
    setEditingDescription('');
  };

  const handleToggleComplete = (index) => {
    const updatedTodos = [...todos];
    updatedTodos[index].completed = !updatedTodos[index].completed;
    setTodos(updatedTodos);
  };

  const filteredTodos = todos.filter((todo) =>
    todo.task.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const completedTodos = todos.filter((todo) => todo.completed);

  return (
    <div className="todo-list">
      <h2>To-Do List</h2>
      <input
        type="text"
        value={newTodo}
        onChange={(e) => setNewTodo(e.target.value)}
        placeholder="Add a new task"
      />
      <textarea
        value={newTodoDescription}
        onChange={(e) => setNewTodoDescription(e.target.value)}
        placeholder="Add a task description"
      />
      <select value={priority} onChange={(e) => setPriority(e.target.value)}>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
      <button onClick={handleAddTodo}>Add</button>

      <input
        type="text"
        value={searchQuery}
        onChange={handleSearch}
        placeholder="Search"
      />
      
      <Link to={{ pathname: "/tasks-completed", state: { completedTodos } }}>
        <button>View Completed Tasks</button>
      </Link>

      <ul>
        {filteredTodos.map((todo, index) => (
          <li key={index} style={{ color: getPriorityColor(todo.priority) }}>
            <div>
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => handleToggleComplete(index)}
              />
              {todo.task} ({todo.timestamp})
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
                    <button onClick={() => handleDeleteTodo(index)}>Delete</button>
                    <button onClick={() => handleEditTodo(index)}>Edit</button>
                  </>
                )}
              </div>
              <div className="collapsible">
                <button
                  className="collapsible-button"
                  onClick={() => {
                    const collapsibleContent = document.getElementById(`collapsible-content-${index}`);
                    collapsibleContent.style.display = collapsibleContent.style.display === 'block' ? 'none' : 'block';
                  }}
                >
                  {todo.description ? 'Show description' : 'No description'}
                </button>
                <div className="collapsible-content" id={`collapsible-content-${index}`}>
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
