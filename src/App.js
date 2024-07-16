import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import Home from './components/Home';

function App() {
  return (
    <div className="App">
      
        < Home/>
        < Login/>
        <Register />
      
    </div>
  );
}

export default App;
