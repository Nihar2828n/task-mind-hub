export type TaskCategory = 'work' | 'personal' | 'health' | 'learning' | 'errands' | 'social';
export type Priority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  category: TaskCategory;
  priority: Priority;
  duration: number; // minutes
  scheduledTime: string; // HH:mm
  scheduledDate: string; // YYYY-MM-DD
  completed: boolean;
  notes?: string;
  subtasks?: { id: string; title: string; completed: boolean }[];
  createdAt: string;
}

export interface MoodEntry {
  date: string;
  mood: number; // 1-5
  timestamp: string;
}

export interface UserSettings {
  name: string;
  accentColor: string;
  darkMode: boolean;
  dailyGoal: number;
  pomodoroWork: number;
  pomodoroBreak: number;
  wakeTime: string;
  sleepTime: string;
  onboarded: boolean;
}

export const CATEGORY_CONFIG: Record<TaskCategory, { label: string; emoji: string; className: string }> = {
  work: { label: 'Work', emoji: '🔵', className: 'category-work' },
  personal: { label: 'Personal', emoji: '🟢', className: 'category-personal' },
  health: { label: 'Health', emoji: '🔴', className: 'category-health' },
  learning: { label: 'Learning', emoji: '🟣', className: 'category-learning' },
  errands: { label: 'Errands', emoji: '🟡', className: 'category-errands' },
  social: { label: 'Social', emoji: '🟠', className: 'category-social' },
};

export const PRIORITY_CONFIG: Record<Priority, { label: string; color: string }> = {
  low: { label: 'Low', color: 'text-muted-foreground' },
  medium: { label: 'Medium', color: 'text-accent' },
  high: { label: 'High', color: 'text-destructive' },
};
