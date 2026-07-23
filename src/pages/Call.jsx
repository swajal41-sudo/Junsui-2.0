import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, X, Undo2, LayoutList, Download } from 'lucide-react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';

import { studentDataMap } from '../db/students';
import { db } from '../db/db';

// Haptic feedback
function triggerHaptic(pattern = [30]) {
  if (navigator.vibrate) navigator.vibrate(pattern);
}

export default function Call() {
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [currentRoll, setCurrentRoll] = useState(1);
  const [queue, setQueue] = useState([]);
  const [exitDirection, setExitDirection] = useState(0); // -1 left (absent), +1 right (present)
  const [isDragging, setIsDragging] = useState(false);
  
  useEffect(() => {
    const data = localStorage.getItem('junsui_current_session');
    if (data) {
      setSession(JSON.parse(data));
    } else {
      navigate('/');
    }
  }, [navigate]);

  const handleMark = useCallback((status) => {
    if (!session) return;
    
    triggerHaptic(status === 'present' ? [20] : [40, 30, 40]);
    setExitDirection(status === 'present' ? 1 : -1);
    
    const newRecord = {
      rollNo: currentRoll,
      status: status,
      timestamp: new Date().toISOString()
    };
    
    const updatedQueue = [...queue, newRecord];
    setQueue(updatedQueue);

    // Persist to Dexie for history
    if (session.branch !== 'DEMO') {
      db.attendance.add({
        studentId: currentRoll,
        date: session.date,
        status: status === 'present' ? 'Present' : 'Absent',
        timestamp: new Date().toISOString(),
        subject: session.subject,
        timeSlot: session.timeSlot || '',
        branch: session.branch
      }).catch(err => console.error('Dexie save failed:', err));
    }
    
    // Move to next student
    setTimeout(() => {
      setExitDirection(0);
      if (currentRoll < session.numStudents) {
        setCurrentRoll(prev => prev + 1);
      } else {
        localStorage.setItem('junsui_attendance_queue', JSON.stringify(updatedQueue));
        navigate('/report');
      }
    }, 200);
  }, [session, currentRoll, queue, navigate]);

  const handleUndo = useCallback(() => {
    if (queue.length === 0) return;
    triggerHaptic([15]);
    const newQueue = [...queue];
    const lastRecord = newQueue.pop();
    setQueue(newQueue);
    setCurrentRoll(prev => prev - 1);
    setExitDirection(0);

    // Remove from Dexie
    if (lastRecord && session && session.branch !== 'DEMO') {
      db.attendance
        .where({ studentId: lastRecord.rollNo, date: session.date, subject: session.subject, branch: session.branch })
        .reverse().first()
        .then(record => { if (record) db.attendance.delete(record.id); })
        .catch(err => console.error('Dexie undo failed:', err));
    }
  }, [queue, session]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      const key = e.key.toLowerCase();
      if (key === 'p' || key === 'arrowright') { e.preventDefault(); handleMark('present'); }
      else if (key === 'a' || key === 'arrowleft') { e.preventDefault(); handleMark('absent'); }
      else if (key === 'z') { e.preventDefault(); handleUndo(); }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleMark, handleUndo]);

  if (!session) return null;

  const demoNames = ["Babu Rao", "Raju", "Shyam", "Anuradha", "Khadak Singh", "Totla Seth", "Devi Prasad", "Kachra Seth", "Nanji Bhai", "Chote"];
  const branchStudents = session.branch === 'DEMO' ? demoNames : (studentDataMap[session.branch] || []);
  const studentName = branchStudents[currentRoll - 1] || `Student ${currentRoll}`;
  const formattedRoll = `${session.branch}-${currentRoll.toString().padStart(3, '0')}`;

  const presentCount = queue.filter(r => r.status === 'present').length;
  const absentCount = queue.filter(r => r.status === 'absent').length;
  const remaining = session.numStudents - queue.length;
  const progress = (queue.length / session.numStudents) * 100;

  // Progress ring calculations
  const ringRadius = 22;
  const ringCircumference = 2 * Math.PI * ringRadius;
  const ringOffset = ringCircumference - (progress / 100) * ringCircumference;

  return (
    <div style={{ padding: '20px', minHeight: '100vh', display: 'flex', justifyContent: 'center' }}>
      
      <div style={{ width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column' }}>
        
        {/* Top Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '16px', borderBottom: '1px solid var(--card-border)', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Progress Ring */}
            <svg width="52" height="52" style={{ transform: 'rotate(-90deg)' }}>
              <circle cx="26" cy="26" r={ringRadius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="4" />
              <circle 
                cx="26" cy="26" r={ringRadius} fill="none" 
                stroke="var(--primary-btn)" strokeWidth="4" strokeLinecap="round"
                strokeDasharray={ringCircumference} strokeDashoffset={ringOffset}
                style={{ transition: 'stroke-dashoffset 0.4s ease' }}
              />
              <text 
                x="26" y="26" 
                textAnchor="middle" dominantBaseline="central" 
                fill="white" fontSize="11" fontWeight="700" fontFamily="Outfit"
                style={{ transform: 'rotate(90deg)', transformOrigin: '26px 26px' }}
              >
                {queue.length}/{session.numStudents}
              </text>
            </svg>
            <div>
              <h2 style={{ fontSize: '16px', margin: 0, fontWeight: 600 }}>Attendance Call</h2>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>{session.subject}</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '16px', color: 'var(--text-secondary)' }}>
            <LayoutList 
              size={20} 
              style={{ cursor: 'pointer' }} 
              onClick={() => {
                localStorage.setItem('junsui_attendance_queue', JSON.stringify(queue));
                navigate('/report');
              }} 
            />
          </div>
        </div>

        {/* Live Stats Bar */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: '20px', 
          marginBottom: '24px',
          padding: '10px 16px',
          background: 'rgba(255,255,255,0.03)',
          borderRadius: '12px',
          border: '1px solid var(--card-border)',
          fontSize: '13px',
          fontWeight: 500
        }}>
          <span style={{ color: 'var(--present-btn)' }}>✅ {presentCount}</span>
          <span style={{ color: 'var(--absent-btn)' }}>❌ {absentCount}</span>
          <span style={{ color: 'var(--text-secondary)' }}>⏭ {remaining} left</span>
        </div>

        {/* Swipeable Card Container */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
          
          {/* Swipe hint labels */}
          <div style={{ 
            position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)',
            color: 'var(--absent-btn)', fontSize: '12px', fontWeight: 600, opacity: isDragging ? 0.6 : 0,
            transition: 'opacity 0.2s'
          }}>
            ← A
          </div>
          <div style={{ 
            position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)',
            color: 'var(--present-btn)', fontSize: '12px', fontWeight: 600, opacity: isDragging ? 0.6 : 0,
            transition: 'opacity 0.2s'
          }}>
            P →
          </div>

          <AnimatePresence mode="popLayout" custom={exitDirection}>
            <motion.div
              key={currentRoll}
              initial={{ scale: 0.9, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, x: 0, y: 0 }}
              exit={(custom) => ({ 
                x: exitDirection * 300, 
                opacity: 0, 
                scale: 0.8, 
                rotate: exitDirection * 15,
                transition: { duration: 0.3, ease: 'easeIn' }
              })}
              transition={{ type: "spring", stiffness: 400, damping: 28 }}

              // Swipe gesture
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.8}
              onDragStart={() => setIsDragging(true)}
              onDragEnd={(e, info) => {
                setIsDragging(false);
                const threshold = 100;
                if (info.offset.x > threshold) {
                  handleMark('present');
                } else if (info.offset.x < -threshold) {
                  handleMark('absent');
                }
              }}

              className="junsui-card-sm"
              style={{ 
                textAlign: 'center', 
                cursor: 'grab',
                touchAction: 'pan-y',
                userSelect: 'none',
              }}
              whileDrag={{ scale: 1.03, cursor: 'grabbing' }}
            >
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px', fontWeight: 600, letterSpacing: '1px' }}>
                {formattedRoll}
              </div>
              <div style={{ fontSize: '26px', fontWeight: '700', marginBottom: '16px', lineHeight: 1.2 }}>
                {studentName}
              </div>

              {/* Swipe instruction */}
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)', opacity: 0.5, marginTop: '8px' }}>
                ← swipe to mark →
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Controls at bottom */}
        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', paddingBottom: '40px' }}>
          
          <div style={{ display: 'flex', width: '100%', gap: '16px' }}>
            <button className="btn btn-absent" onClick={() => handleMark('absent')}>
              <X size={24} />
              Absent
            </button>
            <button className="btn btn-present" onClick={() => handleMark('present')}>
              <Check size={24} />
              Present
            </button>
          </div>
          
          <button className="btn btn-undo" onClick={handleUndo} disabled={queue.length === 0} style={{ opacity: queue.length === 0 ? 0.5 : 1 }}>
            <Undo2 size={16} /> Undo
          </button>
          
        </div>

      </div>
    </div>
  );
}
