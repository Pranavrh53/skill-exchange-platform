import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../api/auth';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const navigate = useNavigate();

  const { email, password } = formData;

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    
    try {
      console.log('Login attempt with:', formData);
      const response = await login(formData);
      console.log('Login successful:', response.data);
      
      // Store the token in localStorage
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      
      alert('Login successful!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-3xl font-bold mb-5">Login</h1>
      <form onSubmit={onSubmit}>
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
        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
          Login
        </button>
      </form>
      <p className="mt-4">
        Don't have an account? <Link to="/signup" className="text-blue-500">Sign Up</Link>
      </p>
    </div>
  );
};

export default Login;
