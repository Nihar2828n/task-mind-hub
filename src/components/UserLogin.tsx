import { useState } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '@/context/AppContext';

export default function UserLogin() {
  const { loginUser } = useApp();
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) loginUser(name.trim());
  };

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center max-w-sm space-y-6"
      >
        <span className="text-6xl">📋</span>
        <h1 className="text-3xl font-bold text-foreground">Welcome to DayFlow</h1>
        <p className="text-sm text-muted-foreground">Enter your name to get started. Your data will be saved privately under your name.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className="w-full bg-muted rounded-xl px-4 py-3 text-center text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/30"
          />
          <motion.button
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={!name.trim()}
            className="w-full bg-primary text-primary-foreground rounded-xl px-8 py-3 font-semibold text-sm disabled:opacity-40"
          >
            Continue
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
