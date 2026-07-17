import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TIME_SLOTS, getCurrentSlot, getNextSlot, formatTime12h, isWorkingDay, isHolidaySaturday } from '../db/timetable';

const branches = [
  { value: 'CSE', label: 'Computer Science (CSE) - 2nd Year', count: 44 },
  { value: 'ETC', label: 'Electronics & Telecomm (ETC) - 2nd Year', count: 51 },
  { value: 'CSE-DS', label: 'Data Science (CSE-DS) - 2nd Year', count: 54 },
  { value: 'CSE-CS', label: 'Cyber Security (CSE-CS) - 2nd Year', count: 48 }
];

const subjects = [
  "Data Structures", "Object Oriented Programming", "Database Management Systems", 
  "Computer Networks", "Operating Systems"
];

// Auto-detect current or next lecture slot
function getAutoSlot() {
  const now = new Date();
  const current = getCurrentSlot(now);
  if (current) return current;
  
  const next = getNextSlot(now);
  if (next) return next;
  
  return TIME_SLOTS[0]; // Default to first slot
}

export default function Setup() {
  const navigate = useNavigate();
  const now = new Date();
  const autoSlot = getAutoSlot();
  const isHoliday = !isWorkingDay(now);
  const is2nd4thSat = isHolidaySaturday(now);
  
  const [branch, setBranch] = useState('CSE');
  const [subject, setSubject] = useState(subjects[0]);
  const [selectedSlot, setSelectedSlot] = useState(autoSlot.id);

  const [date, setDate] = useState(() => {
    return now.toISOString().split('T')[0];
  }); 
  
  const [numStudents, setNumStudents] = useState(44);

  const handleBranchChange = (value) => {
    setBranch(value);
    const found = branches.find(b => b.value === value);
    if (found) setNumStudents(found.count);
  };

  const handleStart = () => {
    const slot = TIME_SLOTS.find(s => s.id === selectedSlot) || TIME_SLOTS[0];
    const sessionData = {
      branch,
      subject,
      date,
      numStudents,
      timeSlot: `${formatTime12h(slot.startH, slot.startM)} - ${formatTime12h(slot.endH, slot.endM)}`
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

        {/* Holiday Warning */}
        {isHoliday && (
          <div style={{ 
            background: 'rgba(251, 191, 36, 0.1)', 
            border: '1px solid rgba(251, 191, 36, 0.3)', 
            color: '#fbbf24', 
            padding: '12px 16px', 
            borderRadius: '12px', 
            marginBottom: '20px', 
            fontSize: '13px',
            fontWeight: 500
          }}>
            ⚠️ {is2nd4thSat ? "Today is 2nd/4th Saturday — Holiday!" : "Today is Sunday — Holiday!"}
          </div>
        )}

        <div className="input-group">
          <label className="input-label">Class / Branch</label>
          <div className="select-wrapper">
            <select className="junsui-input" value={branch} onChange={e => handleBranchChange(e.target.value)}>
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
          <label className="input-label">Lecture Slot</label>
          <div className="select-wrapper">
            <select className="junsui-input" value={selectedSlot} onChange={e => setSelectedSlot(parseInt(e.target.value))}>
              {TIME_SLOTS.map(slot => (
                <option key={slot.id} value={slot.id}>
                  {slot.label} — {formatTime12h(slot.startH, slot.startM)} to {formatTime12h(slot.endH, slot.endM)}
                  {slot.id === autoSlot.id ? ' ✦' : ''}
                </option>
              ))}
            </select>
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            ✦ Auto-detected based on current time
          </div>
        </div>

        <div className="input-group">
          <label className="input-label">Lecture Date</label>
          <input type="date" className="junsui-input" value={date} onChange={e => setDate(e.target.value)} style={{ colorScheme: 'dark' }} />
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
