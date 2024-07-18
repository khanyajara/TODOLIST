import React, { useState } from 'react';
import './TodoList.css'

function TodoList() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [newTodoDescription, setNewTodoDescription] = useState(''); // new state for task description
  const [searchQuery, setSearchQuery] = useState('');
  const [priority, setPriority] = useState('low');
  const [completed, setCompleted] = useState(false); // new state for task completion
  const [editingIndex, setEditingIndex] = useState(null); 
  const [editingTodo, setEditingTodo] = useState(''); 
  const [editingDescription, setEditingDescription] = useState(''); 


  const handleAddTodo = () => {
    if (newTodo.trim()) {
      const timestamp = new Date().toLocaleString();
      const newTask = { task: newTodo, description: newTodoDescription, timestamp, priority };
      setTodos([...todos, newTask]);
      setNewTodo('');
      setNewTodoDescription(''); // reset description input
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
  };

  const handleUpdateTodo = () => {
    if (editingTodo.trim()) {
      const updatedTask = { task: editingTodo, description: editingDescription, timestamp: todos[editingIndex].timestamp, priority: todos[editingIndex].priority };
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
      <textarea
        value={newTodoDescription}
        onChange={(e) => setNewTodoDescription(e.target.value)}
        placeholder="Add a task description"
      /> {/* new textarea for task description */}
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

              </div>
              <div className="collapsible">
                <button className="collapsible-button" onClick={() => {
                  const collapsibleContent = document.getElementById(`collapsible-content-${index}`);
                  collapsibleContent.style.display = collapsibleContent.style.display === 'block' ? 'none' : 'block';
                }}>
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