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
        .not('id', 'eq', 0); // Deletes all rows

      if (error) {
        alert("Error wiping data: " + error.message);
      } else {
        alert("Table wiped successfully!");
        fetchResults(); 
      }
    }
  };

  if (loading) return <div className="admin-content">Loading Stats...</div>;

  return (
    <div className="admin-content">
      <div className="admin-header-row">
        <h2 className="neon-text">Leaderboard</h2>
        <button onClick={fetchResults} className="refresh-btn">Refresh Data</button>
      </div>

      <div className="stats-summary">
        Total Participants: <strong>{results.length}</strong>
      </div>

      <div className="table-wrapper">
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
            {results.map((res, index) => (
              <tr key={res.id}>
                <td>{index + 1}</td>
                <td>{res.name}</td>
                <td>{res.school}</td>
                <td>{res.score}</td>
                <td>{(res.total_time_ms / 1000).toFixed(2)}s</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="danger-zone">
        <h3>Danger Zone</h3>
        <p>This action cannot be undone.</p>
        <button onClick={handleWipeData} className="wipe-btn">Wipe All Table Data</button>
      </div>
    </div>
  );
};

export default AdminDashboard;