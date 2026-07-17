/**
 * Junsui Timetable Configuration
 * GNIT Nagpur — Session 2026-27 (ODD)
 * 
 * Time Slots: 6 lectures per day with 1 hour lunch break
 * Holidays: 2nd and 4th Saturdays, Sundays
 */

// Lecture time slots (24h format for internal use)
export const TIME_SLOTS = [
  { id: 1, label: 'Lecture 1', start: '09:45', end: '10:45', startH: 9,  startM: 45, endH: 10, endM: 45 },
  { id: 2, label: 'Lecture 2', start: '10:45', end: '11:45', startH: 10, startM: 45, endH: 11, endM: 45 },
  { id: 3, label: 'Lecture 3', start: '11:45', end: '12:45', startH: 11, startM: 45, endH: 12, endM: 45 },
  // Lunch: 12:45 - 1:45
  { id: 4, label: 'Lecture 4', start: '01:45', end: '02:45', startH: 13, startM: 45, endH: 14, endM: 45 },
  { id: 5, label: 'Lecture 5', start: '02:45', end: '03:45', startH: 14, startM: 45, endH: 15, endM: 45 },
  { id: 6, label: 'Lecture 6', start: '03:45', end: '04:45', startH: 15, startM: 45, endH: 16, endM: 45 },
];

// --- CSE (2nd Year) Subjects & Timetable ---
export const CSE_SUBJECTS = [
  { code: 'DS',   name: 'Data Structure',                        teacher: 'Dr. Yogini Paturkar (YP)' },
  { code: 'OOPJ', name: 'Object Oriented Programming With Java', teacher: 'Prof. Isha Gotmare (IG)' },
  { code: 'P&S',  name: 'Probability & Statistics',              teacher: 'Prof. Rupali Khirtikar (RK)' },
  { code: 'ECS',  name: 'Entrepreneurship',                      teacher: 'Dr. Pooja Jaiswal (PJ)' },
  { code: 'COI',  name: 'Constitution of India',                 teacher: 'Prof. Sarita Basechaukar (SB)' },
  { code: 'S&A',  name: 'Sensor & Actuators',                    teacher: 'Prof. Komal Gaikwad (KG)' },
  { code: 'CEP',  name: 'Community Engagement Project',          teacher: 'Prof. Jyoti Ghatole (JG)' },
];

export const CSE_LABS = [
  { code: 'DS LAB',   name: 'Data Structure Lab',  room: '009', teacher: 'Dr. Yogini Paturkar (YP)' },
  { code: 'OOPJ LAB', name: 'OOPJ Lab',            room: '002', teacher: 'Prof. Isha Gotmare (IG)' },
  { code: 'S&A LAB',  name: 'Sensor & Actuators Lab', room: '204', teacher: 'Prof. Komal Gaikwad (KG)' },
];

export const CSE_TIMETABLE = {
  1: [ // MON
    { subject: 'OOPJ', teacher: 'IG' },
    { subject: 'DS',   teacher: 'YP' },
    { subject: 'P&S',  teacher: 'RK' },
    { subject: 'S&A',  teacher: 'KG' },
    { subject: 'DS LAB', teacher: 'YP', isLab: true, room: '009' },
    { subject: 'DS LAB', teacher: 'YP', isLab: true, room: '009' },
  ],
  2: [ // TUE
    { subject: 'DS',   teacher: 'YP' },
    { subject: 'OOPJ', teacher: 'IG' },
    { subject: 'P&S',  teacher: 'RK' },
    { subject: 'S&A',  teacher: 'KG' },
    { subject: 'OOPJ LAB', teacher: 'IG', isLab: true, room: '002' },
    { subject: 'OOPJ LAB', teacher: 'IG', isLab: true, room: '002' },
  ],
  3: [ // WED
    { subject: 'S&A LAB', teacher: 'KG', isLab: true, room: '204' },
    { subject: 'S&A LAB', teacher: 'KG', isLab: true, room: '204' },
    { subject: 'P&S',  teacher: 'RK' },
    { subject: 'S&A',  teacher: 'KG' },
    { subject: 'S&A',  teacher: 'KG' },
    { subject: 'OOPJ', teacher: 'IG' },
  ],
  4: [ // THU
    { subject: 'DS',   teacher: 'YP' },
    { subject: 'ECS',  teacher: 'PJ' },
    { subject: 'COI',  teacher: 'SB' },
    { subject: 'COI',  teacher: 'SB' },
    { subject: 'P&S',  teacher: 'RK' },
    { subject: 'OOPJ', teacher: 'IG' },
  ],
  5: [ // FRI
    { subject: 'COI',  teacher: 'SB' },
    { subject: 'ECS',  teacher: 'PJ' },
    { subject: 'OOPJ', teacher: 'IG' },
    { subject: 'COI',  teacher: 'SB' },
    { subject: 'P&S',  teacher: 'RK' },
    { subject: 'DS',   teacher: 'YP' },
  ],
  6: [ // SAT
    { subject: 'ECS',  teacher: 'PJ' },
    { subject: 'ECS',  teacher: 'PJ' },
    { subject: 'CEP',  teacher: 'JG' },
    { subject: null, label: 'Library' },
    { subject: null, label: 'Sports' },
    { subject: null, label: 'Sports' },
  ],
};

// --- CSE(CS) (Cyber Security 3rd Sem) Subjects & Timetable ---
export const CSE_CS_SUBJECTS = [
  { code: 'DSA', name: 'Data Structure Algorithm',       teacher: 'Dr. Yogini Patukar (YP)' },
  { code: 'CN',  name: 'Computer Network',               teacher: 'Prof. Shubham Lokhande (SL)' },
  { code: 'CLE', name: 'Cyber Law & Ethics',             teacher: 'Prof. Swati Gandhe (SG)' },
  { code: 'S&A', name: 'Sensor & Actuator',              teacher: 'Prof. Komal Gaikwad (KG)' },
  { code: 'COI', name: 'Constitution of India',          teacher: 'Prof. Gauri Thakre (GT)' },
  { code: 'DE',  name: 'Digital Economy',                teacher: 'Prof. Roshni Kolhe (RK)' },
  { code: 'CEP', name: 'Community Engagement Project',   teacher: 'Dr. Pooja Jaiswal (PJ)' },
];

export const CSE_CS_LABS = [
  { code: 'CN LAB',   name: 'Computer Network Lab',       teacher: 'Prof. Shubham Lokhande (SL)' },
  { code: 'DSA LAB',  name: 'Data Structure Lab',         room: '305', teacher: 'Dr. Yogini Patukar (YP)' },
  { code: 'S&A LAB',  name: 'Sensor & Actuator Lab',      room: '204', teacher: 'Prof. Komal Gaikwad (KG)' },
];

export const CSE_CS_TIMETABLE = {
  1: [ // MON
    { subject: 'CLE', teacher: 'SG' },
    { subject: 'CN LAB', teacher: 'SL', isLab: true },
    { subject: 'CN LAB', teacher: 'SL', isLab: true },
    { subject: 'DE',  teacher: 'RK' },
    { subject: 'DE',  teacher: 'RK' },
    { subject: 'CLE', teacher: 'SG' },
  ],
  2: [ // TUE
    { subject: 'CN',  teacher: 'SL' },
    { subject: 'DSA LAB', teacher: 'YP', isLab: true, room: '305' },
    { subject: 'DSA LAB', teacher: 'YP', isLab: true, room: '305' },
    { subject: 'DSA', teacher: 'YP' },
    { subject: 'COI', teacher: 'GT' },
    { subject: 'S&A', teacher: 'KG' },
  ],
  3: [ // WED
    { subject: 'CN',  teacher: 'SL' },
    { subject: 'CLE', teacher: 'SG' },
    { subject: 'DSA', teacher: 'YP' },
    { subject: 'DSA', teacher: 'YP' },
    { subject: 'COI', teacher: 'GT' },
    { subject: 'CEP', teacher: 'PJ' }, // Marked as E&S on timetable, mapped to CEP project
  ],
  4: [ // THU
    { subject: 'CN',  teacher: 'SL' },
    { subject: 'S&A', teacher: 'KG' },
    { subject: 'COI', teacher: 'GT' },
    { subject: 'S&A', teacher: 'KG' },
    { subject: 'COI', teacher: 'GT' },
    { subject: 'CLE', teacher: 'SG' },
  ],
  5: [ // FRI
    { subject: 'CN',  teacher: 'SL' },
    { subject: 'DSA', teacher: 'YP' },
    { subject: 'S&A', teacher: 'KG' },
    { subject: 'CLE', teacher: 'SG' },
    { subject: 'S&A LAB', teacher: 'KG', isLab: true, room: '204' },
    { subject: 'S&A LAB', teacher: 'KG', isLab: true, room: '204' },
  ],
  6: [ // SAT
    { subject: 'CEP', teacher: 'PJ' },
    { subject: 'CEP', teacher: 'PJ' },
    { subject: null,  label: 'Free' },
    { subject: null,  label: 'Library' },
    { subject: null,  label: 'Sports' },
    { subject: null,  label: 'Sports' },
  ],
};

// --- Utilities ---

export const WORKING_DAYS = [
  { id: 1, name: 'Monday',    short: 'Mon' },
  { id: 2, name: 'Tuesday',   short: 'Tue' },
  { id: 3, name: 'Wednesday', short: 'Wed' },
  { id: 4, name: 'Thursday',  short: 'Thu' },
  { id: 5, name: 'Friday',    short: 'Fri' },
  { id: 6, name: 'Saturday',  short: 'Sat' },
];

export function isHolidaySaturday(date) {
  if (date.getDay() !== 6) return false;
  const dayOfMonth = date.getDate();
  const weekNumber = Math.ceil(dayOfMonth / 7);
  return weekNumber === 2 || weekNumber === 4;
}

export function isWorkingDay(date) {
  const day = date.getDay();
  if (day === 0) return false;
  if (isHolidaySaturday(date)) return false;
  return true;
}

export function getTimetableForBranch(branch) {
  if (branch === 'CSE') return CSE_TIMETABLE;
  if (branch === 'CSE-CS') return CSE_CS_TIMETABLE;
  return null;
}

export function getCurrentLecture(now = new Date(), branch = 'CSE') {
  const day = now.getDay();
  const timetable = getTimetableForBranch(branch);
  
  if (day === 0 || !timetable || !timetable[day]) return null;
  if (isHolidaySaturday(now)) return null;

  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  
  for (let i = 0; i < TIME_SLOTS.length; i++) {
    const slot = TIME_SLOTS[i];
    const slotStart = slot.startH * 60 + slot.startM;
    const slotEnd = slot.endH * 60 + slot.endM;
    
    if (currentMinutes >= slotStart && currentMinutes < slotEnd) {
      return { slot, entry: timetable[day][i] };
    }
  }
  
  return null;
}

export function getNextLecture(now = new Date(), branch = 'CSE') {
  const day = now.getDay();
  const timetable = getTimetableForBranch(branch);
  
  if (day === 0 || !timetable || !timetable[day]) return null;
  if (isHolidaySaturday(now)) return null;

  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  
  for (let i = 0; i < TIME_SLOTS.length; i++) {
    const slot = TIME_SLOTS[i];
    const slotStart = slot.startH * 60 + slot.startM;
    
    if (currentMinutes < slotStart) {
      const entry = timetable[day][i];
      if (entry && entry.subject) return { slot, entry };
    }
  }
  
  return null;
}

export function getAutoDetectedSlot(now = new Date(), branch = 'CSE') {
  const current = getCurrentLecture(now, branch);
  if (current && current.entry.subject) return current;
  
  const next = getNextLecture(now, branch);
  if (next) return next;
  
  const timetable = getTimetableForBranch(branch) || CSE_TIMETABLE;
  const day = now.getDay();
  
  if (day > 0 && day <= 6 && timetable[day]) {
    return { slot: TIME_SLOTS[0], entry: timetable[day][0] };
  }
  return { slot: TIME_SLOTS[0], entry: timetable[1][0] };
}

export function getSubjectName(code, branch = 'CSE') {
  if (!code) return null;
  
  const subjects = branch === 'CSE-CS' ? CSE_CS_SUBJECTS : CSE_SUBJECTS;
  const labs = branch === 'CSE-CS' ? CSE_CS_LABS : CSE_LABS;
  
  const sub = subjects.find(s => s.code === code);
  if (sub) return sub.name;
  const lab = labs.find(l => l.code === code);
  if (lab) return lab.name;
  return code;
}

export function formatTime12h(h, m) {
  const period = h < 12 ? 'AM' : 'PM';
  const hour12 = h % 12 || 12;
  return `${hour12}:${String(m).padStart(2, '0')} ${period}`;
}

export function formatSlotRange(slot) {
  return `${formatTime12h(slot.startH, slot.startM)} - ${formatTime12h(slot.endH, slot.endM)}`;
}
