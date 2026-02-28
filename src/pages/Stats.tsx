import { motion } from 'framer-motion';
import { useApp } from '@/context/AppContext';
import { CATEGORY_CONFIG, TaskCategory } from '@/lib/types';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { format, subDays } from 'date-fns';

const COLORS = ['hsl(225,75%,58%)', 'hsl(150,60%,45%)', 'hsl(0,72%,55%)', 'hsl(270,60%,55%)', 'hsl(45,90%,50%)', 'hsl(25,85%,55%)'];

export default function Stats() {
  const { tasks, moods } = useApp();

  // Last 7 days data
  const weekData = Array.from({ length: 7 }, (_, i) => {
    const d = subDays(new Date(), 6 - i);
    const dateStr = d.toISOString().split('T')[0];
    const dayTasks = tasks.filter(t => t.scheduledDate === dateStr);
    return {
      day: format(d, 'EEE'),
      completed: dayTasks.filter(t => t.completed).length,
      total: dayTasks.length,
    };
  });

  // Category breakdown
  const categoryData = (Object.keys(CATEGORY_CONFIG) as TaskCategory[]).map((cat) => {
    const catTasks = tasks.filter(t => t.category === cat);
    const totalMin = catTasks.reduce((s, t) => s + t.duration, 0);
    return { name: CATEGORY_CONFIG[cat].label, value: totalMin, emoji: CATEGORY_CONFIG[cat].emoji };
  }).filter(d => d.value > 0);

  const totalCompleted = tasks.filter(t => t.completed).length;
  const totalFocusMin = tasks.filter(t => t.completed).reduce((s, t) => s + t.duration, 0);

  // Mood data last 7 days
  const moodData = Array.from({ length: 7 }, (_, i) => {
    const d = subDays(new Date(), 6 - i);
    const dateStr = d.toISOString().split('T')[0];
    const entry = moods.find(m => m.date === dateStr);
    return { day: format(d, 'EEE'), mood: entry?.mood || 0 };
  });

  const moodEmojis = ['', '😫', '😕', '😐', '🙂', '🤩'];

  return (
    <div className="px-4 pt-2 pb-24 max-w-lg mx-auto space-y-5">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-foreground">Stats & Insights</h1>
        <p className="text-sm text-muted-foreground">Your productivity at a glance</p>
      </motion.div>

      {/* Summary Cards */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 gap-3"
      >
        <div className="glass-card p-4 text-center">
          <p className="text-3xl font-bold text-primary">{totalCompleted}</p>
          <p className="text-xs text-muted-foreground mt-1">Tasks Completed</p>
        </div>
        <div className="glass-card p-4 text-center">
          <p className="text-3xl font-bold text-accent">{Math.round(totalFocusMin / 60)}h</p>
          <p className="text-xs text-muted-foreground mt-1">Focus Time</p>
        </div>
      </motion.div>

      {/* Weekly Chart */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card p-4"
      >
        <h3 className="text-sm font-semibold text-foreground mb-3">This Week</h3>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={weekData}>
            <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'hsl(225,10%,45%)' }} />
            <YAxis hide />
            <Bar dataKey="completed" radius={[6, 6, 0, 0]} fill="hsl(var(--primary))" />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Category Breakdown */}
      {categoryData.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-4"
        >
          <h3 className="text-sm font-semibold text-foreground mb-3">Time by Category</h3>
          <div className="flex items-center gap-4">
            <ResponsiveContainer width={120} height={120}>
              <PieChart>
                <Pie data={categoryData} dataKey="value" cx="50%" cy="50%" innerRadius={30} outerRadius={50} paddingAngle={3}>
                  {categoryData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-1.5">
              {categoryData.map((d, i) => (
                <div key={d.name} className="flex items-center gap-2 text-xs">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                  <span className="text-foreground">{d.emoji} {d.name}</span>
                  <span className="text-muted-foreground ml-auto">{Math.round(d.value / 60)}h {d.value % 60}m</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Mood History */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass-card p-4"
      >
        <h3 className="text-sm font-semibold text-foreground mb-3">Mood This Week</h3>
        <div className="flex justify-between items-end px-2">
          {moodData.map((d, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <span className="text-lg">{d.mood ? moodEmojis[d.mood] : '·'}</span>
              <span className="text-[10px] text-muted-foreground">{d.day}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {tasks.length === 0 && (
        <div className="glass-card p-8 text-center">
          <p className="text-muted-foreground text-sm">Complete some tasks to see your stats!</p>
        </div>
      )}
    </div>
  );
}
