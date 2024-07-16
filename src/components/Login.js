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
    <div className="form-container">
      <p className="title">Welcome back</p>
      <form className="form" onSubmit={handleSubmit}>
        <input name="email" type="email" className="input" placeholder="Email" onChange={handleChange} />
        <input name="password" type="password" className="input" placeholder="Password" onChange={handleChange} />
        <p className="page-link">
          <span className="page-link-label">Forgot Password?</span>
        </p>
        <button className="form-btn">Log in</button>
      </form>
      <p className="sign-up-label">
        Don't have an account? <span className="sign-up-link"><a href="/register">Sign up</a></span>
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
}

export default Login;
