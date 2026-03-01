import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Task, MoodEntry, UserSettings } from '@/lib/types';
import { loadTasks, saveTasks, loadMoods, saveMoods, loadSettings, saveSettings, defaultSettings, getCurrentUser, setCurrentUser, clearCurrentUser } from '@/lib/store';

interface AppContextType {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  addTask: (task: Task) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  moods: MoodEntry[];
  addMood: (mood: number) => void;
  settings: UserSettings;
  updateSettings: (s: Partial<UserSettings>) => void;
  todayTasks: Task[];
  currentUser: string | null;
  switchUser: () => void;
  loginUser: (name: string) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUserState] = useState<string | null>(getCurrentUser);
  const [tasks, setTasks] = useState<Task[]>(() => currentUser ? loadTasks() : []);
  const [moods, setMoods] = useState<MoodEntry[]>(() => currentUser ? loadMoods() : []);
  const [settings, setSettings] = useState<UserSettings>(() => currentUser ? loadSettings() : defaultSettings);

  useEffect(() => { if (currentUser) saveTasks(tasks); }, [tasks, currentUser]);
  useEffect(() => { if (currentUser) saveMoods(moods); }, [moods, currentUser]);
  useEffect(() => { if (currentUser) saveSettings(settings); }, [settings, currentUser]);

  useEffect(() => {
    if (settings.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.darkMode]);

  const today = new Date().toISOString().split('T')[0];
  const todayTasks = tasks.filter(t => t.scheduledDate === today).sort((a, b) => a.scheduledTime.localeCompare(b.scheduledTime));

  const addTask = useCallback((task: Task) => {
    setTasks(prev => [...prev, task]);
  }, []);

  const toggleTask = useCallback((id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  }, []);

  const addMood = useCallback((mood: number) => {
    const entry: MoodEntry = { date: today, mood, timestamp: new Date().toISOString() };
    setMoods(prev => {
      const filtered = prev.filter(m => m.date !== today);
      return [...filtered, entry];
    });
  }, [today]);

  const updateSettings = useCallback((s: Partial<UserSettings>) => {
    setSettings(prev => ({ ...prev, ...s }));
  }, []);

  const loginUser = useCallback((name: string) => {
    setCurrentUser(name);
    setCurrentUserState(name);
    // Load this user's data
    setTasks(loadTasks());
    setMoods(loadMoods());
    const s = loadSettings();
    setSettings({ ...s, name, onboarded: true });
    saveSettings({ ...s, name, onboarded: true });
  }, []);

  const switchUser = useCallback(() => {
    clearCurrentUser();
    setCurrentUserState(null);
    setTasks([]);
    setMoods([]);
    setSettings(defaultSettings);
  }, []);

  return (
    <AppContext.Provider value={{ tasks, setTasks, addTask, toggleTask, deleteTask, moods, addMood, settings, updateSettings, todayTasks, currentUser, switchUser, loginUser }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
