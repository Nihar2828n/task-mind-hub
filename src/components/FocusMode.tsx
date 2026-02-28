import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { X, Play, Pause, RotateCcw, Check } from 'lucide-react';
import { Task } from '@/lib/types';
import { useApp } from '@/context/AppContext';

export default function FocusMode({ task, onClose }: { task: Task; onClose: () => void }) {
  const { settings, toggleTask } = useApp();
  const [seconds, setSeconds] = useState(settings.pomodoroWork * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);

  const totalSeconds = (isBreak ? settings.pomodoroBreak : settings.pomodoroWork) * 60;
  const progress = ((totalSeconds - seconds) / totalSeconds) * 100;

  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      setSeconds(prev => {
        if (prev <= 1) {
          setIsRunning(false);
          if (!isBreak) {
            setIsBreak(true);
            return settings.pomodoroBreak * 60;
          } else {
            setIsBreak(false);
            return settings.pomodoroWork * 60;
          }
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isRunning, isBreak, settings]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  };

  const reset = () => {
    setIsRunning(false);
    setSeconds((isBreak ? settings.pomodoroBreak : settings.pomodoroWork) * 60);
  };

  const handleComplete = () => {
    if (!task.completed) toggleTask(task.id);
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-background flex flex-col items-center justify-center p-6"
    >
      <button onClick={onClose} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
        <X size={24} />
      </button>

      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        className="text-center space-y-6"
      >
        <div>
          <p className="text-xs font-medium text-accent uppercase tracking-wider">
            {isBreak ? 'Break Time' : 'Focus Mode'}
          </p>
          <h2 className="text-lg font-bold text-foreground mt-2">{task.title}</h2>
        </div>

        {/* Timer Ring */}
        <div className="relative inline-flex items-center justify-center">
          <svg width={200} height={200} className="-rotate-90">
            <circle cx={100} cy={100} r={90} fill="none" stroke="hsl(var(--muted))" strokeWidth={6} />
            <motion.circle
              cx={100} cy={100} r={90} fill="none"
              stroke={isBreak ? 'hsl(var(--success))' : 'hsl(var(--primary))'}
              strokeWidth={6} strokeLinecap="round"
              strokeDasharray={565}
              animate={{ strokeDashoffset: 565 - (progress / 100) * 565 }}
              transition={{ duration: 0.5 }}
            />
          </svg>
          <span className="absolute text-4xl font-bold text-foreground font-mono">
            {formatTime(seconds)}
          </span>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4">
          <button onClick={reset} className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
            <RotateCcw size={20} className="text-muted-foreground" />
          </button>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsRunning(!isRunning)}
            className="w-16 h-16 rounded-full bg-primary flex items-center justify-center"
          >
            {isRunning ?
              <Pause size={28} className="text-primary-foreground" /> :
              <Play size={28} className="text-primary-foreground ml-1" />
            }
          </motion.button>
          <button onClick={handleComplete} className="w-12 h-12 rounded-full bg-success flex items-center justify-center">
            <Check size={20} className="text-success-foreground" />
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
