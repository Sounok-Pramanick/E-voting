import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './VotePoll.css';

const partyOptions = [
  { id: 1, name: "All India Trinamool Congress", logo: "aitc.png" },
  { id: 2, name: "Bharatiya Janata Party", logo: "bjp.png" },
  { id: 3, name: "Indian National Congress", logo: "inc.png" },
  { id: 4, name: "Communist Party of India", logo: "cpi.png" },
  { id: 5, name: "Bahujan Samaj Party", logo: "bsp.png" },
  { id: 9, name: "NOTA", logo: "nota.png" }
];

const VotePoll = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const voterData = location.state?.voterData;
  const [showVoting, setShowVoting] = useState(false);
  const [selectedParty, setSelectedParty] = useState(null);
  const [timeLeft, setTimeLeft] = useState(30);

  const today = new Date();
  const formattedDate = `${today.getDate().toString().padStart(2, '0')} - ${(
    today.getMonth() + 1
  )
    .toString()
    .padStart(2, '0')} - ${today.getFullYear()}`;

  const votingTime = { start: "09 : 00", end: "17 : 00" };

  useEffect(() => {
    if (voterData && voterData.remarks == 1) {
      alert("Your vote has already been polled!");
      navigate("/");
    }
  }, [voterData, navigate]);

  useEffect(() => {
    let timer;
    if (showVoting && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft === 0) {
      alert("Voting session ended. Recording your response...");
      autoSubmitVote();
    }
    return () => clearInterval(timer);
  }, [showVoting, timeLeft]);

  useEffect(() => {
    if (showVoting) {
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    }
  }, [showVoting]);

  const handleSubmitVote = async () => {
    if (!selectedParty) {
      alert("Please select a party before submitting!");
      return;
    }

    if (!voterData) {
      alert("Voter data not found. Cannot submit vote.");
      navigate("/");
      return;
    }

    try {
      const response = await fetch("http://localhost/evoting/store_vote.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          constituency: voterData.constituency,
          assembly: voterData.assembly,
          ward_no: voterData.ward_no,
          poll_no: selectedParty,
          gender: voterData.gender, // send M or F
          mob: voterData.mob
        })
      });

      const result = await response.json();
      if (result.success) {
        alert("Your vote has been recorded successfully!");
      } else {
        alert("Error recording vote: " + result.message);
      }
      navigate("/");
    } catch (error) {
      console.error("Error submitting vote:", error);
      alert("Server error. Try again later.");
      navigate("/");
    }
  };

  const autoSubmitVote = async () => {
    if (!voterData) {
      alert("Voter data not found. Cannot record vote.");
      navigate("/");
      return;
    }

    try {
      const response = await fetch("http://localhost/evoting/store_vote.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          constituency: voterData.constituency,
          assembly: voterData.assembly,
          ward_no: voterData.ward_no,
          poll_no: 0,
          gender: voterData.gender,
          mob: voterData.mob
        })
      });

      const result = await response.json();
      if (result.success) {
        alert("Your vote has been recorded successfully!");
      } else {
        alert("Error recording vote: " + result.message);
      }
      navigate("/");
    } catch (error) {
      console.error("Error auto-submitting vote:", error);
      alert("Server error. Try again later.");
      navigate("/");
    }
  };

  return (
    <div className="vote-poll-container">
      <div className="top-bar">
        <button className="back-btn" onClick={() => navigate("/")}>
          ← Back
        </button>
      </div>

      <h2>Upcoming Election: State Assembly Election</h2>
      <p><strong>Election Date:</strong> {formattedDate}</p>
      <p><strong>Voting Time:</strong> {votingTime.start} - {votingTime.end}</p>

      <h3>Contestants:</h3>
      <div className="party-list-vertical">
        {partyOptions.map((party) => (
          <div key={party.id} className="party-record">
            <img
              src={`/logos/${party.logo}`}
              alt={party.name}
              className="party-logo"
            />
            <span className="party-name">{party.name}</span>
          </div>
        ))}
      </div>

      {!showVoting ? (
        <button className="vote-now-btn" onClick={() => setShowVoting(true)}>
          Vote Now
        </button>
      ) : (
        <div className="voting-section">
          <h3>Time Left: {timeLeft} sec</h3>
          <h3>Select Your Party:</h3>
          <div className="party-list-vertical">
            {partyOptions.map((party) => (
              <label key={party.id} className="party-record">
                <input
                  type="radio"
                  name="party"
                  value={party.id}
                  checked={selectedParty === party.id}
                  onChange={() => setSelectedParty(party.id)}
                />
                <img
                  src={`/logos/${party.logo}`}
                  alt={party.name}
                  className="party-logo"
                />
                <span className="party-name">{party.name}</span>
              </label>
            ))}
          </div>
          <button className="submit-vote-btn" onClick={handleSubmitVote}>
            Submit Vote
          </button>
        </div>
      )}
    </div>
  );
};

export default VotePoll;
