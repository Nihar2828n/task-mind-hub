import { motion } from 'framer-motion';
import { BookOpen } from 'lucide-react';

export default function NotebookLMPage() {
  const handleOpen = () => {
    window.location.href = 'https://notebooklm.google.com';
  };

  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)] p-8 text-center space-y-6">
      <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center">
        <BookOpen size={36} className="text-primary" />
      </div>
      <h1 className="text-2xl font-bold text-foreground">NotebookLM</h1>
      <p className="text-sm text-muted-foreground max-w-xs">
        Tap below to open Google NotebookLM. It will open right here in this window.
      </p>
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={handleOpen}
        className="bg-primary text-primary-foreground rounded-xl px-8 py-4 font-semibold text-sm"
      >
        Open NotebookLM
      </motion.button>
      <p className="text-xs text-muted-foreground">Opens in this window · Use browser back to return</p>
    </div>
  );
}
