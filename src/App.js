import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import Home from './components/Home';
import TasksCompleted from './components/TasksCompleted';
import SettingsButton from './components/settingsButton';
import './App.css';

function App() {
  return (
    <div className="App">
      <SettingsButton />
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/tasks-completed" element={<TasksCompleted />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
