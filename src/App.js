import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import Home from './components/Home';
import TasksCompleted from './components/TasksCompleted';
import './App.css';

function App() {
  return (
    <div className="App">
      <div className='appbtn' >
        <button className='btn'><Link to="/register">Register</Link></button>
        <button className='btn'><Link to="/login">Login</Link></button>
        <button className='btn'><Link to="/">Tasks</Link></button>
        <button className='btn'><Link to="/taskscompleted"> Completed</Link></button>
      </div>
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