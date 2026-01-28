import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip as ReTooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from "recharts";
import "./ElectionResult.css";

const partyOptions = [
  { id: 1, name: "All India Trinamool Congress", logo: "aitc.png" },
  { id: 2, name: "Bharatiya Janata Party", logo: "bjp.png" },
  { id: 3, name: "Indian National Congress", logo: "inc.png" },
  { id: 4, name: "Communist Party of India", logo: "cpi.png" },
  { id: 5, name: "Bahujan Samaj Party", logo: "bsp.png" },
  { id: 9, name: "NOTA", logo: "nota.png" },
];

const COLORS = ["#4F46E5", "#16A34A", "#DC2626", "#F59E0B", "#0EA5E9", "#A855F7"];

const OverallSummary = ({ totals }) => (
  <>
    <h2 className="subtitle">Overall Summary</h2>
    <table className="flat-results-table summary-table">
      <thead>
        <tr>
          <th>Party</th>
          <th>Total Votes</th>
        </tr>
      </thead>
      <tbody>
        {[...partyOptions]
          .sort((a, b) => (totals[b.id] || 0) - (totals[a.id] || 0))
          .map((p) => (
            <tr key={p.id}>
              <td>
                <div className="party-header">
                  {p.logo && (
                    <img src={`/logos/${p.logo}`} alt={p.name} className="party-logo" />
                  )}
                  <span>{p.name}</span>
                </div>
              </td>
              <td>{totals[p.id] || 0}</td>
            </tr>
          ))}
      </tbody>
    </table>
  </>
);

const WardWiseResults = ({ rows, expandedIndex, setExpandedIndex }) => (
  <>
    <h2 className="subtitle">Ward-wise Results</h2>
    <div className="table-container">
      <table className="flat-results-table ward-table">
        <thead>
          <tr>
            <th rowSpan={2}>Constituency</th>
            <th rowSpan={2}>Assembly</th>
            <th rowSpan={2}>Ward</th>
            <th colSpan={partyOptions.length}>Votes by Party</th>
            <th rowSpan={2}>Total Votes</th>
            <th rowSpan={2}>Winner</th>
            <th rowSpan={2}>Margin</th>
          </tr>
          <tr>
            {partyOptions.map((p) => (
              <th key={p.id}>
                <div className="party-header">
                  {p.logo && (
                    <img src={`/logos/${p.logo}`} alt={p.name} className="party-logo" />
                  )}
                  <span>{p.name}</span>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => {
            const chartData = partyOptions.map((p, i) => ({
              name: p.name,
              votes: row.votesByParty[p.id] || 0,
              color: COLORS[i % COLORS.length],
            }));
            const expanded = expandedIndex === idx;
            return (
              <React.Fragment key={idx}>
                <tr
                  onClick={() => setExpandedIndex(expanded ? null : idx)}
                  style={{ cursor: "pointer" }}
                >
                  <td>{row.constituency}</td>
                  <td>{row.assembly}</td>
                  <td>{row.ward_no}</td>
                  {partyOptions.map((p) => (
                    <td key={p.id}>{row.votesByParty[p.id] || 0}</td>
                  ))}
                  <td>{row.totalVotes}</td>
                  <td>
                    {
                      partyOptions.find(
                        (p) => String(p.id) === String(row.winnerPartyId)
                      )?.name
                    }
                  </td>
                  <td>{row.margin}</td>
                </tr>
                {expanded && (
                  <tr>
                    <td colSpan={partyOptions.length + 6}>
                      <div
                        style={{
                          display: "flex",
                          gap: "20px",
                          flexWrap: "wrap",
                          justifyContent: "center",
                          padding: "15px",
                          background: "#f9fafb",
                          borderRadius: "10px",
                        }}
                      >
                        <div style={{ width: 220, height: 220 }}>
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={chartData}
                                dataKey="votes"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                innerRadius={40}
                                outerRadius={80}
                                paddingAngle={3}
                                cornerRadius={5}
                              >
                                {chartData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                              </Pie>
                              <ReTooltip />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                        <div style={{ width: 300, height: 220 }}>
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="name" hide />
                              <YAxis />
                              <ReTooltip />
                              <Legend />
                              <Bar dataKey="votes" radius={[6, 6, 0, 0]}>
                                {chartData.map((entry, index) => (
                                  <Cell key={`bar-cell-${index}`} fill={entry.color} />
                                ))}
                              </Bar>
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  </>
);

// -------------------------
// New Hierarchical VoterStatsTable
// -------------------------
const VoterStatsTable = ({ voterStats }) => {
  const [expandedConstituency, setExpandedConstituency] = useState(null);
  const [expandedAssembly, setExpandedAssembly] = useState(null);

  // Group by constituency > assembly
  const grouped = voterStats.reduce((acc, v) => {
    if (!acc[v.constituency]) acc[v.constituency] = {};
    if (!acc[v.constituency][v.assembly]) acc[v.constituency][v.assembly] = [];
    acc[v.constituency][v.assembly].push(v);
    return acc;
  }, {});

  const sumStats = (arr) => ({
    total_voters: arr.reduce((s, r) => s + parseInt(r.total_voters), 0),
    male_voters: arr.reduce((s, r) => s + parseInt(r.male_voters), 0),
    female_voters: arr.reduce((s, r) => s + parseInt(r.female_voters), 0),
    polled_vote: arr.reduce((s, r) => s + parseInt(r.polled_vote), 0),
    male_polled: arr.reduce((s, r) => s + parseInt(r.male_polled), 0),
    female_polled: arr.reduce((s, r) => s + parseInt(r.female_polled), 0),
    nota: arr.reduce((s, r) => s + parseInt(r.nota), 0),
  });

  return (
    <>
      <h2 className="subtitle">Voter Statistics</h2>
      <div className="table-container">
        <table className="flat-results-table ward-table">
          <thead>
            <tr>
              <th>Constituency</th>
              <th>Assembly</th>
              <th>Ward</th>
              <th>Total Voter</th>
              <th>Male Voter</th>
              <th>Female Voter</th>
              <th>Polled Vote</th>
              <th>Male Polled</th>
              <th>Female Polled</th>
              <th>% of Vote</th>
              <th>NOTA</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(grouped).map(([constituency, assemblies]) => {
              const allConstituencyWards = Object.values(assemblies).flat();
              const cSum = sumStats(allConstituencyWards);
              const cPercent =
                cSum.total_voters > 0
                  ? ((cSum.polled_vote / cSum.total_voters) * 100).toFixed(2)
                  : 0;

              const cExpanded = expandedConstituency === constituency;

              return (
                <React.Fragment key={constituency}>
                  <tr
                    style={{
                      background: "#e2e8f0",
                      cursor: "pointer",
                      fontWeight: "bold",
                    }}
                    onClick={() =>
                      setExpandedConstituency(
                        cExpanded ? null : constituency
                      )
                    }
                  >
                    <td>{cExpanded ? "▼" : "▶"} {constituency}</td>
                    <td colSpan={1}></td>
                    <td colSpan={0}></td>
                    <td>{cSum.total_voters}</td>
                    <td>{cSum.male_voters}</td>
                    <td>{cSum.female_voters}</td>
                    <td>{cSum.polled_vote}</td>
                    <td>{cSum.male_polled}</td>
                    <td>{cSum.female_polled}</td>
                    <td>{cPercent}%</td>
                    <td>{cSum.nota}</td>
                  </tr>

                  {cExpanded &&
                    Object.entries(assemblies).map(([assembly, wards]) => {
                      const aSum = sumStats(wards);
                      const aPercent =
                        aSum.total_voters > 0
                          ? ((aSum.polled_vote / aSum.total_voters) * 100).toFixed(2)
                          : 0;

                      const aExpanded =
                        expandedAssembly === `${constituency}-${assembly}`;

                      return (
                        <React.Fragment key={assembly}>
                          <tr
                            style={{
                              background: "#f1f5f9",
                              cursor: "pointer",
                              fontWeight: 500,
                            }}
                            onClick={() =>
                              setExpandedAssembly(
                                aExpanded ? null : `${constituency}-${assembly}`
                              )
                            }
                          >
                            <td></td>
                            <td>{aExpanded ? "▼" : "▶"} {assembly}</td>
                            <td></td>
                            <td>{aSum.total_voters}</td>
                            <td>{aSum.male_voters}</td>
                            <td>{aSum.female_voters}</td>
                            <td>{aSum.polled_vote}</td>
                            <td>{aSum.male_polled}</td>
                            <td>{aSum.female_polled}</td>
                            <td>{aPercent}%</td>
                            <td>{aSum.nota}</td>
                          </tr>

                          {aExpanded &&
                            wards.map((v, i) => (
                              <tr key={i}>
                                <td></td>
                                <td></td>
                                <td>{v.ward_no}</td>
                                <td>{v.total_voters}</td>
                                <td>{v.male_voters}</td>
                                <td>{v.female_voters}</td>
                                <td>{v.polled_vote}</td>
                                <td>{v.male_polled}</td>
                                <td>{v.female_polled}</td>
                                <td>{v.percent_vote}%</td>
                                <td>{v.nota}</td>
                              </tr>
                            ))}
                        </React.Fragment>
                      );
                    })}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
};

// ----------------------
// Main Component
// ----------------------
const ElectionResult = () => {
  const navigate = useNavigate();
  const [yearData, setYearData] = useState({});
  const [expandedYear, setExpandedYear] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedIndex, setExpandedIndex] = useState(null);

  const getPartyDetails = (pollNo) => {
    if (parseInt(pollNo, 10) === 0) {
      return { id: 0, name: "Voted but did not select any party", logo: null };
    }
    const party = partyOptions.find((p) => p.id === parseInt(pollNo, 10));
    if (party) return party;
    return { id: pollNo, name: `Unknown Party (${pollNo})`, logo: null };
  };

  useEffect(() => {
    Promise.all([
      fetch("http://localhost/evoting/get_pm_results.php").then((r) => r.json()),
      fetch("http://localhost/evoting/get_voter_stats.php").then((r) => r.json()),
    ])
      .then(([results, voters]) => {
        const groupedByYear = {};
        results.forEach((item) => {
          const year = item.year;
          if (!groupedByYear[year]) groupedByYear[year] = { results: [], voters: [] };
          groupedByYear[year].results.push(item);
        });
        voters.forEach((item) => {
          const year = item.year;
          if (!groupedByYear[year]) groupedByYear[year] = { results: [], voters: [] };
          groupedByYear[year].voters.push(item);
        });
        setYearData(groupedByYear);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to fetch results");
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="loading">Loading election results…</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="election-result-container">
      <div className="header">
        <button className="back-btn" onClick={() => navigate("/")}>← Back</button>
        <h1 className="title">Prime Minister Election Results</h1>
        </div>
        <button
          className="download-btn"
          onClick={() => navigate("/download")}
        >
          Download
        </button>
      {Object.keys(yearData)
        .sort((a, b) => b - a)
        .map((year) => {
          const yr = yearData[year];
          const data = yr.results;
          const voterStats = yr.voters;

          // Build summary + row data
          const grouped = {};
          const totalVotesByParty = {};
          data.forEach((item) => {
            const { constituency, assembly, ward_no, poll_no, votes } = item;
            const party = getPartyDetails(poll_no);
            totalVotesByParty[party.id] =
              (totalVotesByParty[party.id] || 0) + parseInt(votes, 10);
            const key = `${constituency}-${assembly}-${ward_no}`;
            if (!grouped[key]) {
              grouped[key] = {
                constituency,
                assembly,
                ward_no,
                votesByParty: {},
              };
            }
            grouped[key].votesByParty[party.id] =
              (grouped[key].votesByParty[party.id] || 0) + parseInt(votes, 10);
          });

          const rowsArr = Object.values(grouped).map((g) => {
            const votesByParty = g.votesByParty;
            const totalVotes = Object.values(votesByParty).reduce((a, b) => a + b, 0);
            let winnerId = null;
            let maxVotes = -1;
            let secondVotes = -1;
            Object.entries(votesByParty).forEach(([pid, v]) => {
              if (v > maxVotes) {
                secondVotes = maxVotes;
                maxVotes = v;
                winnerId = pid;
              } else if (v > secondVotes) {
                secondVotes = v;
              }
            });
            const margin = maxVotes - (secondVotes === -1 ? 0 : secondVotes);
            return {
              constituency: g.constituency,
              assembly: g.assembly,
              ward_no: g.ward_no,
              votesByParty,
              totalVotes,
              winnerPartyId: winnerId,
              margin,
            };
          });

          return (
            <div key={year} className="year-section">
              <h2
                className="year-header"
                onClick={() => setExpandedYear(expandedYear === year ? null : year)}
                style={{
                  cursor: "pointer",
                  background: "#e2e8f0",
                  padding: "10px 15px",
                  borderRadius: "8px",
                }}
              >
                {expandedYear === year ? "▼" : "▶"} Election Year {year}
              </h2>

              {expandedYear === year && (
                <div className="year-content" style={{ marginTop: "10px" }}>
                  <OverallSummary totals={totalVotesByParty} />
                  <WardWiseResults
                    rows={rowsArr}
                    expandedIndex={expandedIndex}
                    setExpandedIndex={setExpandedIndex}
                  />
                  <VoterStatsTable voterStats={voterStats} />
                </div>
              )}
            </div>
          );
        })}
    </div>
  );
};

export default ElectionResult;
