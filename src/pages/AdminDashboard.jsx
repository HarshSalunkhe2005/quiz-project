import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

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

  const handleWipeData = async () => {
    const confirmWipe = window.confirm("ARE YOU SURE? This will permanently delete ALL student scores for next Sunday.");
    
    if (confirmWipe) {
      const { error } = await supabase
        .from('quiz_results')
        .delete()
        .not('id', 'eq', 0); 

      if (error) {
        alert("Error wiping data: " + error.message);
      } else {
        alert("Table wiped successfully!");
        fetchResults(); 
      }
    }
  };

  if (loading) return <div className="admin-content loading-state">Fetching Real-time Results...</div>;

  return (
    <div className="admin-content fade-in">
      <div className="admin-header-row">
        <h2 className="neon-text">Live Leaderboard</h2>
        <div className="admin-controls">
            <button onClick={fetchResults} className="refresh-btn" title="Refresh Feed">
                    ↻ REFRESH
            </button>
        </div>
      </div>

      <div className="stats-summary-card">
        <div className="stat-item">
          <span className="stat-label">Total Participants: </span>
          <span className="stat-value"> {results.length}</span>
        </div>
      </div>

      {/* This wrapper controls the scroll logic */}
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
                  <td className="user-name">{res.name}</td>
                  <td>{res.school}</td>
                  <td className="score-cell">{res.score}</td>
                  <td>{(res.total_time_ms / 1000).toFixed(2)}s</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="empty-msg">No entries found for today.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="danger-zone-card">
        <div className="danger-content">
          <h3>System Reset</h3>
          <p>Clear all current database records to prepare for next week's sprint.</p>
        </div>
        <button onClick={handleWipeData} className="wipe-btn">🗑 WIPE All Data</button>
      </div>
    </div>
  );
};

export default AdminDashboard;