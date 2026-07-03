import Dexie from 'dexie';

export const db = new Dexie('AttendanceDB');

// Matches the old schema from app.js
db.version(3).stores({
  students: '++id, rollNo, name, totalClasses, attendedClasses',
  attendance: '++id, studentId, date, status, timestamp, subject, timeSlot, branch',
  queue: '++id, studentId, date, status, timestamp, subject, timeSlot, branch',
  student_registry: '[branch+rollNo], branch, rollNo, name'
});
