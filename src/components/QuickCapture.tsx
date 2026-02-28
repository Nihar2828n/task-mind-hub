import { useState } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Task, TaskCategory } from '@/lib/types';

export default function QuickCapture({ onClose }: { onClose: () => void }) {
  const { addTask } = useApp();
  const [title, setTitle] = useState('');

  const handleSubmit = () => {
    if (!title.trim()) return;
    const now = new Date();
    const task: Task = {
      id: crypto.randomUUID(),
      title: title.trim(),
      category: 'personal' as TaskCategory,
      priority: 'medium',
      duration: 30,
      scheduledTime: `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`,
      scheduledDate: now.toISOString().split('T')[0],
      completed: false,
      createdAt: now.toISOString(),
    };
    addTask(task);
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/20 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg glass-card-elevated rounded-b-none p-6 space-y-4"
      >
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-foreground">Quick Capture</h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X size={20} />
          </button>
        </div>
        <input
          autoFocus
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          placeholder="What do you need to do?"
          className="w-full bg-muted rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/30"
        />
        <button
          onClick={handleSubmit}
          disabled={!title.trim()}
          className="w-full bg-primary text-primary-foreground rounded-xl py-3 font-semibold text-sm disabled:opacity-40 transition-opacity"
        >
          Add Task
        </button>
      </motion.div>
    </motion.div>
  );
}
