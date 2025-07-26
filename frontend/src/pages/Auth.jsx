import React, { useState } from 'react';
import Login from '../components/Login';
import Signup from '../components/Signup';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="relative">
      {isLogin ? (
        <Login onSwitchToSignup={() => setIsLogin(false)} />
      ) : (
        <Signup onSwitchToLogin={() => setIsLogin(true)} />
      )}
    </div>
  );
};

export default Auth;
