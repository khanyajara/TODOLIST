import React, { useState } from 'react';
import './Register.css';
import axios from 'axios';
import { Link } from 'react-router-dom';

function Register() {
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors(validate(formData));
    setIsSubmit(true);

    try {
      const response = await axios.post('http://localhost:3001/register', formData);
      console.log(response.data); // Assuming successful registration
      setIsDisabled(false); // Enable form if registration succeeds
    } catch (error) {
      console.error('Registration error:', error);
      setIsDisabled(true); // Disable form if registration fails
    }
  };

  const validate = (values) => {
    let errors = {};
    // Validation logic
    return errors;
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <p className="title">Register</p>
      <p className="message">Signup now and get full access to our app.</p>
      <div className="flex">
        <label>
          <input required name="firstname" type="text" className="input" onChange={handleChange} />
          <span>Firstname</span>
        </label>
        <label>
          <input required name="lastname" type="text" className="input" onChange={handleChange} />
          <span>Lastname</span>
        </label>
      </div>
      <label>
        <input required name="email" type="email" className="input" onChange={handleChange} />
        <span>Email</span>
      </label>
      <label>
        <input required name="password" type="password" className="input" onChange={handleChange} />
        <span>Password</span>
      </label>
      <label>
        <input required name="confirmPassword" type="password" className="input" onChange={handleChange} />
        <span>Confirm password</span>
      </label>
      <button type="submit" className="submit">Sign-up</button>
      <p className="signin">Already have an account? <Link to="/login">Signin</Link></p>
    </form>
  );
}

export default Register;
