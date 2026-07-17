import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Calendar, Users } from 'lucide-react';
import { db } from '../db/db';
import { studentDataMap } from '../db/students';

export default function History() {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [records, setRecords] = useState([]);

  useEffect(() => {
    async function fetchHistory() {
      try {
        const allRecords = await db.attendance.toArray();
        const uniqueSessions = [];
        const sessionSet = new Set();
        
        // Sort newest first
        allRecords.sort((a, b) => new Date(b.date) - new Date(a.date));

        allRecords.forEach(r => {
          const key = `${r.date}@@${r.timeSlot}@@${r.branch}@@${r.subject}`;
          if (!sessionSet.has(key)) {
            sessionSet.add(key);
            uniqueSessions.push({
              date: r.date,
              timeSlot: r.timeSlot,
              branch: r.branch,
              subject: r.subject,
              key: key
            });
          }
        });
        
        setSessions(uniqueSessions);
      } catch (err) {
        console.error("Failed to load history from Dexie:", err);
      }
    }
    fetchHistory();
  }, []);

  const openSession = async (sess) => {
    setSelectedSession(sess);
    const sessionRecords = await db.attendance
      .where('date').equals(sess.date)
      .toArray();
    
    // Filter by branch and subject just in case
    const filtered = sessionRecords.filter(r => r.branch === sess.branch && r.subject === sess.subject);
    setRecords(filtered);
  };

  const renderList = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {sessions.length === 0 ? (
        <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '40px' }}>
          No past attendance sessions found.
        </div>
      ) : (
        sessions.map(sess => (
          <div 
            key={sess.key} 
            className="junsui-card-sm" 
            style={{ cursor: 'pointer', transition: 'transform 0.2s' }}
            onClick={() => openSession(sess)}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <div style={{ fontWeight: 600, fontSize: '18px', color: 'var(--primary-btn)' }}>{sess.subject}</div>
              <div style={{ fontSize: '14px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Calendar size={14} /> {sess.date}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '16px', fontSize: '14px', color: 'var(--text-primary)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Users size={14} color="var(--text-secondary)" /> {sess.branch}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Clock size={14} color="var(--text-secondary)" /> {sess.timeSlot}</div>
            </div>
          </div>
        ))
      )}
    </div>
  );

  const renderDetails = () => {
    const branchStudents = studentDataMap[selectedSession.branch] || [];
    
    return (
      <div className="junsui-card" style={{ maxWidth: '600px', width: '100%', padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid var(--card-border)' }}>
          <button onClick={() => setSelectedSession(null)} className="icon-btn" style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
            <ArrowLeft size={24} />
          </button>
          <h2 style={{ margin: 0, fontSize: '20px' }}>{selectedSession.subject}</h2>
        </div>

        <div style={{ overflowX: 'auto', background: 'rgba(0,0,0,0.2)', borderRadius: '12px', border: '1px solid var(--card-border)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--card-border)', color: 'var(--text-secondary)' }}>
                <th style={{ padding: '16px', fontWeight: 600, fontSize: '13px' }}>#</th>
                <th style={{ padding: '16px', fontWeight: 600, fontSize: '13px' }}>Name</th>
                <th style={{ padding: '16px', fontWeight: 600, fontSize: '13px', textAlign: 'center' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {records.map((record, index) => {
                const isPresent = record.status === 'Present'; // Note: Legacy app used capitalized 'Present'
                
                return (
                  <tr key={record.id || index} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                    <td style={{ padding: '16px', fontSize: '14px' }}>
                      {selectedSession.branch.split('-')[0]}-{record.studentId.toString().padStart(3, '0')}
                    </td>
                    <td style={{ padding: '16px', fontSize: '15px', fontWeight: 500 }}>
                      {branchStudents[record.studentId - 1] || 'Unknown Student'}
                    </td>
                    <td style={{ padding: '16px', textAlign: 'center' }}>
                      <span style={{ 
                        padding: '6px 12px', 
                        borderRadius: '20px', 
                        fontSize: '12px',
                        fontWeight: 600,
                        backgroundColor: isPresent ? 'rgba(16, 185, 129, 0.15)' : 'rgba(244, 63, 94, 0.15)',
                        color: isPresent ? 'var(--present-btn)' : 'var(--absent-btn)'
                      }}>
                        {isPresent ? 'Present' : 'Absent'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div style={{ padding: '20px', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      
      {!selectedSession ? (
        <div style={{ maxWidth: '600px', width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
            <button onClick={() => navigate('/')} className="icon-btn" style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
              <ArrowLeft size={24} />
            </button>
            <h1 style={{ margin: 0 }}>History</h1>
          </div>
          {renderList()}
        </div>
      ) : (
        renderDetails()
      )}

    </div>
  );
}
