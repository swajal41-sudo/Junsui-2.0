import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  TIME_SLOTS, CSE_SUBJECTS, CSE_LABS, CSE_TIMETABLE,
  getAutoDetectedSlot, getSubjectName, formatTime12h, 
  isWorkingDay, isHolidaySaturday 
} from '../db/timetable';

const branches = [
  { value: 'CSE', label: 'Computer Science (CSE) - 2nd Year', count: 44 },
  { value: 'ETC', label: 'Electronics & Telecomm (ETC) - 2nd Year', count: 51 },
  { value: 'CSE-DS', label: 'Data Science (CSE-DS) - 2nd Year', count: 54 },
  { value: 'CSE-CS', label: 'Cyber Security (CSE-CS) - 2nd Year', count: 48 }
];

// All unique subject names (theory + labs)
const allSubjects = [
  ...CSE_SUBJECTS.map(s => s.name),
  ...CSE_LABS.map(l => l.name),
];

export default function Setup() {
  const navigate = useNavigate();
  const now = new Date();
  const isHoliday = !isWorkingDay(now);
  const is2nd4thSat = isHolidaySaturday(now);
  
  // Auto-detect from timetable
  const autoDetected = getAutoDetectedSlot(now);
  const autoSubjectCode = autoDetected?.entry?.subject;
  const autoSubjectName = getSubjectName(autoSubjectCode);
  
  const [branch, setBranch] = useState('CSE');
  const [subject, setSubject] = useState(autoSubjectName || allSubjects[0]);
  const [selectedSlot, setSelectedSlot] = useState(autoDetected?.slot?.id || 1);
  const [date, setDate] = useState(() => now.toISOString().split('T')[0]); 
  const [numStudents, setNumStudents] = useState(44);
  const [autoDetectEnabled, setAutoDetectEnabled] = useState(true);

  // When branch changes, update student count and re-trigger auto-detect
  const handleBranchChange = (value) => {
    setBranch(value);
    const found = branches.find(b => b.value === value);
    if (found) setNumStudents(found.count);
    
    // Only auto-detect for CSE (we have the timetable)
    if (value === 'CSE' && autoDetectEnabled) {
      const detected = getAutoDetectedSlot(new Date());
      if (detected?.entry?.subject) {
        setSubject(getSubjectName(detected.entry.subject) || allSubjects[0]);
        setSelectedSlot(detected.slot.id);
      }
    }
  };

  // When slot changes manually, update subject from timetable (if CSE)
  const handleSlotChange = (slotId) => {
    setSelectedSlot(slotId);
    
    if (branch === 'CSE') {
      const day = new Date(date).getDay() || now.getDay();
      if (CSE_TIMETABLE[day]) {
        const entry = CSE_TIMETABLE[day][slotId - 1];
        if (entry?.subject) {
          const name = getSubjectName(entry.subject);
          if (name) setSubject(name);
        }
      }
    }
  };

  // Get today's schedule for the info bar
  const day = now.getDay();
  const todaySchedule = (branch === 'CSE' && CSE_TIMETABLE[day]) ? CSE_TIMETABLE[day] : null;

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

        {/* Auto-Detect Banner (CSE only) */}
        {branch === 'CSE' && autoSubjectName && !isHoliday && (
          <div style={{ 
            background: 'rgba(99, 102, 241, 0.08)', 
            border: '1px solid rgba(99, 102, 241, 0.2)', 
            color: '#a5b4fc', 
            padding: '12px 16px', 
            borderRadius: '12px', 
            marginBottom: '20px', 
            fontSize: '13px',
            fontWeight: 500
          }}>
            🎯 Auto-detected: <strong style={{ color: '#c7d2fe' }}>{autoSubjectName}</strong> — {formatTime12h(autoDetected.slot.startH, autoDetected.slot.startM)}
            {autoDetected.entry?.isLab && <span style={{ marginLeft: 8, opacity: 0.7 }}>🔬 Lab</span>}
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
          <label className="input-label">Lecture Slot</label>
          <div className="select-wrapper">
            <select className="junsui-input" value={selectedSlot} onChange={e => handleSlotChange(parseInt(e.target.value))}>
              {TIME_SLOTS.map((slot, idx) => {
                // Show subject from timetable if CSE
                let slotSubject = '';
                if (branch === 'CSE' && todaySchedule && todaySchedule[idx]?.subject) {
                  slotSubject = ` — ${todaySchedule[idx].subject}`;
                  if (todaySchedule[idx].isLab) slotSubject += ' 🔬';
                } else if (branch === 'CSE' && todaySchedule && todaySchedule[idx]?.label) {
                  slotSubject = ` — ${todaySchedule[idx].label}`;
                }
                
                return (
                  <option key={slot.id} value={slot.id}>
                    {slot.label}: {formatTime12h(slot.startH, slot.startM)} – {formatTime12h(slot.endH, slot.endM)}{slotSubject}
                    {slot.id === autoDetected?.slot?.id ? ' ✦' : ''}
                  </option>
                );
              })}
            </select>
          </div>
          {branch === 'CSE' && (
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>
              ✦ Current/next lecture auto-detected from CSE timetable
            </div>
          )}
        </div>

        <div className="input-group">
          <label className="input-label">Subject</label>
          <div className="select-wrapper">
            <select className="junsui-input" value={subject} onChange={e => setSubject(e.target.value)}>
              {allSubjects.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
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
