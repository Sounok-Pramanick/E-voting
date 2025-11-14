import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './VoterProfile.css';

const VoterProfile = () => {
  const [voterData, setVoterData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showOptions, setShowOptions] = useState(false); // NEW
  const location = useLocation();
  const navigate = useNavigate();
  const mobile = location.state?.mobile;

  useEffect(() => {
    const fetchVoterData = async () => {
      try {
        const response = await fetch('http://localhost/evoting/get_voter.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ mobile }),
        });

        const data = await response.json();

        if (data.success) {
          setVoterData(data.voter);
        } else {
          setError(data.message || 'Failed to load voter data');
        }
      } catch (err) {
        setError('Connection error. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (mobile) fetchVoterData();
  }, [mobile]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToBottom = () => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  };

  const handleLogout = () => {
    navigate('/');  // Go back to HomePage.jsx route
  };

  if (loading) return <div className="profile-container">Loading...</div>;
  if (error) return <div className="profile-container error">{error}</div>;

  return (
    <div className="profile-container">
      <button 
        className="back-btn"
        onClick={() => navigate('/')}
      >
        ← Back
      </button>
      <h1>Voter Profile</h1>
      <div className="profile-card">
        <ProfileRow label="Voter UID" value={voterData.voter_uid} />
        <ProfileRow label="Aadhar UID" value={voterData.aadhar_uid} />
        <ProfileRow label="Name" value={voterData.name} />
        <ProfileRow label="Father/Husband's Name" value={voterData.father_or_husband_name} />
        <ProfileRow label="Gender" value={voterData.gender} />
        <ProfileRow label="Age" value={voterData.age} />
        <ProfileRow label="House No." value={voterData.house_no} />
        <ProfileRow label="Street Name" value={voterData.street_name} />
        <ProfileRow label="Location" value={voterData.location} />
        <ProfileRow label="City" value={voterData.city} />
        <ProfileRow label="State" value={voterData.state} />
        <ProfileRow label="Pincode" value={voterData.pincode} />
        <ProfileRow label="Mobile" value={voterData.mob} />
        <ProfileRow label="Email" value={voterData.email} />
        <ProfileRow label="Constituency" value={voterData.constituency} />
        <ProfileRow label="Assembly" value={voterData.assembly} />
        <ProfileRow label="Ward No." value={voterData.ward_no} />
        <ProfileRow label="Remarks" value={voterData.remarks} />
      </div>

      {/* Show Options Button */}
      <button 
        className="proceed-btn"
        onClick={() => setShowOptions(!showOptions)}
      >
        Proceed →
      </button>

      {/* Conditional Options */}
      {showOptions && (
        <div className="options-container">
          <button 
            className="option-btn"
            onClick={() => navigate('/election-result')}
          >
            📊 View Election Results
          </button>
          <button 
            className="option-btn"
            onClick={() => navigate('/vote-poll', { state: { voterData } })}
          >
            🗳️ Cast Your Vote
          </button>
        </div>
      )}

      {/* Go to Bottom Button */}
      <button onClick={scrollToBottom} className="goto-bottom">↓</button>

      {/* Go to Top Button */}
      <button onClick={scrollToTop} className="goto-top">↑</button>

      {/* Logout Button */}
      <button onClick={handleLogout} className="logout-fixed">Logout</button>
    </div>
  );
};

const ProfileRow = ({ label, value }) => (
  <div className="profile-row">
    <span className="label">{label}:</span>
    <span className="value">{value || '-'}</span>
  </div>
);

export default VoterProfile;
