import React, { useState } from 'react';
import Login from './Login';
import Register from './Register';
import loginImage from '../assets/login-image.jpg'; // your image path

const AuthCard = () => {
  const [isLoginActive, setIsLoginActive] = useState(true);
  const toggleForm = () => setIsLoginActive((prev) => !prev);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      {/* Auth Card Container */}
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg overflow-hidden flex flex-col md:flex-row h-96">
        {/* Left Side */}
        <div className="w-full md:w-1/2 flex items-center justify-center">
          {isLoginActive ? (
            // Login is active - Login form on left
            <div className="w-full h-full p-8 flex items-center justify-center">
              <div className="w-full max-w-md">
                <Login />
              </div>
            </div>
          ) : (
            // Register is active - Image on left
            <div className="h-full w-full">
              <img 
                src={loginImage} 
                alt="Login" 
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>
        
        {/* Right Side */}
        <div className="w-full md:w-1/2 flex items-center justify-center">
          {isLoginActive ? (
            // Login is active - Image on right
            <div className="h-full w-full">
              <img 
                src={loginImage} 
                alt="Login" 
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            // Register is active - Register form on right
            <div className="w-full h-full p-8 flex items-center justify-center">
              <div className="w-full max-w-md">
                <Register />
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Toggle Button - Below Card */}
      <div className="mt-6 text-center">
        <p className="text-gray-600">
          {isLoginActive ? "Don't have an account?" : "Already have an account?"}
          <button
            onClick={toggleForm}
            className="ml-2 text-blue-600 hover:text-blue-800 font-medium"
          >
            {isLoginActive ? "Register now" : "Login now"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthCard;