import React, { useState } from 'react';
import { auth } from '../utils/api';
import '../styles/Auth.css';

const Login = ({ isRegisterMode = false, onSuccess }) => {
  const [isLogin, setIsLogin] = useState(!isRegisterMode);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = isLogin 
        ? await auth.login({ email: formData.email, password: formData.password })
        : await auth.register(formData);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      if (onSuccess) onSuccess();
    } catch (err) {
      alert(err.response?.data?.message || 'An error occurred');
    }
  };

  return (
    <div className="auth-form-container">
      <h1 className="auth-title">{isLogin ? 'Welcome Back' : 'Create Account'}</h1>
      <p className="auth-subtitle">{isLogin ? 'Login to continue' : 'Sign up to get started'}</p>
      
      <form onSubmit={handleSubmit} className="auth-form">
          {!isLogin && (
            <input
              type="text"
              placeholder="Full Name"
              className="input"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          )}
          <input
            type="email"
            placeholder="Email"
            className="input"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="input"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />
          <button type="submit" className="btn btn-primary auth-btn">
            {isLogin ? 'Login' : 'Register'}
          </button>
        </form>

        <p className="auth-toggle">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <span onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? 'Register' : 'Login'}
          </span>
        </p>
    </div>
  );
};

export default Login;
