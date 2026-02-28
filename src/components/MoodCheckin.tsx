import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useApp } from '@/context/AppContext';

const moods = [
  { emoji: '😫', label: 'Awful' },
  { emoji: '😕', label: 'Bad' },
  { emoji: '😐', label: 'Okay' },
  { emoji: '🙂', label: 'Good' },
  { emoji: '🤩', label: 'Great' },
];

export default function MoodCheckin({ onClose }: { onClose: () => void }) {
  const { addMood } = useApp();

  const handleSelect = (idx: number) => {
    addMood(idx + 1);
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="glass-card-elevated p-6 mx-4 max-w-sm w-full text-center space-y-4"
      >
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-foreground">How are you feeling?</h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X size={20} />
          </button>
        </div>
        <div className="flex justify-between px-2">
          {moods.map((m, i) => (
            <motion.button
              key={i}
              whileTap={{ scale: 0.85 }}
              whileHover={{ scale: 1.15 }}
              onClick={() => handleSelect(i)}
              className="flex flex-col items-center gap-1"
            >
              <span className="text-3xl">{m.emoji}</span>
              <span className="text-[10px] text-muted-foreground">{m.label}</span>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
