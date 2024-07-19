import React from 'react';
import TodoList from './TodoList';

import './Home.css'

function Home() {
  return (
    <div className='homepage' >
      <h1>Home Page</h1>
      <p>Display to-do list items here</p>
      
      <TodoList />
      
    </div>
  );
}

export default Home;