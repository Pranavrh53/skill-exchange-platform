import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold">Welcome to the Skill Exchange Platform</h1>
      <p className="mt-4">Find people to swap skills with!</p>
      <div className="mt-8">
        <Link to="/login" className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 mx-2">
          Login
        </Link>
        <Link to="/signup" className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 mx-2">
          Sign Up
        </Link>
      </div>
    </div>
  );
};

export default Home;
