import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(formData.email, formData.password);
    if (success) {
      toast.success('Login successful');
      navigate('/');
    } else {
      toast.error('Invalid credentials');
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm">
        <h2 className="text-xl font-semibold mb-4">Admin Login</h2>

        <div className="form-group">
          <label className="label">Email</label>
          <input
            name="email"
            type="email"
            required
            className="input"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label className="label">Password</label>
          <input
            name="password"
            type="password"
            required
            className="input"
            value={formData.password}
            onChange={handleChange}
          />
        </div>

        <button type="submit" className="btn-primary w-full mt-2">Login</button>
      </form>
    </div>
  );
};

export default Login;