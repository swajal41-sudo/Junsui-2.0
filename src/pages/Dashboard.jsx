import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const { logout, currentUser } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate('/login');
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Welcome to Junsui React Dashboard</h1>
      <p>Logged in as: {currentUser?.email}</p>
      <button className="btn primary-btn" onClick={handleLogout}>Logout</button>
      
      {/* Attendance components will go here */}
      <div style={{ marginTop: '40px', textAlign: 'center' }} className="junsui-card">
        <h2 style={{ marginBottom: '16px' }}>Take Attendance</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>Start a new session or view past attendance records.</p>
        
        <div style={{ display: 'flex', gap: '16px', flexDirection: 'column' }}>
          <button className="btn btn-primary" onClick={() => navigate('/setup')}>
            Start New Session
          </button>
          
          <button className="btn" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--card-border)' }} onClick={() => navigate('/history')}>
            View Past History
          </button>
        </div>
      </div>
    </div>
  );
}
