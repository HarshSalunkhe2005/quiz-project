import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import * as XLSX from 'xlsx';

const AdminDashboard = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDoubleGuardEnabled, setIsDoubleGuardEnabled] = useState(false);
  const [isAntiRefreshEnabled, setIsAntiRefreshEnabled] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

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

  const fetchSettings = async () => {
    const { data, error } = await supabase.from('app_settings').select('*');
    if (!error && data) {
      const dg = data.find(s => s.key === 'double_guard_enabled');
      const ar = data.find(s => s.key === 'anti_refresh_enabled');
      if (dg) setIsDoubleGuardEnabled(dg.value);
      if (ar) setIsAntiRefreshEnabled(ar.value);
    }
  };

  useEffect(() => {
    fetchResults();
    fetchSettings();
  }, []);

  const updateSetting = async (key, value, setter) => {
    setter(value);
    await supabase.from('app_settings').update({ value }).eq('key', key);
  };

  const handleExportExcel = () => {
    if (results.length === 0) return alert("No data to export!");
    const excelData = results.map((res, index) => ({
      Rank: index + 1,
      Name: res.name,
      School: res.school,
      Score: res.score,
      "Time (s)": (res.total_time_ms / 1000).toFixed(2)
    }));
    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Results");
    XLSX.writeFile(workbook, `results_${new Date().toLocaleDateString()}.xlsx`);
  };

  const handleWipeData = async () => {
    if (window.confirm("ARE YOU SURE? This wipes all scores.")) {
      const { error } = await supabase.from('quiz_results').delete().not('id', 'eq', 0);
      if (!error) fetchResults();
    }
  };

  if (loading) return <div className="admin-content">Fetching Results...</div>;

  return (
    <div className="admin-content fade-in">
      {/* Absolute Positioned Settings - Top Left Corner */}
      <div className="top-left-settings">
        <button onClick={() => setShowSettings(!showSettings)} className="security-toggle-btn">
          ⚙️ SECURITY
        </button>
        {showSettings && (
          <div className="settings-dropdown glass-panel fade-in">
            <div className="setting-item">
              <span>Double Guard</span>
              <input type="checkbox" checked={isDoubleGuardEnabled} 
                onChange={(e) => updateSetting('double_guard_enabled', e.target.checked, setIsDoubleGuardEnabled)} />
            </div>
            <div className="setting-item">
              <span>Anti-Refresh</span>
              <input type="checkbox" checked={isAntiRefreshEnabled} 
                onChange={(e) => updateSetting('anti_refresh_enabled', e.target.checked, setIsAntiRefreshEnabled)} />
            </div>
          </div>
        )}
      </div>

      <div className="admin-header-row">
        <h2 className="neon-text">Live Leaderboard</h2>
        <div className="admin-controls">
          <button onClick={handleExportExcel} className="refresh-btn">📊 EXPORT</button>
          <button onClick={fetchResults} className="refresh-btn">↻ REFRESH</button>
          <button onClick={handleWipeData} className="wipe-btn">🗑 WIPE</button>
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
            <tr><th>Rank</th><th>Name</th><th>School</th><th>Score</th><th>Time (s)</th></tr>
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
              <tr><td colSpan="5">No entries found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;