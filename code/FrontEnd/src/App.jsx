import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './HomePage';
import LoginPage from './LoginPage';
import VoterProfile from './VoterProfile';
import CandidateProfile from './CandidateProfile';
import Signup from './Signup';
import CandidateLogin from './CandidateLogin';
import AdminLogin from './AdminLogin';
import UpdateExpiry from './UpdateExpiry';
import UpdateAuthenticate from './UpdateAuthenticate';
import ElectionResult from './ElectionResult';
import VotePoll from './VotePoll';
import DownloadCsv from './DownloadCsv';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/profile" element={<VoterProfile />} />
          <Route path="/candidate-profile" element={<CandidateProfile />} />
          <Route path="/candidate-login" element={<CandidateLogin />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/update-authenticate" element={<UpdateAuthenticate />} />
          <Route path="/update-expiry" element={<UpdateExpiry />} />
          <Route path="/election-result" element={<ElectionResult />} />
          <Route path="/vote-poll" element={<VotePoll />} />
          <Route path="/download" element={<DownloadCsv />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
