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
  const [todos, setTodos] = useState([]);
  const [error, setError] = useState(''); // State for error messages

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async (userId) => {
      try {
        const response = await axios.get(`${API_URL}?user_id=${userId}`);
        if (response.status === 200) {
          setTodos(response.data);
        } else {
          throw new Error('Failed to fetch data');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      fetchData(storedUserId);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };
  const handleButtonClick = () => {
    navigate('/');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post(API_URL, formData);
      if (response.status === 200) {
        const { data } = response; // Use data instead of response.data
        if (data.user) { // Check if user exists in the response before accessing id
          localStorage.setItem('userId', data.user.id);
          navigate('/');
        } else {
          setError('Login successful but user data is missing.');  // Inform user of unexpected response
        }
      } else {
        // Handle login failure as before
      }
      
    } catch (error) {
      setError('An error occurred. Please try again later.');
      console.error('Login failed:', error);
    }
  };

  return (
    <div className="form-container">
      <p className="title">Welcome back</p>
      {error && <p className="error-message">{error}</p>}
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
         <button type="submit" className="form-btn" onClick={handleButtonClick}>
        Log in
      </button>
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
