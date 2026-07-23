import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogOut, Play, Clock, BookOpen, CalendarDays, ChevronRight, User } from 'lucide-react';
import { 
  TIME_SLOTS, WORKING_DAYS,
  isWorkingDay, isHolidaySaturday, getCurrentLecture, 
  getSubjectName, formatTime12h, getTimetableForBranch
} from '../db/timetable';
import useWindowSize from '../hooks/useWindowSize';

export default function Dashboard() {
  const { logout, currentUser } = useAuth();
  const navigate = useNavigate();
  const lastSession = localStorage.getItem('junsui_current_session');
  const branch = lastSession ? JSON.parse(lastSession).branch : 'CSE';

  const now = new Date();
  const day = now.getDay();
  const isHoliday = !isWorkingDay(now);
  const timetable = getTimetableForBranch(branch);
  const todaySchedule = timetable ? timetable[day] : null;
  const currentLecture = getCurrentLecture(now, branch);
  const dayName = WORKING_DAYS.find(d => d.id === day)?.name || 'Sunday';

  async function handleLogout() {
    await logout();
    navigate('/login');
  }

  return (
    <div style={{ padding: '24px 20px', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', background: '#0a0a0a', color: '#fff', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      
      {/* Header */}
      <header style={{ width: '100%', maxWidth: '480px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg, #6366f1, #a855f7)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: '20px' }}>⛩</span>
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: '18px', fontWeight: 700 }}>Junsui</h1>
            <p style={{ margin: 0, fontSize: '12px', color: '#888' }}>{currentUser?.email?.split('@')[0]}</p>
          </div>
        </div>
        <button onClick={handleLogout} style={{ background: '#1a1a1a', border: '1px solid #333', padding: '8px', borderRadius: '10px', cursor: 'pointer', color: '#888' }}>
          <LogOut size={18} />
        </button>
      </header>

      {/* Hero Card */}
      <section style={{ width: '100%', maxWidth: '480px', marginBottom: '24px', background: '#111', border: '1px solid #222', borderRadius: '24px', padding: '24px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, right: 0, width: '120px', height: '120px', background: 'rgba(99, 102, 241, 0.1)', filter: 'blur(40px)', borderRadius: '50%' }}></div>
        <div style={{ fontSize: '12px', color: '#6366f1', fontWeight: 700, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#6366f1', boxShadow: '0 0 8px #6366f1' }}></div>
          DASHBOARD
        </div>
        <h2 style={{ margin: '0 0 4px 0', fontSize: '24px' }}>Welcome back,</h2>
        <p style={{ color: '#888', marginBottom: '20px' }}>Attendance Manager v2.0</p>
        
        <button onClick={() => navigate('/setup')} style={{ width: '100%', background: '#6366f1', border: 'none', padding: '14px', borderRadius: '14px', color: '#fff', fontSize: '15px', fontWeight: 600, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
          <Play size={18} fill="white" /> Start Attendance
        </button>
      </section>

      {/* Grid Actions */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', width: '100%', maxWidth: '480px', marginBottom: '32px' }}>
        <button onClick={() => navigate('/history')} style={{ background: '#111', border: '1px solid #222', padding: '16px', borderRadius: '20px', color: '#fff', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '8px', cursor: 'pointer' }}>
          <Clock size={20} color="#6366f1" />
          <span style={{ fontSize: '13px', fontWeight: 600 }}>History</span>
        </button>
        <button onClick={() => navigate('/monthly')} style={{ background: '#111', border: '1px solid #222', padding: '16px', borderRadius: '20px', color: '#fff', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '8px', cursor: 'pointer' }}>
          <BookOpen size={20} color="#a855f7" />
          <span style={{ fontSize: '13px', fontWeight: 600 }}>Records</span>
        </button>
      </div>

      {/* Today's Schedule */}
      {!isHoliday && todaySchedule && (
        <section style={{ width: '100%', maxWidth: '480px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ margin: 0, fontSize: '16px' }}>Today's Lectures</h3>
            <span style={{ fontSize: '11px', background: '#1a1a1a', padding: '4px 8px', borderRadius: '6px', color: '#666' }}>{dayName}</span>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
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
                
                if (is2HrLab) skip.add(i + 1);
                
                items.push(
                  <div key={i} style={{ 
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
