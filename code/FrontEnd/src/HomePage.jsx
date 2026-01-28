import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost/evoting/init_db.php")
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          console.log("DB init success:", data.message);
          setLoading(false);
        } else {
          console.error("DB init error:", data.message);
          setError("Database setup failed. Please contact the administrator.");
          setLoading(false);
        }
      })
      .catch(err => {
        console.error("DB fetch error:", err);
        setError("Database setup failed... Please contact the administrator.");
        setLoading(false);
      });
  }, []);


  // 🕓 While database is being initialized
  if (loading) {
    return (
      <div className="loading-screen">
        <h2>Setting up the system...</h2>
        <p>Please wait while we prepare the database.</p>
      </div>
    );
  }

  // ❌ If something went wrong
  if (error) {
    return (
      <div className="error-screen">
        <h2>{error}</h2>
      </div>
    );
  }

  // ✅ Normal homepage content
  return (
    <div className="home-container">
      <div className="navbar">
        <div className="navbar-menu">
          <button className="nav-link" onClick={() => navigate('/login')}>Voter Login</button>
          <button className="nav-link" onClick={() => navigate('/candidate-login')}>Candidate Login</button>
          <button className="nav-link" onClick={() => navigate('/admin-login')}>Admin Login</button>
          <button className="nav-link highlight" onClick={() => navigate('/signup')}>New Registration</button>
        </div>
      </div>
      <button className="election-result" onClick={() => navigate('/election-result')}>Election Results</button>

      <div className="hero-section">
        <h1 className="hero-title">India's First Blockchain-Based E-Voting System</h1>
        <p className="hero-subtitle">Secure. Transparent. Accessible.</p>

        <div className="stats-container">
          <div className="stat-card1">
            <h3>1.4 Billion+</h3>
            <p>Eligible Voters</p>
          </div>
          <div className="stat-card2">
            <h3>29 States</h3>
            <p>7 Union Territories</p>
          </div>
          <div className="stat-card3">
            <h3>100%</h3>
            <p>Verifiable Results</p>
          </div>
        </div>

        <button
          className="cta-btn"
          onClick={() => window.open("https://www.eci.gov.in/", "_blank")}
        >
          Learn More →
        </button>
      </div>

      <footer className="footer">
        <p>© 2023 Election Commission of India. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default HomePage;
