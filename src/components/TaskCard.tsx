import { motion, AnimatePresence } from 'framer-motion';
import { Check, Trash2, Clock } from 'lucide-react';
import { Task, CATEGORY_CONFIG, PRIORITY_CONFIG } from '@/lib/types';
import { useApp } from '@/context/AppContext';
import { useState } from 'react';

interface TaskCardProps {
  task: Task;
  index?: number;
}

export default function TaskCard({ task, index = 0 }: TaskCardProps) {
  const { toggleTask, deleteTask } = useApp();
  const [showConfetti, setShowConfetti] = useState(false);
  const cat = CATEGORY_CONFIG[task.category];
  const pri = PRIORITY_CONFIG[task.priority];

  const handleToggle = () => {
    if (!task.completed) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 600);
    }
    toggleTask(task.id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className={`glass-card p-4 flex items-start gap-3 group ${task.completed ? 'opacity-60' : ''}`}
    >
      <button
        onClick={handleToggle}
        className={`mt-0.5 w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
          task.completed
            ? 'bg-success border-success'
            : 'border-muted-foreground/30 hover:border-primary'
        }`}
      >
        <AnimatePresence>
          {task.completed && (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="animate-check-pop">
              <Check size={14} className="text-success-foreground" />
            </motion.div>
          )}
        </AnimatePresence>
        {showConfetti && (
          <motion.div
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 3, opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute w-6 h-6 rounded-full bg-success/30"
          />
        )}
      </button>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <div className={`w-2 h-2 rounded-full ${cat.className}`} />
          <span className="text-xs text-muted-foreground">{cat.label}</span>
          <span className={`text-xs font-medium ${pri.color}`}>{pri.label}</span>
        </div>
        <p className={`font-semibold text-sm ${task.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
          {task.title}
        </p>
        <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
          <Clock size={12} />
          <span>{task.scheduledTime}</span>
          <span>·</span>
          <span>{task.duration}min</span>
        </div>
      </div>

      <button
        onClick={() => deleteTask(task.id)}
        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-muted-foreground hover:text-destructive"
      >
        <Trash2 size={16} />
      </button>
    </motion.div>
  );
}
