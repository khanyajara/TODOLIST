import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Register.css';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState('');

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const { firstname, lastname, email, password, confirmPassword } = formData;

  
    if (!email || !password || (!isLogin && (!firstname || !lastname || !confirmPassword))) {
      setErrors('All fields are required.');
      return false;
    }

    
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setErrors('Please enter a valid email address.');
      return false;
    }

  
    if (!isLogin && password.length < 6) {
      setErrors('Password must be at least 6 characters long.');
      return false;
    }


    if (!isLogin && password !== confirmPassword) {
      setErrors('Passwords do not match.');
      return false;
    }

    setErrors('');
    return true;
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const response = await axios.post('http://localhost:5000/register', formData);
        setMessage(response.data.message || 'Signup successful! You can now log in.');
        setIsLogin(true);
      } catch (error) {
        setErrors(error.response?.data?.error || 'An error occurred during signup.');
      }
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault(); 
    if (validateForm()) {
      try {
        const response = await axios.post('http://localhost:5000/login', {
          email: formData.email,
          password: formData.password,
        });
        console.log('Login response:', response);

        if (response.data) {
          localStorage.setItem('token', response.data.token); 
          navigate('/Home'); 
        }
      } catch (error) {
        console.error('Login error:', error);
        if (error.response) {
          console.error('Server responded with:', error.response.data);
          setErrors(error.response.data.error || 'An error occurred during login.');
        } else {
          console.error('Error message:', error.message);
          setErrors('An error occurred. Please try again.');
        }
      }
    }
  };

  return (
    <div className="auth-container">
      <h2>{isLogin ? 'Login' : 'Signup'}</h2>
      <form onSubmit={isLogin ? handleLogin : handleSignup}>
        {!isLogin && (
          <>
            <input
              type="text"
              name="firstname"
              placeholder="First Name"
              value={formData.firstname}
              onChange={handleChange}
              required 
              className='INPUTS'
            />
            <input
              type="text"
              name="lastname"
              placeholder="Last Name"
              value={formData.lastname}
              onChange={handleChange}
              required 
              className='INPUTS'
            />
          </>
        )}
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required 
          className='INPUTS'
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required 
          className='INPUTS'
        />
        {!isLogin && (
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required 
            className='INPUTS'
          />
        )}
        {errors && <p className="error-message">{errors}</p>}
        <button type="submit" className='Submit-btn'>{isLogin ? 'Login' : 'Sign Up'}</button>
      </form>
      <p onClick={() => setIsLogin(!isLogin)} className="toggle-auth">
        {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Login'}
      </p>
      {message && <p className="success-message">{message}</p>}
    </div>
  );
};

export default Auth;
