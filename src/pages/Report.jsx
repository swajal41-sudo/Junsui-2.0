import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Download, ArrowLeft } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { studentDataMap } from '../db/students';

export default function Report() {
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [queue, setQueue] = useState([]);
  const [branchStudents, setBranchStudents] = useState([]);

  useEffect(() => {
    const sessionData = localStorage.getItem('junsui_current_session');
    const queueData = localStorage.getItem('junsui_attendance_queue');
    
    if (sessionData && queueData) {
      const parsedSession = JSON.parse(sessionData);
      setSession(parsedSession);
      setQueue(JSON.parse(queueData));
      setBranchStudents(studentDataMap[parsedSession.branch] || []);
    } else {
      navigate('/');
    }
  }, [navigate]);

  const toggleAttendance = (rollNo) => {
    let newQueue = [...queue];
    const recordIndex = newQueue.findIndex(r => r.rollNo === rollNo);
    
    if (recordIndex >= 0) {
      newQueue[recordIndex] = {
        ...newQueue[recordIndex],
        status: newQueue[recordIndex].status === 'present' ? 'absent' : 'present'
      };
    } else {
      newQueue.push({
        rollNo,
        status: 'present',
        timestamp: new Date().toISOString()
      });
    }
    
    setQueue(newQueue);
    localStorage.setItem('junsui_attendance_queue', JSON.stringify(newQueue));
  };

  const exportPDF = () => {
    if (!session) return;
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(14);
    doc.text('Junsui - Attendance Report', 14, 12);
    
    doc.setFontSize(9);
    doc.text(`Branch: ${session.branch}   |   Subject: ${session.subject}   |   Date: ${session.date}`, 14, 18);
    
    const tableData = branchStudents.slice(0, session.numStudents).map((name, index) => {
      const rollNo = index + 1;
      const record = queue.find(r => r.rollNo === rollNo);
      const status = record ? (record.status === 'present' ? 'P' : 'A') : 'Not Marked';
      return [
        `${session.branch}-${rollNo.toString().padStart(3, '0')}`,
        name,
        status
      ];
    });

    autoTable(doc, {
      startY: 22,
      head: [['Roll No', 'Student Name', 'Status']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [99, 102, 241] },
      styles: {
        fontSize: 8,
        cellPadding: 1.5,
      },
      margin: { top: 10, bottom: 10, left: 14, right: 14 }
    });

    doc.save(`Attendance_${session.branch}_${session.date}.pdf`);
  };

  const exportExcel = () => {
    if (!session) return;
    
    const tableData = branchStudents.slice(0, session.numStudents).map((name, index) => {
      const rollNo = index + 1;
      const record = queue.find(r => r.rollNo === rollNo);
      const status = record ? (record.status === 'present' ? 'P' : 'A') : 'Not Marked';
      return {
        'Roll No': `${session.branch}-${rollNo.toString().padStart(3, '0')}`,
        'Student Name': name,
        'Status': status
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(tableData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance");
    
    XLSX.writeFile(workbook, `Attendance_${session.branch}_${session.date}.xlsx`);
  };

  if (!session) return null;

  return (
    <div style={{ padding: '20px', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      
      <div className="junsui-card" style={{ maxWidth: '600px', width: '100%', padding: '24px' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid var(--card-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button onClick={() => navigate('/call')} className="icon-btn" style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
              <ArrowLeft size={24} />
            </button>
            <h2 style={{ margin: 0, fontSize: '20px' }}>Session Report</h2>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button onClick={exportPDF} className="btn" style={{ background: 'rgba(244, 63, 94, 0.1)', color: '#f43f5e', border: '1px solid rgba(244, 63, 94, 0.2)', padding: '8px 12px' }} title="Export PDF">
              <FileText size={20} />
            </button>
            <button onClick={exportExcel} className="btn" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.2)', padding: '8px 12px' }} title="Export Excel">
              <Download size={20} />
            </button>
          </div>
        </div>

        {/* Metadata */}
        <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', color: 'var(--text-secondary)', fontSize: '14px', flexWrap: 'wrap' }}>
          <div><strong style={{ color: 'white' }}>Date:</strong> {session.date}</div>
          <div><strong style={{ color: 'white' }}>Branch:</strong> {session.branch}</div>
          <div><strong style={{ color: 'white' }}>Subject:</strong> {session.subject}</div>
        </div>

        {/* Table */}
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
              {branchStudents.slice(0, session.numStudents).map((name, index) => {
                const rollNo = index + 1;
                const record = queue.find(r => r.rollNo === rollNo);
                const isPresent = record?.status === 'present';
                
                return (
                  <tr key={rollNo} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                    <td style={{ padding: '16px', fontSize: '14px' }}>
                      {session.branch.split('-')[0]}-{rollNo.toString().padStart(3, '0')}
                    </td>
                    <td style={{ padding: '16px', fontSize: '15px', fontWeight: 500 }}>
                      {name}
                    </td>
                    <td style={{ padding: '16px', textAlign: 'center' }}>
                      <span 
                        onClick={() => toggleAttendance(rollNo)}
                        style={{ 
                          padding: '6px 12px', 
                          borderRadius: '20px', 
                          fontSize: '12px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          backgroundColor: isPresent ? 'rgba(16, 185, 129, 0.15)' : 'rgba(244, 63, 94, 0.15)',
                          color: isPresent ? 'var(--present-btn)' : 'var(--absent-btn)'
                        }}>
                        {isPresent ? 'P' : 'A'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}
