import React, { useState } from 'react';
import './Register.css';

function Register() {
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your form submission logic here
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
      <button className="submit">Submit</button>
      <p className="signin">Already have an account? <a href="/login">Signin</a></p>
    </form>
  );
}

export default Register;
