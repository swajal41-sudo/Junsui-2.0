/**
 * Junsui Timetable Configuration
 * 
 * Time Slots: 6 lectures per day with 1 hour lunch break
 * Holidays: 2nd and 4th Saturdays
 * 
 * This file stores the master timetable structure.
 * Actual subject mapping per branch will be added later.
 */

// Lecture time slots (24h format for internal use)
export const TIME_SLOTS = [
  { id: 1, label: 'Lecture 1', start: '09:45', end: '10:45', startH: 9,  startM: 45, endH: 10, endM: 45 },
  { id: 2, label: 'Lecture 2', start: '10:45', end: '11:45', startH: 10, startM: 45, endH: 11, endM: 45 },
  { id: 3, label: 'Lecture 3', start: '11:45', end: '12:45', startH: 11, startM: 45, endH: 12, endM: 45 },
  // Lunch: 12:45 - 1:45
  { id: 4, label: 'Lecture 4', start: '13:45', end: '14:45', startH: 13, startM: 45, endH: 14, endM: 45 },
  { id: 5, label: 'Lecture 5', start: '14:45', end: '15:45', startH: 14, startM: 45, endH: 15, endM: 45 },
  { id: 6, label: 'Lecture 6', start: '15:45', end: '16:45', startH: 15, startM: 45, endH: 16, endM: 45 },
];

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
 * @param {Date} date - The date to check
 * @returns {boolean} true if it's a 2nd or 4th Saturday
 */
export function isHolidaySaturday(date) {
  if (date.getDay() !== 6) return false; // Not a Saturday
  
  const dayOfMonth = date.getDate();
  const weekNumber = Math.ceil(dayOfMonth / 7);
  
  return weekNumber === 2 || weekNumber === 4;
}

/**
 * Check if a given date is a working day
 * @param {Date} date - The date to check
 * @returns {boolean} true if it's a working day
 */
export function isWorkingDay(date) {
  const day = date.getDay();
  
  // Sunday is always a holiday
  if (day === 0) return false;
  
  // 2nd and 4th Saturdays are holidays
  if (isHolidaySaturday(date)) return false;
  
  return true;
}

/**
 * Get the current lecture slot based on time
 * @param {Date} [now] - The time to check (defaults to current time)
 * @returns {object|null} The current time slot or null if not in any lecture
 */
export function getCurrentSlot(now = new Date()) {
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  
  for (const slot of TIME_SLOTS) {
    const slotStart = slot.startH * 60 + slot.startM;
    const slotEnd = slot.endH * 60 + slot.endM;
    
    if (currentMinutes >= slotStart && currentMinutes < slotEnd) {
      return slot;
    }
  }
  
  return null;
}

/**
 * Get the next upcoming lecture slot
 * @param {Date} [now] - The time to check (defaults to current time)
 * @returns {object|null} The next time slot or null if no more lectures today
 */
export function getNextSlot(now = new Date()) {
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  
  for (const slot of TIME_SLOTS) {
    const slotStart = slot.startH * 60 + slot.startM;
    
    if (currentMinutes < slotStart) {
      return slot;
    }
  }
  
  return null;
}

/**
 * Format time from 24h to 12h with AM/PM
 * @param {number} h - Hour (0-23)
 * @param {number} m - Minute (0-59)
 * @returns {string} Formatted time like "9:45 AM"
 */
export function formatTime12h(h, m) {
  const period = h < 12 ? 'AM' : 'PM';
  const hour12 = h % 12 || 12;
  return `${hour12}:${String(m).padStart(2, '0')} ${period}`;
}

/**
 * Get formatted time slot string
 * @param {object} slot - A slot from TIME_SLOTS
 * @returns {string} Like "9:45 AM - 10:45 AM"
 */
export function formatSlotRange(slot) {
  return `${formatTime12h(slot.startH, slot.startM)} - ${formatTime12h(slot.endH, slot.endM)}`;
}
