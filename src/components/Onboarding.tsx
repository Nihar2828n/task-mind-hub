import { useState } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '@/context/AppContext';

const steps = [
  { emoji: '📋', title: 'Plan Your Day', desc: 'Smart scheduling finds the perfect time for every task.' },
  { emoji: '🎯', title: 'Stay Focused', desc: 'Built-in Pomodoro timer keeps you in the zone.' },
  { emoji: '📊', title: 'Track Progress', desc: 'Beautiful insights show your productivity patterns.' },
  { emoji: '✨', title: "What's your name?", desc: 'So we can personalize your experience.' },
];

export default function Onboarding() {
  const { updateSettings } = useApp();
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');

  const handleFinish = () => {
    updateSettings({ name: name.trim(), onboarded: true });
  };

  const isLast = step === steps.length - 1;

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col items-center justify-center p-8">
      <motion.div
        key={step}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        className="text-center max-w-sm space-y-4"
      >
        <span className="text-6xl">{steps[step].emoji}</span>
        <h2 className="text-2xl font-bold text-foreground">{steps[step].title}</h2>
        <p className="text-sm text-muted-foreground">{steps[step].desc}</p>

        {isLast && (
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            className="w-full bg-muted rounded-xl px-4 py-3 text-center text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/30"
          />
        )}
      </motion.div>

      {/* Progress dots */}
      <div className="flex gap-2 mt-8">
        {steps.map((_, i) => (
          <div key={i} className={`w-2 h-2 rounded-full transition-colors ${i === step ? 'bg-primary' : 'bg-muted'}`} />
        ))}
      </div>

      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => isLast ? handleFinish() : setStep(s => s + 1)}
        className="mt-8 bg-primary text-primary-foreground rounded-xl px-8 py-3 font-semibold text-sm"
      >
        {isLast ? 'Get Started' : 'Continue'}
      </motion.button>

      {!isLast && (
        <button onClick={() => { updateSettings({ onboarded: true }); }} className="mt-3 text-xs text-muted-foreground">
          Skip
        </button>
      )}
    </div>
  );
}
