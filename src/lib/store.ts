import { Task, MoodEntry, UserSettings } from './types';

const CURRENT_USER_KEY = 'dayflow_current_user';

function userKey(base: string): string {
  const user = getCurrentUser();
  return user ? `dayflow_${user}_${base}` : `dayflow_${base}`;
}

export function getCurrentUser(): string | null {
  return localStorage.getItem(CURRENT_USER_KEY);
}

export function setCurrentUser(name: string) {
  localStorage.setItem(CURRENT_USER_KEY, name);
}

export function clearCurrentUser() {
  localStorage.removeItem(CURRENT_USER_KEY);
}

export const defaultSettings: UserSettings = {
  name: '',
  accentColor: 'indigo',
  darkMode: false,
  dailyGoal: 8,
  pomodoroWork: 25,
  pomodoroBreak: 5,
  wakeTime: '07:00',
  sleepTime: '23:00',
  onboarded: false,
  showFixedRoutine: true,
};

export function loadTasks(): Task[] {
  try {
    const raw = localStorage.getItem(userKey('tasks'));
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

export function saveTasks(tasks: Task[]) {
  localStorage.setItem(userKey('tasks'), JSON.stringify(tasks));
}

export function loadMoods(): MoodEntry[] {
  try {
    const raw = localStorage.getItem(userKey('moods'));
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

export function saveMoods(moods: MoodEntry[]) {
  localStorage.setItem(userKey('moods'), JSON.stringify(moods));
}

export function loadSettings(): UserSettings {
  try {
    const raw = localStorage.getItem(userKey('settings'));
    return raw ? { ...defaultSettings, ...JSON.parse(raw) } : defaultSettings;
  } catch { return defaultSettings; }
}

export function saveSettings(settings: UserSettings) {
  localStorage.setItem(userKey('settings'), JSON.stringify(settings));
}
