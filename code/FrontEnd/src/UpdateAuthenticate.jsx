import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './UpdateAuthenticate.css';

const UpdateAuthenticate = () => {
  const navigate = useNavigate();
  const [voters, setVoters] = useState([]);
  const [selected, setSelected] = useState([]);
  const [statusMessage, setStatusMessage] = useState('');

  // Fetch all voters when page loads
  useEffect(() => {
    const fetchVoters = async () => {
      try {
        const response = await fetch("http://localhost/evoting/get_all_voters.php");
        const data = await response.json();
        if (Array.isArray(data)) {
          setVoters(data);
        } else {
          console.error("Invalid response:", data);
        }
      } catch (err) {
        console.error("Error fetching voter data:", err);
      }
    };
    fetchVoters();
  }, []);

  const handleSelect = (voter_uid) => {
    setSelected((prev) =>
      prev.includes(voter_uid) ? prev.filter((id) => id !== voter_uid) : [...prev, voter_uid]
    );
  };

  const handleSelectAll = () => {
    if (selected.length === voters.length) {
      setSelected([]);
    } else {
      setSelected(voters.map((v) => v.voter_uid));
    }
  };

  const handleApprove = async () => {
    if (selected.length === 0) {
      alert("Please select at least one record.");
      return;
    }

    try {
      const response = await fetch("http://localhost/evoting/approve_voters.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ voter_ids: selected }),
      });

      const result = await response.json();
      if (result.success) {
        setStatusMessage(result.message);
        setVoters((prev) => prev.filter((v) => !selected.includes(v.voter_uid)));
        setSelected([]);
      } else {
        setStatusMessage("Error: " + result.message);
      }
    } catch (err) {
      console.error("Error approving voters:", err);
      setStatusMessage("An error occurred while approving.");
    }
  };

  return (
    <div className="admin-dashboard">
      <button 
        className="back-btn"
        onClick={() => navigate('/admin-login')}
      >
        ← Back
      </button>
      <h2 className="admin-title">Voters to be Authenticated</h2>

      {statusMessage && <p className="status-text">{statusMessage}</p>} 

      <div className="table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  onChange={handleSelectAll}
                  checked={selected.length === voters.length && voters.length > 0}
                />
              </th>
              <th>Voter UID</th>
              <th>Aadhar UID</th>
              <th>Name</th>
              <th>DOB</th>
              <th>House No</th>
              <th>Street</th>
              <th>Location</th>
              <th>Pincode</th>
              <th>Remarks</th>
              <th>State</th>
              <th>City</th>
              <th>Mobile</th>
              <th>Constituency</th>
              <th>Assembly</th>
              <th>Ward No</th>
              <th>Email</th>
              <th>Gender</th>
              <th>Father/Husband Name</th>
              <th>Expiry</th>
            </tr>
          </thead>
          <tbody>
            {voters.length > 0 ? (
              voters.map((voter, index) => (
                <tr key={index}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selected.includes(voter.voter_uid)}
                      onChange={() => handleSelect(voter.voter_uid)}
                    />
                  </td>
                  <td>{voter.voter_uid}</td>
                  <td>{voter.aadhar_uid}</td>
                  <td>{voter.name}</td>
                  <td>{voter.dob}</td>
                  <td>{voter.house_no}</td>
                  <td>{voter.street_name}</td>
                  <td>{voter.location}</td>
                  <td>{voter.pincode}</td>
                  <td>{voter.remarks}</td>
                  <td>{voter.state}</td>
                  <td>{voter.city}</td>
                  <td>{voter.mob}</td>
                  <td>{voter.constituency}</td>
                  <td>{voter.assembly}</td>
                  <td>{voter.ward_no}</td>
                  <td>{voter.email}</td>
                  <td>{voter.gender}</td>
                  <td>{voter.father_or_husband_name}</td>
                  <td>{voter.expiry}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="20" className="no-data">
                  🎉 No more records left to be authenticated
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {voters.length > 0 && (
        <button className="admin-btn" style={{ marginTop: "15px" }} onClick={handleApprove}>
          Approve & Save Selected
        </button>
      )}
    </div>
  );
};

export default UpdateAuthenticate;
