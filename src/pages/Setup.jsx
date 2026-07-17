import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  TIME_SLOTS, CSE_SUBJECTS, CSE_LABS, CSE_TIMETABLE,
  CSE_CS_SUBJECTS, CSE_CS_LABS, CSE_CS_TIMETABLE,
  getAutoDetectedSlot, getSubjectName, formatTime12h, 
  isWorkingDay, isHolidaySaturday, getTimetableForBranch
} from '../db/timetable';

const branches = [
  { value: 'CSE', label: 'Computer Science (CSE) - 2nd Year', count: 44 },
  { value: 'ETC', label: 'Electronics & Telecomm (ETC) - 2nd Year', count: 51 },
  { value: 'CSE-DS', label: 'Data Science (CSE-DS) - 2nd Year', count: 54 },
  { value: 'CSE-CS', label: 'Cyber Security (CSE-CS) - 2nd Year', count: 48 }
];

const allSubjects = [
  ...CSE_SUBJECTS.map(s => s.name),
  ...CSE_LABS.map(l => l.name),
  ...CSE_CS_SUBJECTS.map(s => s.name),
  ...CSE_CS_LABS.map(l => l.name),
];

export default function Setup() {
  const navigate = useNavigate();
  const now = new Date();
  const isHoliday = !isWorkingDay(now);
  const is2nd4thSat = isHolidaySaturday(now);
  
  const [branch, setBranch] = useState('CSE');
  
  // Auto-detect from timetable
  const autoDetected = getAutoDetectedSlot(now, branch);
  const autoSubjectCode = autoDetected?.entry?.subject;
  const autoSubjectName = getSubjectName(autoSubjectCode, branch);
  
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
    
    // Auto-detect for supported branches
    if ((value === 'CSE' || value === 'CSE-CS') && autoDetectEnabled) {
      const detected = getAutoDetectedSlot(new Date(), value);
      if (detected?.entry?.subject) {
        setSubject(getSubjectName(detected.entry.subject, value) || allSubjects[0]);
        setSelectedSlot(detected.slot.id);
      }
    }
  };

  // When slot changes manually, update subject from timetable
  const handleSlotChange = (slotId) => {
    setSelectedSlot(slotId);
    
    const timetable = getTimetableForBranch(branch);
    if (timetable) {
      const day = new Date(date).getDay() || now.getDay();
      if (timetable[day]) {
        const entry = timetable[day][slotId - 1];
        if (entry?.subject) {
          const name = getSubjectName(entry.subject, branch);
          if (name) setSubject(name);
        }
      }
    }
  };

  // Get today's schedule for the info bar
  const day = now.getDay();
  const timetable = getTimetableForBranch(branch);
  const todaySchedule = timetable ? timetable[day] : null;

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
          <div style={{ width: 48, height: 48, background: 'var(--primary)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', boxShadow: '0 4px 12px rgba(99,102,241,0.3)' }}>
            <img src="/logo.png" alt="Junsui Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
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

        {/* Auto-Detect Banner */}
        {timetable && autoSubjectName && !isHoliday && (
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
              {(() => {
                const options = [];
                const skip = new Set();
                
                for (let idx = 0; idx < TIME_SLOTS.length; idx++) {
                  if (skip.has(idx)) continue;
                  
                  const slot = TIME_SLOTS[idx];
                  const entry = timetable && todaySchedule ? todaySchedule[idx] : null;
                  const nextEntry = (timetable && todaySchedule && idx + 1 < TIME_SLOTS.length) ? todaySchedule[idx + 1] : null;
                  
                  // Check if this is a 2-hour lab (same lab in next slot)
                  const is2HrLab = entry?.isLab && nextEntry?.isLab && entry.subject === nextEntry.subject;
                  
                  let label = '';
                  let endSlot = slot;
                  
                  if (is2HrLab) {
                    endSlot = TIME_SLOTS[idx + 1];
                    skip.add(idx + 1); // Skip next slot
                    label = `🔬 ${entry.subject} — ${formatTime12h(slot.startH, slot.startM)} – ${formatTime12h(endSlot.endH, endSlot.endM)} (2 hrs)`;
                  } else if (entry?.subject) {
                    label = `${slot.label}: ${formatTime12h(slot.startH, slot.startM)} – ${formatTime12h(slot.endH, slot.endM)} — ${entry.subject}`;
                    if (entry.isLab) label += ' 🔬';
                  } else if (entry?.label) {
                    label = `${slot.label}: ${formatTime12h(slot.startH, slot.startM)} – ${formatTime12h(slot.endH, slot.endM)} — ${entry.label}`;
                  } else {
                    label = `${slot.label}: ${formatTime12h(slot.startH, slot.startM)} – ${formatTime12h(slot.endH, slot.endM)}`;
                  }
                  
                  if (slot.id === autoDetected?.slot?.id) label += ' ✦';
                  
                  options.push(
                    <option key={slot.id} value={slot.id}>{label}</option>
                  );
                }
                
                return options;
              })()}
            </select>
          </div>
          {timetable && (
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>
              ✦ Current/next lecture auto-detected from timetable
            </div>
          )}
        </div>

        <div className="input-group">
          <label className="input-label">Subject</label>
          <div className="select-wrapper" style={{ display: 'block' }}>
            <input 
              type="text"
              className="junsui-input" 
              value={subject} 
              onChange={e => setSubject(e.target.value)}
              list="subject-list"
              placeholder="Select or type subject..."
              style={{ padding: '12px 16px', width: '100%' }}
            />
            <datalist id="subject-list">
              {allSubjects.map(s => <option key={s} value={s} />)}
            </datalist>
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
