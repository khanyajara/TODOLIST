import React, { useState } from 'react';
import './Register.css';
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
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
  const [isShow, setIsShow] = useState(false);
  const [isShow2, setIsShow2] = useState(false);
  const [isShow3, setIsShow3] = useState(false);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };
    const handleShow = () => {
      setIsShow(true);
      setIsShow2(false);
      setIsShow3(false);
      }
      const handleShow2 = () => {
        setIsShow2(true);
        setIsShow(false);
        setIsShow3(false);
        }
        const handleShow3 = () => {
          setIsShow3(true);
          setIsShow(false);
          setIsShow2(false);
          }
          const handleSubmit = (e) => {
            e.preventDefault();
            setErrors(validate(formData));
            setIsSubmit(true);
            setIsDisabled(false);
            setIsError(false);
            setIsSuccess(true);
            }
            const validate = (values) => {
              let errors = {};
              const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
              if (!values.firstname) {
                errors.firstname = 'First Name is required';
                }
                if (!values.lastname) {
                  errors.lastname = 'Last Name is required';
                  }
                  if (!values.email) {
                    errors.email = 'Email is required';
                    }
                    if (!values.password) {
                      errors.password = 'Password is required';
                      }
                      if (!values.confirmPassword) {
                        errors.confirmPassword = 'Confirm Password is required';
                        }
                        if (values.password !== values.confirmPassword) {
          errors.confirmPassword = 'Password and Confirm Password must be same';
          }
          return errors;
          };
          const handleReset = () => {
            setIsSubmit(false);
            setIsDisabled(true);
            setIsError(false);
            setIsSuccess(false);
            setIsShow(false);
            setIsShow2(false);
            setIsShow3(false);
            setErrors({});
            setFormData({
              firstname: '',
              lastname: '',
              email: '',
              password: '',
              confirmPassword: '',
              });
              }
             


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
      <button onClick={handleSubmit} className="submit"><Link to="/">Sign-up</Link></button>
      <p className="signin">Already have an account? <a href="/login">Signin</a></p>
    </form>
  );
}

export default Register;
