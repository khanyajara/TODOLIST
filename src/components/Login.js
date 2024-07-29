import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';

const API_URL = 'http://localhost:3000/login'; 

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [todos, setTodos] = useState([]); // Example state for fetched data

  // Initialize navigate
  const navigate = useNavigate();

  // Assuming userId should be retrieved from context or local storage
  const userId = localStorage.getItem('userId');
  
  useEffect(() => {
    const fetchData = async (userId) => {
      if (userId) {
        try {
          const response = await axios.get(`/tasks?user_id=${userId}`);
          setTodos(response.data.tasks); // Assuming data structure
        } catch (error) {
          console.error('Error fetching tasks:', error);
        }
      }
    };
  
    fetchData(userId);
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await axios.post(API_URL, formData); // Declare and assign response here
  
      if (response.status === 200) {
        const { user } = response.data;
        localStorage.setItem('userId', user.id);
        navigate('/');
      }
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div className="form-container">
      <p className="title">Welcome back</p>
      <form className="form" onSubmit={handleSubmit}>
        <input 
          name="email" 
          type="email" 
          className="input" 
          placeholder="Email" 
          value={formData.email}
          onChange={handleChange} 
        />
        <input 
          name="password" 
          type="password" 
          className="input" 
          placeholder="Password" 
          value={formData.password}
          onChange={handleChange} 
        />
        <button type="submit" className="form-btn">Log in</button>
      </form>
      <p className="sign-up-label">
        Don't have an account? <span className="sign-up-link"><Link to="/register">Sign up</Link></span>
      </p>
      <div className="buttons-container">
        <div className="apple-login-button">
          <span>Log in with Apple</span>
        </div>
        <div className="google-login-button">
          <span>Log in with Google</span>
        </div>
      </div>
    </div>
  );
};

export default Login;
