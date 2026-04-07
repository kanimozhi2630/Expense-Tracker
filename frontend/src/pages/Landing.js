import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Login from './Login';
import '../styles/Landing.css';

const Landing = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      <nav className="landing-nav">
        <div className="nav-brand">
          <h2>💰 SplitWise</h2>
        </div>
        <div className="nav-buttons">
          <button className="btn btn-outline" onClick={() => { setIsRegister(false); setShowLogin(true); }}>
            Login
          </button>
          <button className="btn btn-primary" onClick={() => { setIsRegister(true); setShowLogin(true); }}>
            Sign Up
          </button>
        </div>
      </nav>

      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Smart Group Expense Management</h1>
          <p className="hero-subtitle">
            Split bills, track expenses, and settle up with friends easily. 
            Perfect for trips, roommates, and group activities.
          </p>
          <button className="btn btn-primary btn-large" onClick={() => { setIsRegister(true); setShowLogin(true); }}>
            Get Started Free
          </button>
        </div>
        <div className="hero-image">
          <div className="expense-card-demo">
            <div className="demo-card">
              <div className="demo-icon">🎉</div>
              <h3>Create Groups</h3>
              <p>Organize expenses by trip or event</p>
            </div>
            <div className="demo-card">
              <div className="demo-icon">💳</div>
              <h3>Track Expenses</h3>
              <p>Add and categorize all spending</p>
            </div>
            <div className="demo-card">
              <div className="demo-icon">⚖️</div>
              <h3>Split Fairly</h3>
              <p>Calculate who owes whom instantly</p>
            </div>
          </div>
        </div>
      </section>

      <section className="features-section">
        <h2 className="section-title">Why Choose SplitWise?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Smart Analytics</h3>
            <p>Visualize spending patterns with charts and insights</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">💬</div>
            <h3>Group Chat</h3>
            <p>Communicate with group members in real-time</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔔</div>
            <h3>Notifications</h3>
            <p>Stay updated with instant alerts for new expenses</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🎯</div>
            <h3>Budget Tracking</h3>
            <p>Set budgets and get alerts when limits are reached</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">👥</div>
            <h3>Easy Collaboration</h3>
            <p>Add members and manage groups effortlessly</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔒</div>
            <h3>Secure & Private</h3>
            <p>Your data is encrypted and protected</p>
          </div>
        </div>
      </section>

      {showLogin && (
        <div className="modal-overlay" onClick={() => setShowLogin(false)}>
          <div className="modal-auth" onClick={(e) => e.stopPropagation()}>
            <button 
              className="modal-close"
              onClick={() => setShowLogin(false)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'transparent',
                border: 'none',
                fontSize: '24px',
                cursor: 'pointer',
                color: 'var(--text-light)'
              }}
            >
              ×
            </button>
            <Login isRegisterMode={isRegister} onSuccess={() => navigate('/dashboard')} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Landing;
