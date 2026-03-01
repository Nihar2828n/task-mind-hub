import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Clock, Timer, X } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Task, TaskCategory, Priority, CATEGORY_CONFIG } from '@/lib/types';
import TaskCard from '@/components/TaskCard';
import FocusMode from '@/components/FocusMode';
import { getRoutineBusySlots, timeToMinutes } from '@/lib/routine';

const categories: TaskCategory[] = ['work', 'personal', 'health', 'learning', 'errands', 'social'];
const priorities: Priority[] = ['low', 'medium', 'high'];

export default function Scheduler() {
  const { todayTasks, addTask } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [focusTask, setFocusTask] = useState<Task | null>(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<TaskCategory>('work');
  const [priority, setPriority] = useState<Priority>('medium');
  const [duration, setDuration] = useState(30);
  const [time, setTime] = useState('09:00');
  const [notes, setNotes] = useState('');

  const handleAdd = () => {
    if (!title.trim()) return;
    const task: Task = {
      id: crypto.randomUUID(),
      title: title.trim(),
      category,
      priority,
      duration,
      scheduledTime: time,
      scheduledDate: new Date().toISOString().split('T')[0],
      completed: false,
      notes: notes || undefined,
      createdAt: new Date().toISOString(),
    };
    addTask(task);
    setTitle('');
    setNotes('');
    setShowForm(false);
  };

  // Smart slot finder — respects both user tasks AND fixed routine
  const findNextSlot = (): string => {
    const routineSlots = getRoutineBusySlots();
    const taskSlots = todayTasks.map(t => {
      const [h, m] = t.scheduledTime.split(':').map(Number);
      return { start: h * 60 + m, end: h * 60 + m + t.duration };
    });
    const allBusy = [...routineSlots, ...taskSlots].sort((a, b) => a.start - b.start);

    let cursor = 6 * 60; // start at 6am
    for (const slot of allBusy) {
      if (cursor + duration <= slot.start) break;
      cursor = Math.max(cursor, slot.end);
    }
    if (cursor + duration > 23 * 60 + 59) cursor = 23 * 60;
    const h = Math.floor(cursor / 60);
    const m = cursor % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  };

  return (
    <div className="px-4 pt-2 pb-24 max-w-lg mx-auto space-y-5">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-foreground">Planner</h1>
        <p className="text-sm text-muted-foreground">Schedule and manage your day</p>
      </motion.div>

      {/* Add Task Button */}
      {!showForm && (
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => { setTime(findNextSlot()); setShowForm(true); }}
          className="w-full glass-card p-4 flex items-center gap-3 text-left hover:bg-muted/30 transition-colors"
        >
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Plus size={20} className="text-primary" />
          </div>
          <div>
            <p className="font-semibold text-sm text-foreground">Add New Task</p>
            <p className="text-xs text-muted-foreground">Smart scheduling finds the best free slot</p>
          </div>
        </motion.button>
      )}

      {/* Task Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="glass-card-elevated p-5 space-y-4 overflow-hidden"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-foreground">New Task</h3>
              <button onClick={() => setShowForm(false)} className="text-muted-foreground"><X size={18} /></button>
            </div>
            <input autoFocus value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Task name" className="w-full bg-muted rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/30" />
            <div>
              <label className="text-xs text-muted-foreground mb-1.5 block">Category</label>
              <div className="flex flex-wrap gap-2">
                {categories.map((c) => {
                  const conf = CATEGORY_CONFIG[c];
                  return (
                    <button key={c} onClick={() => setCategory(c)} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${category === c ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                      {conf.emoji} {conf.label}
                    </button>
                  );
                })}
              </div>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1.5 block">Priority</label>
              <div className="flex gap-2">
                {priorities.map((p) => (
                  <button key={p} onClick={() => setPriority(p)} className={`flex-1 py-2 rounded-xl text-xs font-medium transition-all ${priority === p ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                    {p.charAt(0).toUpperCase() + p.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="text-xs text-muted-foreground mb-1.5 flex items-center gap-1"><Clock size={12} /> Time</label>
                <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="w-full bg-muted rounded-xl px-4 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
              <div className="flex-1">
                <label className="text-xs text-muted-foreground mb-1.5 flex items-center gap-1"><Timer size={12} /> Duration</label>
                <select value={duration} onChange={(e) => setDuration(Number(e.target.value))} className="w-full bg-muted rounded-xl px-4 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/30">
                  {[15, 30, 45, 60, 90, 120].map((d) => (<option key={d} value={d}>{d} min</option>))}
                </select>
              </div>
            </div>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Notes (optional)" rows={2} className="w-full bg-muted rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/30 resize-none" />
            <button onClick={handleAdd} disabled={!title.trim()} className="w-full bg-primary text-primary-foreground rounded-xl py-3 font-semibold text-sm disabled:opacity-40 transition-opacity">
              Schedule Task
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Timeline */}
      <div>
        <h2 className="text-sm font-semibold text-foreground mb-3">Today's Schedule</h2>
        {todayTasks.length === 0 ? (
          <div className="glass-card p-8 text-center">
            <p className="text-muted-foreground text-sm">No tasks scheduled yet</p>
          </div>
        ) : (
          <div className="space-y-2">
            {todayTasks.map((task, i) => (
              <div key={task.id} onClick={() => setFocusTask(task)} className="cursor-pointer">
                <TaskCard task={task} index={i} />
              </div>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {focusTask && <FocusMode task={focusTask} onClose={() => setFocusTask(null)} />}
      </AnimatePresence>
    </div>
  );
}
