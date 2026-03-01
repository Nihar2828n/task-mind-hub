export interface RoutineBlock {
  id: string;
  title: string;
  startTime: string; // HH:mm
  endTime: string;   // HH:mm
  emoji?: string;
}

export const FIXED_ROUTINE: RoutineBlock[] = [
  { id: 'r1', title: 'Wake up, freshen up', startTime: '06:00', endTime: '06:30' },
  { id: 'r2', title: 'Music', startTime: '06:30', endTime: '06:45', emoji: '🎵' },
  { id: 'r3', title: 'School', startTime: '06:45', endTime: '13:00', emoji: '🏫' },
  { id: 'r4', title: 'Lunch', startTime: '13:00', endTime: '13:30', emoji: '🍽️' },
  { id: 'r5', title: 'Revise what you covered in school', startTime: '13:30', endTime: '14:00', emoji: '📝' },
  { id: 'r6', title: 'Homework', startTime: '14:00', endTime: '15:00', emoji: '📓' },
  { id: 'r7', title: '𝕏 time', startTime: '15:00', endTime: '15:15' },
  { id: 'r8', title: 'Get ready, travel to tuition', startTime: '15:15', endTime: '15:30' },
  { id: 'r9', title: 'Travel', startTime: '15:30', endTime: '16:00' },
  { id: 'r10', title: 'Tuition', startTime: '16:00', endTime: '18:00', emoji: '🏫' },
  { id: 'r11', title: 'Travel back home', startTime: '18:00', endTime: '18:15' },
  { id: 'r12', title: 'Freshen up, eat something light', startTime: '18:15', endTime: '18:30' },
  { id: 'r13', title: 'Study Block (night)', startTime: '18:30', endTime: '21:00', emoji: '📚' },
  { id: 'r14', title: 'Revise everything studied tonight', startTime: '21:00', endTime: '21:30', emoji: '📝' },
  { id: 'r15', title: 'Instagram', startTime: '21:30', endTime: '21:45', emoji: '📸' },
  { id: 'r16', title: '𝕏 time', startTime: '21:45', endTime: '22:00' },
  { id: 'r17', title: 'Music', startTime: '22:00', endTime: '22:30', emoji: '🎵' },
  { id: 'r18', title: 'Sleep', startTime: '22:30', endTime: '23:59', emoji: '😴' },
];

/** Convert HH:mm to minutes since midnight */
export function timeToMinutes(t: string): number {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
}

/** Get all busy minute-ranges from the fixed routine */
export function getRoutineBusySlots(): { start: number; end: number }[] {
  return FIXED_ROUTINE.map(r => ({
    start: timeToMinutes(r.startTime),
    end: timeToMinutes(r.endTime),
  }));
}
