import React, { useState } from 'react';
import './TodoList.css';

function TodoList() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [priority, setPriority] = useState('low');

  const handleAddTodo = () => {
    if (newTodo.trim()) {
      const timestamp = new Date().toLocaleString();
      const newTask = { task: newTodo, timestamp, priority };
      setTodos([...todos, newTask]);
      setNewTodo('');
      setPriority('low');
    }
  };

  const handleDeleteTodo = (index) => {
    setTodos(todos.filter((_, i) => i !== index));
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredTodos = todos.filter((todo) =>
    todo.task.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="todo-list">
      <h2>To-Do List</h2>
      <input
        type="text"
        value={newTodo}
        onChange={(e) => setNewTodo(e.target.value)}
        placeholder="Add a new task"
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

      <ul>
        {filteredTodos.map((todo, index) => (
          <li key={index} style={{ color: getPriorityColor(todo.priority) }}>
            <div>
              {todo.task} ({todo.timestamp})
              <button onClick={() => handleDeleteTodo(index)}>Delete</button>
              <div className="checkbox-wrapper-46">
                <input type="checkbox" id={`cbx-${index}`} className="inp-cbx" />
                <label htmlFor={`cbx-${index}`} className="cbx">
                  <span>
                    <svg viewBox="0 0 12 10" height="9px" width="10px">
                      <polyline points="1.5 6 4.5 9 10.5 1"></polyline>
                    </svg>
                  </span>
                  <span>Task complete</span>
                </label>
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
