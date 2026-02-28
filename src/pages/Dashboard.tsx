import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { Plus, Sparkles, Smile } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import ProgressRing from '@/components/ProgressRing';
import TaskCard from '@/components/TaskCard';
import { getDailyQuote } from '@/lib/quotes';
import QuickCapture from '@/components/QuickCapture';
import MoodCheckin from '@/components/MoodCheckin';

const moodEmojis = ['😫', '😕', '😐', '🙂', '🤩'];

function getGreeting(): { text: string; emoji: string } {
  const h = new Date().getHours();
  if (h < 12) return { text: 'Good Morning', emoji: '☀️' };
  if (h < 17) return { text: 'Good Afternoon', emoji: '⚡' };
  return { text: 'Good Evening', emoji: '🌙' };
}

export default function Dashboard() {
  const { settings, todayTasks, moods } = useApp();
  const [showCapture, setShowCapture] = useState(false);
  const [showMood, setShowMood] = useState(false);

  const greeting = getGreeting();
  const quote = getDailyQuote();
  const completed = todayTasks.filter(t => t.completed).length;
  const total = todayTasks.length;
  const progress = total > 0 ? (completed / total) * 100 : 0;
  const todayMood = moods.find(m => m.date === new Date().toISOString().split('T')[0]);

  // Calculate streak
  const streak = (() => {
    let count = 0;
    const today = new Date();
    for (let i = 1; i <= 365; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dayTasks = todayTasks.length > 0 ? [] : []; // simplified
      // For now just show 0 streak until we have history
      break;
    }
    return count;
  })();

  const priorityTasks = todayTasks
    .filter(t => !t.completed)
    .sort((a, b) => {
      const p = { high: 0, medium: 1, low: 2 };
      return p[a.priority] - p[b.priority];
    })
    .slice(0, 3);

  return (
    <div className="px-4 pt-2 pb-24 max-w-lg mx-auto space-y-5">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="pt-2"
      >
        <h1 className="text-2xl font-bold text-foreground">
          {greeting.text} {greeting.emoji}
          {settings.name && <span className="block text-primary">{settings.name}</span>}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {format(new Date(), 'EEEE, MMMM d, yyyy')}
        </p>
      </motion.div>

      {/* Quote */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-4"
      >
        <div className="flex items-start gap-2">
          <Sparkles size={16} className="text-accent mt-0.5 shrink-0" />
          <div>
            <p className="text-sm italic text-foreground">"{quote.text}"</p>
            <p className="text-xs text-muted-foreground mt-1">— {quote.author}</p>
          </div>
        </div>
      </motion.div>

      {/* Progress + Stats Row */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex items-center gap-4"
      >
        <ProgressRing progress={progress} size={100} strokeWidth={7} />
        <div className="flex-1 space-y-2">
          <div className="glass-card p-3 flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Today's Tasks</span>
            <span className="text-sm font-bold text-foreground">{completed}/{total}</span>
          </div>
          <div className="glass-card p-3 flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Daily Goal</span>
            <span className="text-sm font-bold text-foreground">{total}/{settings.dailyGoal}</span>
          </div>
          <button
            onClick={() => setShowMood(true)}
            className="glass-card p-3 flex items-center justify-between w-full hover:bg-muted/50 transition-colors"
          >
            <span className="text-xs text-muted-foreground">Mood</span>
            <span className="text-lg">
              {todayMood ? moodEmojis[todayMood.mood - 1] : <Smile size={18} className="text-muted-foreground" />}
            </span>
          </button>
        </div>
      </motion.div>

      {/* Priority Tasks */}
      {priorityTasks.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-sm font-semibold text-foreground mb-2">Priority Tasks</h2>
          <div className="space-y-2">
            <AnimatePresence>
              {priorityTasks.map((task, i) => (
                <TaskCard key={task.id} task={task} index={i} />
              ))}
            </AnimatePresence>
          </div>
        </motion.div>
      )}

      {/* All Today's Tasks */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h2 className="text-sm font-semibold text-foreground mb-2">
          {todayTasks.length > 0 ? 'All Tasks Today' : 'No tasks today'}
        </h2>
        {todayTasks.length === 0 && (
          <div className="glass-card p-8 text-center">
            <p className="text-muted-foreground text-sm">Tap + to add your first task</p>
          </div>
        )}
        <div className="space-y-2">
          <AnimatePresence>
            {todayTasks.map((task, i) => (
              <TaskCard key={task.id} task={task} index={i} />
            ))}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* FAB */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        whileHover={{ scale: 1.05 }}
        onClick={() => setShowCapture(true)}
        className="fixed bottom-20 right-4 z-40 w-14 h-14 rounded-full bg-primary flex items-center justify-center shadow-lg"
      >
        <Plus size={24} className="text-primary-foreground" />
      </motion.button>

      {/* Modals */}
      <AnimatePresence>
        {showCapture && <QuickCapture onClose={() => setShowCapture(false)} />}
        {showMood && <MoodCheckin onClose={() => setShowMood(false)} />}
      </AnimatePresence>
    </div>
  );
}
