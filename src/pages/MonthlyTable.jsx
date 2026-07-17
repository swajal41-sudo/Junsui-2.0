import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Calendar, Filter } from 'lucide-react';
import { db } from '../db/db';
import { studentDataMap } from '../db/students';
import { CSE_SUBJECTS, CSE_LABS } from '../db/timetable';

const branches = [
  { value: 'CSE', label: 'CSE', count: 44 },
  { value: 'ETC', label: 'ETC', count: 51 },
  { value: 'CSE-DS', label: 'CSE-DS', count: 54 },
  { value: 'CSE-CS', label: 'CSE-CS', count: 48 }
];

const allSubjects = [
  ...CSE_SUBJECTS.map(s => s.name),
  ...CSE_LABS.map(l => l.name),
  "Data Structures", "Object Oriented Programming", "Database Management Systems", "Computer Networks", "Operating Systems"
];
const uniqueSubjects = [...new Set(allSubjects)];

export default function MonthlyTable() {
  const navigate = useNavigate();
  const [records, setRecords] = useState([]);
  
  // Filters
  const [branch, setBranch] = useState('CSE');
  const [subject, setSubject] = useState(uniqueSubjects[0]);
  const [month, setMonth] = useState(() => new Date().getMonth() + 1); // 1-12
  const [year, setYear] = useState(() => new Date().getFullYear());

  useEffect(() => {
    // Format month for searching (e.g. '2026-07')
    const monthStr = `${year}-${String(month).padStart(2, '0')}`;
    
    // Fetch all attendance for this branch and subject
    // We fetch all and filter in memory since Dexie complex queries are limited
    db.attendance
      .where('branch').equals(branch)
      .toArray()
      .then(data => {
        const filtered = data.filter(r => 
          r.subject === subject && 
          r.date.startsWith(monthStr)
        );
        setRecords(filtered);
      })
      .catch(console.error);
  }, [branch, subject, month, year]);

  const numStudents = branches.find(b => b.value === branch)?.count || 0;
  const branchStudents = studentDataMap[branch] || [];

  // Generate grid data
  const gridData = useMemo(() => {
    const daysInMonth = new Date(year, month, 0).getDate();
    
    // Map records by studentId -> date -> status
    const studentMap = {};
    for (let i = 1; i <= numStudents; i++) {
      studentMap[i] = { presentCount: 0, totalClasses: 0, days: {} };
    }

    // Keep track of which days actually had a class
    const classDaysSet = new Set();

    records.forEach(r => {
      if (!studentMap[r.studentId]) return;
      const day = parseInt(r.date.split('-')[2], 10);
      classDaysSet.add(day);
      
      // If multiple slots on same day, we record it as an array or just take first
      // For simplicity in UI, we just take the first entry of the day or merge
      studentMap[r.studentId].days[day] = r.status === 'Present' ? 'P' : 'A';
    });

    const classDays = Array.from(classDaysSet).sort((a,b) => a-b);
    
    // Calculate totals based ONLY on days where classes happened
    for (let i = 1; i <= numStudents; i++) {
      let pCount = 0;
      let total = 0;
      classDays.forEach(d => {
        if (studentMap[i].days[d]) {
          total++;
          if (studentMap[i].days[d] === 'P') pCount++;
        }
      });
      studentMap[i].presentCount = pCount;
      studentMap[i].totalClasses = total;
    }

    return { studentMap, classDays, daysInMonth };
  }, [records, numStudents, month, year]);

  const handleExportCSV = () => {
    const { studentMap, classDays } = gridData;
    
    // CSV Header
    const header = ['Roll No', 'Name', ...classDays.map(d => `${year}-${String(month).padStart(2,'0')}-${String(d).padStart(2,'0')}`), 'Total Present', 'Total Classes', 'Attendance %'];
    
    // CSV Rows
    const rows = [];
    for (let i = 1; i <= numStudents; i++) {
      const row = [i, branchStudents[i-1] || `Student ${i}`];
      
      classDays.forEach(d => {
        row.push(studentMap[i].days[d] || '-');
      });
      
      const stats = studentMap[i];
      const percentage = stats.totalClasses > 0 ? Math.round((stats.presentCount / stats.totalClasses) * 100) : 0;
      row.push(stats.presentCount, stats.totalClasses, `${percentage}%`);
      
      rows.push(row);
    }
    
    // Construct CSV string
    const csvContent = [header.join(','), ...rows.map(r => r.join(','))].join('\n');
    
    // Trigger Download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `Junsui_Attendance_${branch}_${subject}_${year}-${month}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ padding: '20px', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ width: '100%', maxWidth: '1000px', display: 'flex', flexDirection: 'column', flex: 1 }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button onClick={() => navigate('/')} className="icon-btn" style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
              <ArrowLeft size={24} />
            </button>
            <h1 style={{ margin: 0, fontSize: '24px' }}>Monthly View</h1>
          </div>
          <button className="btn btn-primary" onClick={handleExportCSV} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', fontSize: '13px' }}>
            <Download size={16} /> Export to Sheets
          </button>
        </div>

        {/* Filters */}
        <div className="junsui-card" style={{ marginBottom: '20px', padding: '16px', display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div style={{ flex: '1 1 120px' }}>
            <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Branch</label>
            <select className="junsui-input" value={branch} onChange={e => setBranch(e.target.value)} style={{ padding: '8px 12px' }}>
              {branches.map(b => <option key={b.value} value={b.value}>{b.label}</option>)}
            </select>
          </div>
          <div style={{ flex: '2 1 200px' }}>
            <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Subject</label>
            <select className="junsui-input" value={subject} onChange={e => setSubject(e.target.value)} style={{ padding: '8px 12px' }}>
              {uniqueSubjects.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div style={{ flex: '1 1 120px' }}>
            <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Month</label>
            <select className="junsui-input" value={month} onChange={e => setMonth(parseInt(e.target.value))} style={{ padding: '8px 12px' }}>
              {Array.from({length: 12}, (_, i) => i + 1).map(m => (
                <option key={m} value={m}>{new Date(2000, m - 1).toLocaleString('default', { month: 'long' })}</option>
              ))}
            </select>
          </div>
          <div style={{ flex: '1 1 100px' }}>
            <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Year</label>
            <input type="number" className="junsui-input" value={year} onChange={e => setYear(parseInt(e.target.value))} style={{ padding: '8px 12px' }} />
          </div>
        </div>

        {/* Data Grid */}
        <div className="junsui-card" style={{ flex: 1, padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          
          {gridData.classDays.length === 0 ? (
            <div style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--text-secondary)' }}>
              <Calendar size={48} style={{ opacity: 0.2, marginBottom: '16px' }} />
              <p>No attendance records found for this month.</p>
            </div>
          ) : (
            <div style={{ overflow: 'auto', flex: 1, background: '#121212' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center', fontSize: '13px', whiteSpace: 'nowrap' }}>
                <thead style={{ position: 'sticky', top: 0, background: 'var(--card-bg)', zIndex: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.5)' }}>
                  <tr>
                    <th style={{ padding: '12px 16px', position: 'sticky', left: 0, background: 'var(--card-bg)', zIndex: 11, textAlign: 'left', borderRight: '1px solid var(--card-border)' }}>Student</th>
                    {gridData.classDays.map(d => (
                      <th key={d} style={{ padding: '12px 8px', borderRight: '1px solid rgba(255,255,255,0.05)', color: 'var(--text-secondary)' }}>{d}</th>
                    ))}
                    <th style={{ padding: '12px 16px', borderLeft: '1px solid var(--card-border)', background: 'rgba(255,255,255,0.02)' }}>%</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.from({length: numStudents}, (_, i) => i + 1).map(roll => {
                    const stats = gridData.studentMap[roll];
                    const percentage = stats.totalClasses > 0 ? Math.round((stats.presentCount / stats.totalClasses) * 100) : 0;
                    
                    return (
                      <tr key={roll} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <td style={{ 
                          padding: '10px 16px', position: 'sticky', left: 0, background: 'var(--card-bg)', 
                          textAlign: 'left', borderRight: '1px solid var(--card-border)',
                          fontWeight: 500
                        }}>
                          <span style={{ opacity: 0.5, marginRight: '8px', fontSize: '11px' }}>{String(roll).padStart(2,'0')}</span>
                          {branchStudents[roll-1] ? branchStudents[roll-1].split(' ')[0] : `Student ${roll}`}
                        </td>
                        
                        {gridData.classDays.map(d => {
                          const status = stats.days[d];
                          return (
                            <td key={d} style={{ 
                              padding: '10px 8px', borderRight: '1px solid rgba(255,255,255,0.02)',
                              color: status === 'P' ? 'var(--present-btn)' : status === 'A' ? 'var(--absent-btn)' : 'var(--text-secondary)'
                            }}>
                              {status || '-'}
                            </td>
                          );
                        })}
                        
                        <td style={{ 
                          padding: '10px 16px', borderLeft: '1px solid var(--card-border)', 
                          background: 'rgba(255,255,255,0.01)', fontWeight: 600,
                          color: percentage < 75 ? 'var(--absent-btn)' : 'var(--present-btn)'
                        }}>
                          {percentage}%
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
