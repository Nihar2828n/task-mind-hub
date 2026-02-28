import { Task, MoodEntry, UserSettings } from './types';

const TASKS_KEY = 'dayflow_tasks';
const MOODS_KEY = 'dayflow_moods';
const SETTINGS_KEY = 'dayflow_settings';

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
};

export function loadTasks(): Task[] {
  try {
    const raw = localStorage.getItem(TASKS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

export function saveTasks(tasks: Task[]) {
  localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
}

export function loadMoods(): MoodEntry[] {
  try {
    const raw = localStorage.getItem(MOODS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

export function saveMoods(moods: MoodEntry[]) {
  localStorage.setItem(MOODS_KEY, JSON.stringify(moods));
}

export function loadSettings(): UserSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    return raw ? { ...defaultSettings, ...JSON.parse(raw) } : defaultSettings;
  } catch { return defaultSettings; }
}

export function saveSettings(settings: UserSettings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}
