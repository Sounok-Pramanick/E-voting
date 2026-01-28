import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminLogin.css';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState('');

  const correctPassword = "Admin@123"; // admin password

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === correctPassword) {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError("Incorrect password! Try again.");
    }
  };

  return (
    <div className="admin-container">
      {!isAuthenticated ? (
        <form onSubmit={handleLogin} className="admin-login">
          <button 
            className="back-btn"
            onClick={() => navigate('/')}
            type="button"
          >
            ← Back
          </button>
          <h2 className="admin-title">Admin Login</h2>
          <input
            type="password"
            placeholder="Enter Admin Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="admin-input"
          />
          <button type="submit" className="admin-btn">Login</button>
          {error && <p className="error-text">{error}</p>}
        </form>
      ) : (
        <div className="admin-dashboard">
          <button 
            className="back-btn"
            onClick={() => navigate('/')}
          >
            ← Back
          </button>
          <h2 className="admin-title">Admin Dashboard</h2>
          <div className="admin-options">
            <button 
              className="admin-btn" 
              onClick={() => navigate('/update-expiry')}
            >
              Update Expiry Status
            </button>
            <button 
              className="admin-btn" 
              onClick={() => navigate('/update-authenticate')}
            >
              Update Authenticate Status
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLogin;
