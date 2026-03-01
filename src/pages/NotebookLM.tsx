import { useState } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, ExternalLink } from 'lucide-react';

export default function NotebookLMPage() {
  const [iframeKey, setIframeKey] = useState(0);
  const [loadError, setLoadError] = useState(false);

  const handleReload = () => {
    setLoadError(false);
    setIframeKey(k => k + 1);
  };

  const handleOpenDirect = () => {
    window.location.href = 'https://notebooklm.google.com';
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 glass-card rounded-none border-x-0 border-t-0">
        <h1 className="text-sm font-semibold text-foreground">NotebookLM</h1>
        <div className="flex gap-2">
          <button onClick={handleReload} className="p-2 rounded-lg hover:bg-muted transition-colors">
            <RefreshCw size={16} className="text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Content */}
      {loadError ? (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4">
          <span className="text-5xl">📓</span>
          <h2 className="text-lg font-semibold text-foreground">Can't embed NotebookLM here</h2>
          <p className="text-sm text-muted-foreground max-w-xs">
            Google doesn't allow embedding NotebookLM in an iframe. Tap below to open it directly.
          </p>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleOpenDirect}
            className="bg-primary text-primary-foreground rounded-xl px-6 py-3 font-semibold text-sm flex items-center gap-2"
          >
            <ExternalLink size={16} />
            Open NotebookLM
          </motion.button>
        </div>
      ) : (
        <iframe
          key={iframeKey}
          src="https://notebooklm.google.com"
          className="flex-1 w-full border-0"
          title="NotebookLM"
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
          onError={() => setLoadError(true)}
          onLoad={(e) => {
            // Detect if iframe was blocked (content won't load properly)
            try {
              const frame = e.currentTarget;
              // If we can't access contentWindow, it's blocked
              if (!frame.contentWindow?.location?.href) {
                setLoadError(true);
              }
            } catch {
              setLoadError(true);
            }
          }}
        />
      )}
    </div>
  );
}
