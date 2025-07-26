import React from 'react';
import Login from '../components/Login';
import Signup from '../components/Signup';

const Auth = () => {
  return (
    <div className="flex justify-center space-x-8">
      <Login />
      <Signup />
    </div>
  );
};

export default Auth;
