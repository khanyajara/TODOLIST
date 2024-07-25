import React, { useState } from 'react';
import './Register.css';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

function Register() {
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors(validate(formData));

    if (Object.keys(errors).length === 0) {
      setLoading(true);
      try {
        const response = await axios.post('http://localhost:3000/register', formData);
        console.log(response.data); // Assuming successful registration
        alert('Registration successful!');
        setFormData({
          firstname: '',
          lastname: '',
          email: '',
          password: '',
          confirmPassword: ''
        });
        setLoading(false);
        navigate('/login');
      } catch (error) {
        console.error('Registration error:', error);
        setLoading(false);
        // Handle specific errors here if needed
      }
    }
  };

  const validate = (values) => {
    let errors = {};
    if (!values.firstname) errors.firstname = 'First name is needed.';
    if (!values.lastname) errors.lastname = 'Last name is needed.';
    if (!values.email || !/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(values.email)) {
      errors.email = 'Invalid email format.';
    }
    if (!values.password) errors.password = 'Password is needed.';
    if (values.password !== values.confirmPassword) {
      errors.confirmPassword = 'Passwords aren\'t matching.';
    }
    return errors;
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <p className="title">Register</p>
      <p className="message">Signup now and get full access to our app.</p>
      <div className="flex">
        <label>
          <input
            required
            name="firstname"
            type="text"
            className="input"
            value={formData.firstname}
            onChange={handleChange}
          />
          <span>Firstname</span>
          {errors.firstname && <p className="error">{errors.firstname}</p>}
        </label>
        <label>
          <input
            required
            name="lastname"
            type="text"
            className="input"
            value={formData.lastname}
            onChange={handleChange}
          />
          <span>Lastname</span>
          {errors.lastname && <p className="error">{errors.lastname}</p>}
        </label>
      </div>
      <label>
        <input
          required
          name="email"
          type="email"
          className="input"
          value={formData.email}
          onChange={handleChange}
        />
        <span>Email</span>
        {errors.email && <p className="error">{errors.email}</p>}
      </label>
      <label>
        <input
          required
          name="password"
          type="password"
          className="input"
          value={formData.password}
          onChange={handleChange}
        />
        <span>Password</span>
        {errors.password && <p className="error">{errors.password}</p>}
      </label>
      <label>
        <input
          required
          name="confirmPassword"
          type="password"
          className="input"
          value={formData.confirmPassword}
          onChange={handleChange}
        />
        <span>Confirm password</span>
        {errors.confirmPassword && <p className="error">{errors.confirmPassword}</p>}
      </label>
      <button type="submit" className="submit" disabled={loading}>
        {loading ? <em>Submitting...</em> : <em>Sign-up</em>}
      </button>
      <p className="signin">Already have an account? <Link to="/login">Signin</Link></p>
    </form>
  );
}

export default Register;
