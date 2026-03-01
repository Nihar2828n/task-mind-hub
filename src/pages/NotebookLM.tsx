import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';

export default function NotebookLMPage() {
  const handleOpen = () => {
    window.location.href = 'https://notebooklm.google.com';
  };

  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)] p-8 text-center space-y-6">
      <span className="text-6xl">📓</span>
      <h1 className="text-2xl font-bold text-foreground">NotebookLM</h1>
      <p className="text-sm text-muted-foreground max-w-xs">
        Google doesn't allow embedding NotebookLM. Tap below to open it directly.
      </p>
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={handleOpen}
        className="bg-primary text-primary-foreground rounded-xl px-8 py-4 font-semibold text-sm flex items-center gap-2"
      >
        <ExternalLink size={18} />
        Open NotebookLM
      </motion.button>
    </div>
  );
}
