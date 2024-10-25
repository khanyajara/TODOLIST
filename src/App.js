import React from 'react';
import  { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Register from './components/Register';

import Home from './components/Home';
import TasksCompleted from './components/TasksCompleted';
import SettingsButton from './components/settingsButton';
import './App.css';

function App() {
  const [userId, setUserId] = useState(null);
  return (
    <div className="App">
      <SettingsButton serId={userId} setUserId={setUserId} />
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
