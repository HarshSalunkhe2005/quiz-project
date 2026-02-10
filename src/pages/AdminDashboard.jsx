import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import * as XLSX from 'xlsx';

const AdminDashboard = () => {
  const [results, setResults] = useState([]);
  const [totalParticipants, setTotalParticipants] = useState(0); // For the REAL count
  const [loading, setLoading] = useState(true);
  const [isDoubleGuardEnabled, setIsDoubleGuardEnabled] = useState(false);
  const [isAntiRefreshEnabled, setIsAntiRefreshEnabled] = useState(false);
  const [startTime, setStartTime] = useState(11);
  const [startMin, setStartMin] = useState(0);
  const [endTime, setEndTime] = useState(17);
  const [endMin, setEndMin] = useState(0);
  const [showSettings, setShowSettings] = useState(false);

  const fetchResults = async () => {
    setLoading(true);
    
    // 1. Fetch filtered leaderboard data
    const { data, error } = await supabase
      .from('quiz_results')
      .select('*')
      .gte('score', 50)
      .order('score', { ascending: false })
      .order('total_time_ms', { ascending: true });

    if (!error) setResults(data);

    // 2. Fetch REAL total count (all entries regardless of score)
    const { count, error: countError } = await supabase
      .from('quiz_results')
      .select('*', { count: 'exact', head: true });

    if (!countError) setTotalParticipants(count || 0);

    setLoading(false);
  };

  const fetchSettings = async () => {
    const { data, error } = await supabase.from('app_settings').select('*');
    if (!error && data) {
      const dg = data.find(s => s.key === 'double_guard_enabled');
      const ar = data.find(s => s.key === 'anti_refresh_enabled');
      const st = data.find(s => s.key === 'start_time');
      const sm = data.find(s => s.key === 'start_min');
      const et = data.find(s => s.key === 'end_time');
      const em = data.find(s => s.key === 'end_min');
      
      if (dg) setIsDoubleGuardEnabled(dg.value === 'true');
      if (ar) setIsAntiRefreshEnabled(ar.value === 'true');
      if (st) setStartTime(Number(st.value));
      if (sm) setStartMin(Number(sm.value));
      if (et) setEndTime(Number(et.value));
      if (em) setEndMin(Number(em.value));
    }
  };

  useEffect(() => {
    fetchResults();
    fetchSettings();
  }, []);

  const updateSetting = async (key, value, setter) => {
    setter(value);
    await supabase.from('app_settings').update({ value: String(value) }).eq('key', key);
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
            <hr style={{opacity: 0.2}} />
            <div className="setting-item">
              <span>Start (HH:MM)</span>
              <div style={{display: 'flex', gap: '4px'}}>
                <input type="number" value={startTime} style={{width: '42px'}}
                  onChange={(e) => updateSetting('start_time', e.target.value, setStartTime)} />
                <span>:</span>
                <input type="number" value={startMin} style={{width: '42px'}}
                  onChange={(e) => updateSetting('start_min', e.target.value, setStartMin)} />
              </div>
            </div>
            <div className="setting-item">
              <span>End (HH:MM)</span>
              <div style={{display: 'flex', gap: '4px'}}>
                <input type="number" value={endTime} style={{width: '42px'}}
                  onChange={(e) => updateSetting('end_time', e.target.value, setEndTime)} />
                <span>:</span>
                <input type="number" value={endMin} style={{width: '42px'}}
                  onChange={(e) => updateSetting('end_min', e.target.value, setEndMin)} />
              </div>
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
          <span className="stat-value">{totalParticipants}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Qualifiers (50+): </span>
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
              <tr><td colSpan="5">No qualifiers found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;