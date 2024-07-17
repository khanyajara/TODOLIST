import React, { useState } from 'react';
import './Login.css';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };
   

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your login logic here
  };
  return (
    <div className="login">
      <h1>Login</h1>
      <form onSubmit={handleSubmit}></form>
      <input
      type="text"
      name="email"
      value={formData.email}
      onChange={handleChange}
      placeholder="Email"
      />
      <input
      type="password"
      name="password"
      value={formData.password}
      onChange={handleChange}
      placeholder="Password"
      />
      <button type="submit">Login</button>
      </div>
      );
      }
      export default Login;
    


  



