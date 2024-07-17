import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import Home from './components/Home';
import './App.css';

function App() {
  return (
    <div className="App">
      <div>
        <button><Link to="/register">Register User</Link></button>
        <button><Link to="/login">User Login</Link></button>
        <button><Link to="/">Tasks</Link></button>
      </div>
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;