import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./CandidateProfile.css";

const partyOptions = {
  "All India Trinamool Congress": { short: "AITC", logo: "aitc.png" },
  "Bharatiya Janata Party": { short: "BJP", logo: "bjp.png" },
  "Indian National Congress": { short: "INC", logo: "inc.png" },
  "Communist Party of India": { short: "CPI", logo: "cpi.png" },
  "Bahujan Samaj Party": { short: "BSP", logo: "bsp.png" },
};

const CandidateProfile = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const mobile = location.state?.mobile;

  const [candidate, setCandidate] = useState(null);
  const [voter, setVoter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  const [formData, setFormData] = useState({
    election: "",
    election_cons: "",
    election_assembly: "",
    election_ward: "",
    party_name: "",
    party_shortform: "",
    logo: "",
    authenticated_initial: "TD", // fixed for now
  });

  useEffect(() => {
    if (mobile) {
      fetch(`http://localhost/evoting/get_candidate.php?mobile=${mobile}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.exists) {
            setCandidate(data.candidate);
          }
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [mobile]);

  const handleBecomeCandidate = () => {
    fetch("http://localhost/evoting/get_voter.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mobile }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setVoter(data.voter);
          setShowForm(true);
        } else {
          alert("Voter not found!");
        }
      });
  };

  const handlePartySelect = (partyName) => {
    const selected = partyOptions[partyName];
    setFormData((prev) => ({
      ...prev,
      party_name: partyName,
      party_shortform: selected ? selected.short : "",
      logo: selected ? selected.logo : "",
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setPreviewMode(true);
  };

  const handleFinalSubmit = () => {
    fetch("http://localhost/evoting/register_candidate.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...voter, ...formData }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          alert("You are now registered as a candidate!");
          setCandidate({ ...voter, ...formData });
          setShowForm(false);
          setPreviewMode(false);
        } else {
          alert("Registration failed: " + data.error);
        }
      });
  };

  const handleLogout = () => {
    sessionStorage.clear();
    localStorage.clear();
    navigate("/");
  };

  if (loading) return <div className="profile-container">Loading...</div>;

  const dbFields = [
    "voter_uid", "aadhar_uid", "name", "age", "house_no", "street_name", "location",
    "pincode", "remarks", "state", "city", "mob", "constituency", "assembly", "ward_no",
    "email", "gender", "father_or_husband_name", "expire", "authenticated_initial",
    "election", "election_cons", "election_assembly", "election_ward",
    "party_name", "party_shortform", "logo"
  ];

  return (
    <div className="profile-container">
      <div className="top-bar">
        <button className="back-btn" onClick={() => navigate("/candidate-login")}>
          ← Back
        </button>
      </div>

      {candidate ? (
        <>
          <h1>Candidate Profile</h1>
          <div className="profile-card">
            {dbFields.map((field) =>
              field === "logo" ? null : (
                <ProfileRow
                  key={field}
                  label={field.replace(/_/g, " ")}
                  value={candidate[field]}
                />
              )
            )}

            {/* Centered Party Logo Tab */}
            <div className="profile-row logo-center">
              <span className="label">Party Logo</span>
              {candidate.logo ? (
                <div className="logo-wrapper">
                  <img
                    src={`/logos/${candidate.logo}`}
                    alt="Party Logo"
                  />
                </div>
              ) : (
                "-"
              )}
            </div>
          </div>
        </>
      ) : showForm && voter ? (
        previewMode ? (
          <div className="preview-form">
            <h1>Preview Candidate Registration</h1>
            {dbFields.map((field) =>
              field === "logo" ? (
                <div key={field} className="profile-row logo-center">
                  <span className="label">Party Logo</span>
                  {formData.logo ? (
                    <div className="logo-wrapper">
                      <img src={`/logos/${formData.logo}`} alt="Party Logo" />
                    </div>
                  ) : (
                    "-"
                  )}
                </div>
              ) : (
                <ProfileRow
                  key={field}
                  label={field.replace(/_/g, " ")}
                  value={voter[field] || formData[field]}
                />
              )
            )}
            <div className="preview-buttons">
              <button className="edit-btn" onClick={() => setPreviewMode(false)}>
                ← Edit
              </button>
              <button className="submit-btn" onClick={handleFinalSubmit}>
                Submit
              </button>
            </div>
          </div>
        ) : (
          <form className="candidate-form" onSubmit={handleSubmit}>
            <h1>Candidate Registration</h1>
            {dbFields.map((field) =>
              voter[field] ? (
                <ProfileRow
                  key={field}
                  label={field.replace(/_/g, " ")}
                  value={voter[field]}
                />
              ) : null
            )}

            <label>Election Year</label>
            <input
              type="number"
              value={formData.election}
              onChange={(e) =>
                setFormData({ ...formData, election: e.target.value })
              }
              required
            />

            <label>Election Constituency</label>
            <input
              type="number"
              value={formData.election_cons}
              onChange={(e) =>
                setFormData({ ...formData, election_cons: e.target.value })
              }
              required
            />

            <label>Election Assembly</label>
            <input
              type="number"
              value={formData.election_assembly}
              onChange={(e) =>
                setFormData({ ...formData, election_assembly: e.target.value })
              }
              required
            />

            <label>Election Ward</label>
            <input
              type="number"
              value={formData.election_ward}
              onChange={(e) =>
                setFormData({ ...formData, election_ward: e.target.value })
              }
              required
            />

            <label>Party Name</label>
            <select
              value={formData.party_name}
              onChange={(e) => handlePartySelect(e.target.value)}
              required
            >
              <option value="">-- Select Party --</option>
              {Object.keys(partyOptions).map((party) => (
                <option key={party} value={party}>
                  {party}
                </option>
              ))}
            </select>

            <button type="submit">Preview</button>
          </form>
        )
      ) : (
        <div className="decision-card">
          <h1>You are not a candidate yet.</h1>
          <p>Would you like to become one?</p>
          <div className="decision-buttons">
            <button onClick={handleBecomeCandidate}>Yes</button>
            <button onClick={() => navigate("/")}>No</button>
          </div>
        </div>
      )}

      <div className="logout-container">
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
};

const ProfileRow = ({ label, value }) => (
  <div className="profile-row">
    <span className="label">{label}:</span>
    <span className="value">{value || "-"}</span>
  </div>
);

export default CandidateProfile;
