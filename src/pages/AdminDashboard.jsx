import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import * as XLSX from 'xlsx'; // Import the Excel library

const AdminDashboard = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchResults = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('quiz_results')
      .select('*')
      .order('score', { ascending: false })
      .order('total_time_ms', { ascending: true });

    if (!error) setResults(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchResults();
  }, []);

  // --- NEW EXCEL EXPORT LOGIC ---
  const handleExportExcel = () => {
    if (results.length === 0) {
      alert("No data to export!");
      return;
    }

    // 1. Format the data for Excel
    const excelData = results.map((res, index) => ({
      Rank: index + 1,
      Name: res.name,
      School: res.school,
      Score: res.score,
      "Time (seconds)": (res.total_time_ms / 1000).toFixed(2)
    }));

    // 2. Create worksheet and workbook
    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sprint Results");

    // 3. Generate dynamic filename with current date
    const date = new Date().toLocaleDateString('en-GB').replace(/\//g, '_');
    const fileName = `results_${date}.xlsx`;

    // 4. Trigger download
    XLSX.writeFile(workbook, fileName);
  };

  const handleWipeData = async () => {
    const confirmWipe = window.confirm("ARE YOU SURE? This will permanently delete ALL student scores for next Sunday.");
    if (confirmWipe) {
      const { error } = await supabase.from('quiz_results').delete().not('id', 'eq', 0);
      if (error) alert("Error: " + error.message);
      else {
        alert("Table wiped successfully!");
        fetchResults();
      }
    }
  };

  if (loading) return <div className="admin-content">Fetching Real-time Results...</div>;

  return (
    <div className="admin-content fade-in">
      <div className="admin-header-row">
        <h2 className="neon-text">Live Leaderboard</h2>
        <div className="admin-controls">
          <button onClick={handleExportExcel} className="refresh-btn" title="Export to Excel">
              📊 EXPORT
          </button>
          <button onClick={fetchResults} className="refresh-btn" title="Refresh Feed">
              ↻ REFRESH
          </button>
          <button onClick={handleWipeData} className="wipe-btn" title="Wipe All Data">
              🗑 WIPE
          </button>
        </div>
      </div>

      <div className="stats-summary-card">
        <div className="stat-item">
          <span className="stat-label">Total Participants: </span>
          <span className="stat-value">{results.length}</span>
        </div>
      </div>

      <div className="table-scroll-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Name</th>
              <th>School</th>
              <th>Score</th>
              <th>Time (s)</th>
            </tr>
          </thead>
          <tbody>
            {results.length > 0 ? (
              results.map((res, index) => (
                <tr key={res.id} className={index < 3 ? `top-rank rank-${index + 1}` : ''}>
                  <td>{index + 1}</td>
                  <td>{res.name}</td>
                  <td>{res.school}</td>
                  <td>{res.score}</td>
                  <td>{(res.total_time_ms / 1000).toFixed(2)}s</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">No entries found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;