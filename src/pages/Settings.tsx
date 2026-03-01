import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Palette, Moon, Sun, Clock, Target, Trash2, Eye, EyeOff, LogOut } from 'lucide-react';
import { useApp } from '@/context/AppContext';

const accentColors = [
  { name: 'Indigo', hsl: '235 65% 55%' },
  { name: 'Blue', hsl: '215 75% 55%' },
  { name: 'Teal', hsl: '175 65% 40%' },
  { name: 'Green', hsl: '150 60% 42%' },
  { name: 'Amber', hsl: '35 90% 50%' },
  { name: 'Orange', hsl: '25 90% 55%' },
  { name: 'Rose', hsl: '350 70% 55%' },
  { name: 'Pink', hsl: '330 70% 55%' },
  { name: 'Purple', hsl: '270 65% 55%' },
  { name: 'Slate', hsl: '220 15% 40%' },
];

export default function SettingsPage() {
  const { settings, updateSettings, setTasks, switchUser } = useApp();
  const [name, setName] = useState(settings.name);

  const handleNameSave = () => {
    updateSettings({ name: name.trim() });
  };

  const handleAccent = (hsl: string) => {
    document.documentElement.style.setProperty('--primary', hsl);
    updateSettings({ accentColor: hsl });
  };

  const handleClearData = () => {
    if (confirm('Are you sure you want to clear all data? This cannot be undone.')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  const handleSwitchUser = () => {
    if (confirm('Switch to a different user? You can come back anytime by entering your name again.')) {
      switchUser();
    }
  };

  return (
    <div className="px-4 pt-2 pb-24 max-w-lg mx-auto space-y-5">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground">Customize your DayFlow experience</p>
      </motion.div>

      {/* Profile */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-4 space-y-3">
        <div className="flex items-center gap-2 text-foreground">
          <User size={16} />
          <h3 className="text-sm font-semibold">Profile</h3>
        </div>
        <div className="flex gap-2">
          <input value={name} onChange={(e) => setName(e.target.value)} onBlur={handleNameSave} placeholder="Your name" className="flex-1 bg-muted rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/30" />
        </div>
      </motion.div>

      {/* Appearance */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="glass-card p-4 space-y-3">
        <div className="flex items-center gap-2 text-foreground">
          <Palette size={16} />
          <h3 className="text-sm font-semibold">Appearance</h3>
        </div>
        <button onClick={() => updateSettings({ darkMode: !settings.darkMode })} className="w-full flex items-center justify-between p-3 rounded-xl bg-muted">
          <span className="text-sm text-foreground flex items-center gap-2">
            {settings.darkMode ? <Moon size={16} /> : <Sun size={16} />}
            {settings.darkMode ? 'Dark Mode' : 'Light Mode'}
          </span>
          <div className={`w-10 h-6 rounded-full relative transition-colors ${settings.darkMode ? 'bg-primary' : 'bg-muted-foreground/30'}`}>
            <motion.div animate={{ x: settings.darkMode ? 18 : 2 }} className="absolute top-1 w-4 h-4 rounded-full bg-card" />
          </div>
        </button>
        <div>
          <p className="text-xs text-muted-foreground mb-2">Accent Color</p>
          <div className="flex flex-wrap gap-2">
            {accentColors.map((c) => (
              <button key={c.name} onClick={() => handleAccent(c.hsl)} className="w-8 h-8 rounded-full border-2 border-transparent hover:border-foreground/20 transition-all" style={{ backgroundColor: `hsl(${c.hsl})` }} title={c.name} />
            ))}
          </div>
        </div>
      </motion.div>

      {/* Show Fixed Routine Toggle */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.17 }} className="glass-card p-4">
        <button onClick={() => updateSettings({ showFixedRoutine: !settings.showFixedRoutine })} className="w-full flex items-center justify-between">
          <span className="text-sm text-foreground flex items-center gap-2">
            {settings.showFixedRoutine ? <Eye size={16} /> : <EyeOff size={16} />}
            Show Fixed Routine
          </span>
          <div className={`w-10 h-6 rounded-full relative transition-colors ${settings.showFixedRoutine ? 'bg-primary' : 'bg-muted-foreground/30'}`}>
            <motion.div animate={{ x: settings.showFixedRoutine ? 18 : 2 }} className="absolute top-1 w-4 h-4 rounded-full bg-card" />
          </div>
        </button>
      </motion.div>

      {/* Pomodoro Settings */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-4 space-y-3">
        <div className="flex items-center gap-2 text-foreground">
          <Clock size={16} />
          <h3 className="text-sm font-semibold">Pomodoro Timer</h3>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-muted-foreground">Work (min)</label>
            <input type="number" value={settings.pomodoroWork} onChange={(e) => updateSettings({ pomodoroWork: Number(e.target.value) || 25 })} className="w-full bg-muted rounded-xl px-3 py-2 text-sm text-foreground outline-none mt-1" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Break (min)</label>
            <input type="number" value={settings.pomodoroBreak} onChange={(e) => updateSettings({ pomodoroBreak: Number(e.target.value) || 5 })} className="w-full bg-muted rounded-xl px-3 py-2 text-sm text-foreground outline-none mt-1" />
          </div>
        </div>
      </motion.div>

      {/* Daily Goal */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="glass-card p-4 space-y-3">
        <div className="flex items-center gap-2 text-foreground">
          <Target size={16} />
          <h3 className="text-sm font-semibold">Daily Goal</h3>
        </div>
        <div className="flex items-center gap-3">
          <input type="range" min={1} max={20} value={settings.dailyGoal} onChange={(e) => updateSettings({ dailyGoal: Number(e.target.value) })} className="flex-1 accent-primary" />
          <span className="text-sm font-bold text-foreground w-8 text-center">{settings.dailyGoal}</span>
        </div>
        <p className="text-xs text-muted-foreground">tasks per day</p>
      </motion.div>

      {/* Switch User */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28 }}>
        <button onClick={handleSwitchUser} className="w-full glass-card p-4 flex items-center gap-3 text-primary hover:bg-primary/5 transition-colors">
          <LogOut size={16} />
          <span className="text-sm font-medium">Switch User</span>
        </button>
      </motion.div>

      {/* Danger Zone */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <button onClick={handleClearData} className="w-full glass-card p-4 flex items-center gap-3 text-destructive hover:bg-destructive/5 transition-colors">
          <Trash2 size={16} />
          <span className="text-sm font-medium">Clear All Data</span>
        </button>
      </motion.div>

      <p className="text-center text-xs text-muted-foreground pt-2">DayFlow v1.0 · Made with ❤️</p>
    </div>
  );
}
