import React from 'react';
import { useLocation } from 'react-router-dom';

function TasksCompleted() {
  const location = useLocation();
  const { completedTodos } = location.state || { completedTodos: [] };

  return (
    <div>
      <h2>Tasks Completed</h2>
      {completedTodos.length === 0 ? (
        <p>No tasks completed yet.</p>
      ) : (
        <ul>
          {completedTodos.map((todo, index) => (
            <li key={index}>
              <div>
                {todo.task} ({todo.timestamp})
                <p>{todo.description}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default TasksCompleted;
