import React, { useState } from 'react';
import './TodoList.css';



function TodoList() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [filteredEmployees,setFilteredEmployees] =useState ('')
  const [searchQuery, setSearchQuery] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const handleAddTodo = () => {
    if (newTodo.trim()) {
      setTodos([...todos, newTodo]);
      setNewTodo('');
    }
  };

  const handleDeleteTodo = (index) => {
    setTodos(todos.filter((_, i) => i !== index));
  };
  const editTodos = (todos) => {
    setNewTodo(todos);
    setIsEditing(true);
    };
    const handleUpdateTodo = (index) => {
      const updatedTodos = [...todos];
      updatedTodos[index] = newTodo;
      setTodos(updatedTodos);
      setIsEditing(false);
      setNewTodo('');
      };
      
          
  return (
    <div className="todo-list">
      
      <h2>To-Do List</h2>
      <input
        type="text"
        value={newTodo}
        onChange={(e) => setNewTodo(e.target.value)}
        placeholder="Add a new task"
      />
      <button onClick={handleAddTodo}>Add</button>
      <ul>
        {todos.map((todo, index) => (
          <li key={index}>
            {todo}
            <button onClick={()=> editTodos(todos)}>edit</button>

            <button onClick={() => handleDeleteTodo(index)}>Delete</button>

            <div class="checkbox-wrapper-46">
  <input type="checkbox" id="cbx-46" class="inp-cbx" />
  <label for="cbx-46" class="cbx"
    ><span>
      <svg viewBox="0 0 12 10" height="10px" width="12px">
        <polyline points="1.5 6 4.5 9 10.5 1"></polyline></svg></span
    ><span>Task complete</span>
  </label>
        

</div>

          </li>
        ))}
      </ul>
    </div>
  );
}
          
export default TodoList;
