/**
 * Junsui Timetable Configuration
 * GNIT Nagpur — CSE 2nd Year — Session 2026-27 (ODD)
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

// All subjects for CSE 2nd Year (from timetable)
export const CSE_SUBJECTS = [
  { code: 'DS',   name: 'Data Structure',                        teacher: 'Dr. Yogini Paturkar (YP)' },
  { code: 'OOPJ', name: 'Object Oriented Programming With Java', teacher: 'Prof. Isha Gotmare (IG)' },
  { code: 'P&S',  name: 'Probability & Statistics',              teacher: 'Prof. Rupali Khirtikar (RK)' },
  { code: 'ECS',  name: 'Entrepreneurship',                      teacher: 'Dr. Pooja Jaiswal (PJ)' },
  { code: 'COI',  name: 'Constitution of India',                 teacher: 'Prof. Sarita Basechaukar (SB)' },
  { code: 'S&A',  name: 'Sensor & Actuators',                    teacher: 'Prof. Komal Gaikwad (KG)' },
  { code: 'CEP',  name: 'Community Engagement Project',          teacher: 'Prof. Jyoti Ghatole (JG)' },
];

// Lab subjects
export const CSE_LABS = [
  { code: 'DS LAB',   name: 'Data Structure Lab',  room: '009', teacher: 'Dr. Yogini Paturkar (YP)' },
  { code: 'OOPJ LAB', name: 'OOPJ Lab',            room: '002', teacher: 'Prof. Isha Gotmare (IG)' },
  { code: 'S&A LAB',  name: 'Sensor & Actuators Lab', room: '204', teacher: 'Prof. Komal Gaikwad (KG)' },
];

/**
 * CSE Weekly Timetable
 * Key: day number (1=Monday ... 6=Saturday)
 * Value: array of 6 slots, each with subject code and teacher code
 * null = free period / library / sports
 */
export const CSE_TIMETABLE = {
  // MONDAY
  1: [
    { subject: 'OOPJ', teacher: 'IG' },      // 09:45 - 10:45
    { subject: 'DS',   teacher: 'YP' },       // 10:45 - 11:45
    { subject: 'P&S',  teacher: 'RK' },       // 11:45 - 12:45
    { subject: 'S&A',  teacher: 'KG' },       // 01:45 - 02:45
    { subject: 'DS LAB', teacher: 'YP', isLab: true, room: '009' },  // 02:45 - 03:45
    { subject: 'DS LAB', teacher: 'YP', isLab: true, room: '009' },  // 03:45 - 04:45
  ],
  // TUESDAY
  2: [
    { subject: 'DS',   teacher: 'YP' },       // 09:45 - 10:45
    { subject: 'OOPJ', teacher: 'IG' },       // 10:45 - 11:45
    { subject: 'P&S',  teacher: 'RK' },       // 11:45 - 12:45
    { subject: 'S&A',  teacher: 'KG' },       // 01:45 - 02:45
    { subject: 'OOPJ LAB', teacher: 'IG', isLab: true, room: '002' }, // 02:45 - 03:45
    { subject: 'OOPJ LAB', teacher: 'IG', isLab: true, room: '002' }, // 03:45 - 04:45
  ],
  // WEDNESDAY
  3: [
    { subject: 'S&A LAB', teacher: 'KG', isLab: true, room: '204' },  // 09:45 - 10:45
    { subject: 'S&A LAB', teacher: 'KG', isLab: true, room: '204' },  // 10:45 - 11:45
    { subject: 'P&S',  teacher: 'RK' },       // 11:45 - 12:45
    { subject: 'S&A',  teacher: 'KG' },       // 01:45 - 02:45
    { subject: 'S&A',  teacher: 'KG' },       // 02:45 - 03:45
    { subject: 'OOPJ', teacher: 'IG' },       // 03:45 - 04:45
  ],
  // THURSDAY
  4: [
    { subject: 'DS',   teacher: 'YP' },       // 09:45 - 10:45
    { subject: 'ECS',  teacher: 'PJ' },       // 10:45 - 11:45
    { subject: 'COI',  teacher: 'SB' },       // 11:45 - 12:45
    { subject: 'COI',  teacher: 'SB' },       // 01:45 - 02:45
    { subject: 'P&S',  teacher: 'RK' },       // 02:45 - 03:45
    { subject: 'OOPJ', teacher: 'IG' },       // 03:45 - 04:45
  ],
  // FRIDAY
  5: [
    { subject: 'COI',  teacher: 'SB' },       // 09:45 - 10:45
    { subject: 'ECS',  teacher: 'PJ' },       // 10:45 - 11:45
    { subject: 'OOPJ', teacher: 'IG' },       // 11:45 - 12:45
    { subject: 'COI',  teacher: 'SB' },       // 01:45 - 02:45
    { subject: 'P&S',  teacher: 'RK' },       // 02:45 - 03:45
    { subject: 'DS',   teacher: 'YP' },       // 03:45 - 04:45
  ],
  // SATURDAY (only 1st, 3rd, 5th Saturdays)
  6: [
    { subject: 'ECS',  teacher: 'PJ' },       // 09:45 - 10:45
    { subject: 'ECS',  teacher: 'PJ' },       // 10:45 - 11:45
    { subject: 'CEP',  teacher: 'JG' },       // 11:45 - 12:45
    { subject: null, label: 'Library' },       // 01:45 - 02:45
    { subject: null, label: 'Sports' },        // 02:45 - 03:45
    { subject: null, label: 'Sports' },        // 03:45 - 04:45
  ],
};

// Days of the week (0 = Sunday, 6 = Saturday)
export const WORKING_DAYS = [
  { id: 1, name: 'Monday',    short: 'Mon' },
  { id: 2, name: 'Tuesday',   short: 'Tue' },
  { id: 3, name: 'Wednesday', short: 'Wed' },
  { id: 4, name: 'Thursday',  short: 'Thu' },
  { id: 5, name: 'Friday',    short: 'Fri' },
  { id: 6, name: 'Saturday',  short: 'Sat' },
];

/**
 * Check if a given date is a 2nd or 4th Saturday (holiday)
 */
export function isHolidaySaturday(date) {
  if (date.getDay() !== 6) return false;
  const dayOfMonth = date.getDate();
  const weekNumber = Math.ceil(dayOfMonth / 7);
  return weekNumber === 2 || weekNumber === 4;
}

/**
 * Check if a given date is a working day
 */
export function isWorkingDay(date) {
  const day = date.getDay();
  if (day === 0) return false;
  if (isHolidaySaturday(date)) return false;
  return true;
}

/**
 * Get the current lecture info for CSE based on day & time
 * Returns { slot, entry } or null
 */
export function getCurrentLecture(now = new Date()) {
  const day = now.getDay();
  if (day === 0 || !CSE_TIMETABLE[day]) return null;
  if (isHolidaySaturday(now)) return null;

  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  
  for (let i = 0; i < TIME_SLOTS.length; i++) {
    const slot = TIME_SLOTS[i];
    const slotStart = slot.startH * 60 + slot.startM;
    const slotEnd = slot.endH * 60 + slot.endM;
    
    if (currentMinutes >= slotStart && currentMinutes < slotEnd) {
      return { slot, entry: CSE_TIMETABLE[day][i] };
    }
  }
  
  return null;
}

/**
 * Get the next upcoming lecture for CSE
 * Returns { slot, entry } or null
 */
export function getNextLecture(now = new Date()) {
  const day = now.getDay();
  if (day === 0 || !CSE_TIMETABLE[day]) return null;
  if (isHolidaySaturday(now)) return null;

  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  
  for (let i = 0; i < TIME_SLOTS.length; i++) {
    const slot = TIME_SLOTS[i];
    const slotStart = slot.startH * 60 + slot.startM;
    
    if (currentMinutes < slotStart) {
      const entry = CSE_TIMETABLE[day][i];
      if (entry && entry.subject) return { slot, entry };
    }
  }
  
  return null;
}

/**
 * Get the current or next lecture slot (for auto-detection)
 */
export function getAutoDetectedSlot(now = new Date()) {
  const current = getCurrentLecture(now);
  if (current && current.entry.subject) return current;
  
  const next = getNextLecture(now);
  if (next) return next;
  
  // Default to slot 1
  const day = now.getDay();
  if (day > 0 && day <= 6 && CSE_TIMETABLE[day]) {
    return { slot: TIME_SLOTS[0], entry: CSE_TIMETABLE[day][0] };
  }
  
  return { slot: TIME_SLOTS[0], entry: CSE_TIMETABLE[1][0] };
}

/**
 * Get subject full name from code
 */
export function getSubjectName(code) {
  if (!code) return null;
  const sub = CSE_SUBJECTS.find(s => s.code === code);
  if (sub) return sub.name;
  const lab = CSE_LABS.find(l => l.code === code);
  if (lab) return lab.name;
  return code;
}

/**
 * Format time from 24h to 12h with AM/PM
 */
export function formatTime12h(h, m) {
  const period = h < 12 ? 'AM' : 'PM';
  const hour12 = h % 12 || 12;
  return `${hour12}:${String(m).padStart(2, '0')} ${period}`;
}

/**
 * Get formatted time slot string
 */
export function formatSlotRange(slot) {
  return `${formatTime12h(slot.startH, slot.startM)} - ${formatTime12h(slot.endH, slot.endM)}`;
}
