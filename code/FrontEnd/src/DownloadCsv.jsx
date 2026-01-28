import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import "./DownloadCsv.css";

const DownloadCsv = () => {
  const [constituencies, setConstituencies] = useState([]);
  const [assemblies, setAssemblies] = useState([]);
  const [selectedConstituency, setSelectedConstituency] = useState("");
  const [selectedAssembly, setSelectedAssembly] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost/evoting/download.php?action=getConstituencies")
      .then((res) => res.json())
      .then((data) => setConstituencies(data))
      .catch((err) => console.error(err));
  }, []);

  const handleConstituencyChange = (e) => {
    const constituency = e.target.value;
    setSelectedConstituency(constituency);

    fetch(`http://localhost/evoting/download.php?action=getAssemblies&constituency=${constituency}`)
      .then((res) => res.json())
      .then((data) => setAssemblies(data))
      .catch((err) => console.error(err));
  };

  const handleDownload = () => {
    if (!selectedConstituency || !selectedAssembly) {
      alert("Please select both constituency and assembly");
      return;
    }
    window.location.href = `http://localhost/evoting/download.php?action=download&constituency=${selectedConstituency}&assembly=${selectedAssembly}`;
  };

  return (
    <div className="download-container">
      <h2>Download Election Data</h2>
      <button className="back-btn" onClick={() => navigate("/election-result")}>← Back</button>
      <div className="dropdown-container">
        <label>Constituency:</label>
        <select onChange={handleConstituencyChange} value={selectedConstituency}>
          <option value="">Select Constituency</option>
          {constituencies.map((c) => (
            <option key={c.constituency} value={c.constituency}>
              {c.constituency}
            </option>
          ))}
        </select>
      </div>

      <div className="dropdown-container">
        <label>Assembly:</label>
        <select
          onChange={(e) => setSelectedAssembly(e.target.value)}
          value={selectedAssembly}
          disabled={!selectedConstituency}
        >
          <option value="">Select Assembly</option>
          {assemblies.map((a) => (
            <option key={a.assembly} value={a.assembly}>
              {a.assembly}
            </option>
          ))}
        </select>
      </div>

      <button className="download-btn" onClick={handleDownload}>
        Download Excel
      </button>
    </div>
  );
};

export default DownloadCsv;
