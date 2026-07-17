import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, X, Undo2, LayoutList, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { studentDataMap } from '../db/students';
import { db } from '../db/db';

export default function Call() {
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [currentRoll, setCurrentRoll] = useState(1);
  const [queue, setQueue] = useState([]);
  
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
    
    const newRecord = {
      rollNo: currentRoll,
      status: status,
      timestamp: new Date().toISOString()
    };
    
    const updatedQueue = [...queue, newRecord];
    setQueue(updatedQueue);

    // Persist to Dexie for history
    db.attendance.add({
      studentId: currentRoll,
      date: session.date,
      status: status === 'present' ? 'Present' : 'Absent',
      timestamp: new Date().toISOString(),
      subject: session.subject,
      timeSlot: '',
      branch: session.branch
    }).catch(err => console.error('Dexie save failed:', err));
    
    // Move to next student
    setTimeout(() => {
      if (currentRoll < session.numStudents) {
        setCurrentRoll(prev => prev + 1);
      } else {
        localStorage.setItem('junsui_attendance_queue', JSON.stringify(updatedQueue));
        navigate('/report');
      }
    }, 150); // Delay to let animation play
  }, [session, currentRoll, queue, navigate]);

  const handleUndo = useCallback(() => {
    if (queue.length === 0) return;
    const newQueue = [...queue];
    const removed = newQueue.pop();
    setQueue(newQueue);
    setCurrentRoll(prev => prev - 1);

    // Remove from Dexie too
    if (removed && session) {
      db.attendance
        .where({ studentId: removed.rollNo, date: session.date, subject: session.subject, branch: session.branch })
        .last()
        .then(record => { if (record) db.attendance.delete(record.id); })
        .catch(err => console.error('Dexie undo failed:', err));
    }
  }, [queue, session]);

  // Keyboard shortcuts: P = Present, A = Absent, Z = Undo
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't trigger if user is typing in an input
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      
      const key = e.key.toLowerCase();
      if (key === 'p' || key === 'arrowright') {
        e.preventDefault();
        handleMark('present');
      } else if (key === 'a' || key === 'arrowleft') {
        e.preventDefault();
        handleMark('absent');
      } else if (key === 'z') {
        e.preventDefault();
        handleUndo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleMark, handleUndo]);

  if (!session) return null;

  const branchStudents = studentDataMap[session.branch] || [];
  const studentName = branchStudents[currentRoll - 1] || `Student ${currentRoll}`;
  const formattedRoll = `${session.branch}-${currentRoll.toString().padStart(3, '0')}`;

  const presentCount = queue.filter(r => r.status === 'present').length;
  const absentCount = queue.filter(r => r.status === 'absent').length;
  const remaining = session.numStudents - queue.length;

  return (
    <div style={{ padding: '20px', minHeight: '100vh', display: 'flex', justifyContent: 'center' }}>
      
      <div style={{ width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column' }}>
        
        {/* Top Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '16px', borderBottom: '1px solid var(--card-border)', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '18px', margin: 0, fontWeight: 600 }}>Attendance Call</h2>
          <div style={{ display: 'flex', gap: '16px', color: 'var(--text-secondary)' }}>
            <LayoutList 
              size={20} 
              style={{ cursor: 'pointer' }} 
              onClick={() => {
                localStorage.setItem('junsui_attendance_queue', JSON.stringify(queue));
                navigate('/report');
              }} 
            />
            <Download size={20} style={{ cursor: 'pointer' }} />
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

        {/* Swipe Card Container */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
          <AnimatePresence mode="popLayout">
            <motion.div
              key={currentRoll}
              initial={{ scale: 0.95, opacity: 0, x: 50 }}
              animate={{ scale: 1, opacity: 1, x: 0 }}
              exit={{ scale: 0.95, opacity: 0, x: -50 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="junsui-card-sm"
              style={{ textAlign: 'center' }}
            >
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '12px', fontWeight: 600 }}>
                {formattedRoll}
              </div>
              <div style={{ fontSize: '24px', fontWeight: '700', marginBottom: '20px', lineHeight: 1.2 }}>
                {studentName}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', color: 'var(--present-btn)', fontSize: '13px', fontWeight: 500 }}>
                <Check size={16} /> 100% Attendance
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
