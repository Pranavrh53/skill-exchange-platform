import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signup } from '../api/auth';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: '',
  });
  const navigate = useNavigate();

  const { name, email, password, password2 } = formData;

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    if (password !== password2) {
      alert('Passwords do not match');
      return;
    }
    
    try {
      const userData = { name, email, password };
      console.log('Signup attempt with:', userData);
      const response = await signup(userData);
      console.log('Signup successful:', response.data);
      alert('Signup successful! Please login.');
      navigate('/login');
    } catch (error) {
      console.error('Signup error:', error);
      alert('Signup failed: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-3xl font-bold mb-5">Sign Up</h1>
      <form onSubmit={onSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Name</label>
          <input
            type="text"
            className="w-full px-3 py-2 border rounded"
            name="name"
            value={name}
            onChange={onChange}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Email Address</label>
          <input
            type="email"
            className="w-full px-3 py-2 border rounded"
            name="email"
            value={email}
            onChange={onChange}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Password</label>
          <input
            type="password"
            className="w-full px-3 py-2 border rounded"
            name="password"
            value={password}
            onChange={onChange}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Confirm Password</label>
          <input
            type="password"
            className="w-full px-3 py-2 border rounded"
            name="password2"
            value={password2}
            onChange={onChange}
            required
          />
        </div>
        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
          Sign Up
        </button>
      </form>
      <p className="mt-4">
        Already have an account? <Link to="/login" className="text-blue-500">Login</Link>
      </p>
    </div>
  );
};

export default Signup;
