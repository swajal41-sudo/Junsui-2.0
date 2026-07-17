import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogOut, Play, Clock, BookOpen, CalendarDays } from 'lucide-react';
import { 
  CSE_TIMETABLE, TIME_SLOTS, WORKING_DAYS,
  isWorkingDay, isHolidaySaturday, getCurrentLecture, 
  getSubjectName, formatTime12h 
} from '../db/timetable';

export default function Dashboard() {
  const { logout, currentUser } = useAuth();
  const navigate = useNavigate();
  const now = new Date();
  const day = now.getDay();
  const isHoliday = !isWorkingDay(now);
  const todaySchedule = CSE_TIMETABLE[day] || null;
  const currentLecture = getCurrentLecture(now);
  const dayName = WORKING_DAYS.find(d => d.id === day)?.name || 'Sunday';

  async function handleLogout() {
    await logout();
    navigate('/login');
  }

  return (
    <div style={{ padding: '20px', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      
      {/* Header */}
      <div style={{ width: '100%', maxWidth: '480px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '24px' }}>⛩ Junsui</h1>
          <p style={{ margin: '4px 0 0', fontSize: '13px', color: 'var(--text-secondary)' }}>{currentUser?.email}</p>
        </div>
        <button 
          onClick={handleLogout} 
          className="icon-btn" 
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--card-border)', padding: '10px', borderRadius: '12px' }}
        >
          <LogOut size={18} color="var(--text-secondary)" />
        </button>
      </div>

      {/* Current Lecture Banner */}
      {currentLecture && currentLecture.entry.subject && (
        <div style={{ 
          width: '100%', maxWidth: '480px', marginBottom: '20px',
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(139, 92, 246, 0.1))',
          border: '1px solid rgba(99, 102, 241, 0.25)',
          borderRadius: '16px', padding: '20px',
        }}>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px', fontWeight: 500 }}>
            🔴 Now — {currentLecture.slot.label}
          </div>
          <div style={{ fontSize: '20px', fontWeight: 700, marginBottom: '6px' }}>
            {getSubjectName(currentLecture.entry.subject)}
          </div>
          <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
            {formatTime12h(currentLecture.slot.startH, currentLecture.slot.startM)} – {formatTime12h(currentLecture.slot.endH, currentLecture.slot.endM)}
            {currentLecture.entry.isLab && <span style={{ marginLeft: 8 }}>🔬 Lab</span>}
          </div>
        </div>
      )}

      {/* Quick Action Card */}
      <div className="junsui-card" style={{ marginBottom: '20px' }}>
        <h2 style={{ marginBottom: '16px', fontSize: '20px' }}>Take Attendance</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', fontSize: '14px' }}>Start a new session or view past records.</p>
        
        <div style={{ display: 'flex', gap: '12px', flexDirection: 'column' }}>
          <button className="btn btn-primary" onClick={() => navigate('/setup')}>
            <Play size={18} /> Start New Session
          </button>
          
          <button 
            className="btn" 
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--card-border)', padding: '14px' }} 
            onClick={() => navigate('/history')}
          >
            <Clock size={18} /> View Past History
          </button>
        </div>
      </div>

      {/* Today's Schedule */}
      {!isHoliday && todaySchedule && (
        <div style={{ width: '100%', maxWidth: '480px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <CalendarDays size={16} color="var(--text-secondary)" />
            <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-secondary)' }}>
              Today's Schedule — {dayName}
            </span>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {(() => {
              const items = [];
              const skip = new Set();
              
              for (let i = 0; i < TIME_SLOTS.length; i++) {
                if (skip.has(i)) continue;
                
                const slot = TIME_SLOTS[i];
                const entry = todaySchedule[i];
                const nextEntry = (i + 1 < TIME_SLOTS.length) ? todaySchedule[i + 1] : null;
                const is2HrLab = entry?.isLab && nextEntry?.isLab && entry.subject === nextEntry.subject;
                
                const isCurrent = currentLecture?.slot?.id === slot.id;
                const isPast = (now.getHours() * 60 + now.getMinutes()) > (slot.endH * 60 + slot.endM);
                
                let endSlot = slot;
                if (is2HrLab) {
                  endSlot = TIME_SLOTS[i + 1];
                  skip.add(i + 1);
                }
                
                const subjectName = entry?.subject ? getSubjectName(entry.subject) : entry?.label || 'Free';
                
                items.push(
                  <div key={i} style={{ 
                    display: 'flex', alignItems: 'center', gap: '12px',
                    padding: '12px 16px',
                    background: isCurrent ? 'rgba(99, 102, 241, 0.1)' : 'rgba(255,255,255,0.02)',
                    border: `1px solid ${isCurrent ? 'rgba(99, 102, 241, 0.3)' : 'var(--card-border)'}`,
                    borderRadius: '12px',
                    opacity: isPast && !isCurrent ? 0.4 : 1,
                    transition: 'all 0.2s'
                  }}>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)', minWidth: '85px', fontWeight: 500 }}>
                      {formatTime12h(slot.startH, slot.startM)}
                      {is2HrLab && <div style={{ fontSize: '10px', opacity: 0.6 }}>2 hrs</div>}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '14px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                        {entry?.isLab && '🔬'} {subjectName}
                        {isCurrent && <span style={{ fontSize: '8px', color: 'var(--primary-btn)', background: 'rgba(99,102,241,0.2)', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>NOW</span>}
                      </div>
                    </div>
                    {isPast && !isCurrent && <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Done</span>}
                  </div>
                );
              }
              return items;
            })()}
          </div>
        </div>
      )}

      {/* Holiday message */}
      {isHoliday && (
        <div style={{ 
          width: '100%', maxWidth: '480px', textAlign: 'center', 
          padding: '40px 20px', color: 'var(--text-secondary)', fontSize: '15px' 
        }}>
          {isHolidaySaturday(now) ? '🎉 2nd/4th Saturday — Enjoy your holiday!' : '🌙 Sunday — No classes today!'}
        </div>
      )}

    </div>
  );
}
