import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AppProvider, useApp } from "@/context/AppContext";
import BottomNav, { TabId } from "@/components/BottomNav";
import Dashboard from "@/pages/Dashboard";
import Scheduler from "@/pages/Scheduler";
import Stats from "@/pages/Stats";
import SettingsPage from "@/pages/Settings";
import NotebookLMPage from "@/pages/NotebookLM";
import UserLogin from "@/components/UserLogin";

const queryClient = new QueryClient();

function AppContent() {
  const [activeTab, setActiveTab] = useState<TabId>('dashboard');
  const { settings, currentUser } = useApp();

  if (!currentUser) {
    return <UserLogin />;
  }

  const pages: Record<TabId, JSX.Element> = {
    dashboard: <Dashboard />,
    scheduler: <Scheduler />,
    notebook: <NotebookLMPage />,
    stats: <Stats />,
    settings: <SettingsPage />,
  };

  return (
    <div className="min-h-screen bg-background">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
        >
          {pages[activeTab]}
        </motion.div>
      </AnimatePresence>
      <BottomNav active={activeTab} onChange={setActiveTab} />
    </div>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AppProvider>
        <AppContent />
      </AppProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
