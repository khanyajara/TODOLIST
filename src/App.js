import React from 'react';

import { Routes, Route } from 'react-router-dom';
import Register from './components/Register';

import Home from './components/Home';
import TasksCompleted from './components/TasksCompleted';

import './App.css';

function App() {

  return (
    <div className="App">
      
      <div>
        <Routes>
          <Route path="/Home" element={<Home />} />
          <Route path="/" element={<Register />} />
          
          <Route path="/tasks-completed" element={<TasksCompleted />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
