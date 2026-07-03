import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const branches = [
  { value: 'CSE', label: 'Computer Science (CSE) - 2nd Year' },
  { value: 'ETC', label: 'Electronics & Telecomm (ETC) - 2nd Year' },
  { value: 'CSE-DS', label: 'Data Science (CSE-DS) - 2nd Year' },
  { value: 'CSE-CS', label: 'Cyber Security (CSE-CS) - 2nd Year' }
];

const subjects = [
  "Data Structures", "Object Oriented Programming", "Database Management Systems", "Computer Networks", "Operating Systems"
];

// Dummy Timetable (User can update this)
const timeTable = {
  // 1 = Monday, 2 = Tuesday, etc.
  1: { 10: "Data Structures", 11: "Object Oriented Programming", 12: "Database Management Systems" },
  2: { 10: "Operating Systems", 11: "Computer Networks", 12: "Data Structures" },
  3: { 10: "Database Management Systems", 11: "Operating Systems", 12: "Object Oriented Programming" },
  4: { 10: "Computer Networks", 11: "Data Structures", 12: "Operating Systems" },
  5: { 10: "Object Oriented Programming", 11: "Database Management Systems", 12: "Computer Networks" },
};

export default function Setup() {
  const navigate = useNavigate();
  const [branch, setBranch] = useState('CSE');
  
  // Auto-detect subject and time based on current time
  const [subject, setSubject] = useState(() => {
    const day = new Date().getDay();
    const hour = new Date().getHours();
    
    // Check if we have a subject for current day and hour
    if (timeTable[day] && timeTable[day][hour]) {
      return timeTable[day][hour];
    }
    return "Data Structures"; // Default fallback
  });

  const [date, setDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0]; // Auto-set today's date
  }); 
  
  const [duration, setDuration] = useState('60');
  
  const [startH, setStartH] = useState(() => new Date().getHours());
  const [startM, setStartM] = useState(() => new Date().getMinutes());
  const [endH, setEndH] = useState(() => (new Date().getHours() + 1) % 24);
  const [endM, setEndM] = useState(() => new Date().getMinutes());
  
  const [numStudents, setNumStudents] = useState(44);

  const handleStart = () => {
    const sessionData = {
      branch,
      subject,
      date,
      numStudents
    };
    localStorage.setItem('junsui_current_session', JSON.stringify(sessionData));
    navigate('/call');
  };

  return (
    <div style={{ padding: '40px 20px', display: 'flex', justifyContent: 'center' }}>
      <div className="junsui-card">
        
        <div className="setup-header">
          {/* Logo placeholder if image is missing */}
          <div style={{ width: 40, height: 40, background: 'var(--input-bg)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10 }}>GNIT</div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700 }}>Guru Nanak Institute of Technology</div>
            <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Nagpur — Attendance Management System</div>
          </div>
        </div>

        <h1>New Session</h1>
        <p className="subtitle">Set up your attendance session</p>

        <div className="input-group">
          <label className="input-label">Class / Branch</label>
          <div className="select-wrapper">
            <select className="junsui-input" value={branch} onChange={e => setBranch(e.target.value)}>
              {branches.map(b => <option key={b.value} value={b.value}>{b.label}</option>)}
            </select>
          </div>
        </div>

        <div className="input-group">
          <label className="input-label">Subject</label>
          <div className="select-wrapper">
            <select className="junsui-input" value={subject} onChange={e => setSubject(e.target.value)}>
              {subjects.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        <div className="input-group">
          <label className="input-label">Class Duration</label>
          <div className="select-wrapper">
            <select className="junsui-input" value={duration} onChange={e => setDuration(e.target.value)}>
              <option value="60">60 minutes (1 class)</option>
            </select>
          </div>
        </div>

        <div className="input-group">
          <label className="input-label">Lecture Date</label>
          <input type="date" className="junsui-input" value={date} onChange={e => setDate(e.target.value)} style={{ colorScheme: 'dark' }} />
        </div>

        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '20px' }}>
           <div style={{ flex: 1 }}>
             <label className="input-label" style={{ display: 'block', marginBottom: '8px' }}>Start Time</label>
             <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
               <input type="number" className="junsui-input" value={startH} onChange={e => setStartH(e.target.value)} style={{ textAlign: 'center' }} />
               <span style={{ fontWeight: 700 }}>:</span>
               <input type="number" className="junsui-input" value={startM} onChange={e => setStartM(e.target.value)} style={{ textAlign: 'center' }} />
             </div>
           </div>
           <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: '24px' }}>to</div>
           <div style={{ flex: 1 }}>
             <label className="input-label" style={{ display: 'block', marginBottom: '8px' }}>End Time</label>
             <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
               <input type="number" className="junsui-input" value={endH} onChange={e => setEndH(e.target.value)} style={{ textAlign: 'center' }} />
               <span style={{ fontWeight: 700 }}>:</span>
               <input type="number" className="junsui-input" value={endM} onChange={e => setEndM(e.target.value)} style={{ textAlign: 'center' }} />
             </div>
           </div>
        </div>

        <div className="input-group" style={{ marginBottom: '32px' }}>
          <label className="input-label">Number of Students</label>
          <input type="number" className="junsui-input" value={numStudents} onChange={e => setNumStudents(parseInt(e.target.value))} />
        </div>

        <button className="btn btn-primary" onClick={handleStart}>
          <span style={{ fontSize: '18px' }}>▷</span> Start Attendance
        </button>

      </div>
    </div>
  );
}
