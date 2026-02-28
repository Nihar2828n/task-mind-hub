import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Task, MoodEntry, UserSettings } from '@/lib/types';
import { loadTasks, saveTasks, loadMoods, saveMoods, loadSettings, saveSettings, defaultSettings } from '@/lib/store';

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
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>(loadTasks);
  const [moods, setMoods] = useState<MoodEntry[]>(loadMoods);
  const [settings, setSettings] = useState<UserSettings>(loadSettings);

  useEffect(() => saveTasks(tasks), [tasks]);
  useEffect(() => saveMoods(moods), [moods]);
  useEffect(() => saveSettings(settings), [settings]);

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

  return (
    <AppContext.Provider value={{ tasks, setTasks, addTask, toggleTask, deleteTask, moods, addMood, settings, updateSettings, todayTasks }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
