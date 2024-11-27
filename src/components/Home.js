import React from 'react';
import TodoList from './TodoList';
import SettingsButton from './settingsButton';
import  { useState } from 'react';
import './Home.css'

function Home() {

  const [userId, setUserId] = useState(null);
  return (
    <div className='homepage' >
      <SettingsButton serId={userId} setUserId={setUserId} />
      <h1>Home Page</h1>
      <p>Display to-do list items here</p>
      
      <TodoList />
      
    </div>
  );
}

export default Home;