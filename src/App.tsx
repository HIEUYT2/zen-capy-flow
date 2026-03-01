import { motion } from 'framer-motion';
import { Background } from './components/Background';
import { RainCanvas } from './components/RainCanvas';
import { AppHeader } from './components/AppHeader';
import { BottomNav } from './components/BottomNav';
import { Toast } from './components/Toast';
import { FishCaughtModal } from './components/FishCaughtModal';
import { DailyReview } from './components/DailyReview';
import { Journal } from './components/Journal';
import { CapyChat } from './components/CapyChat';
import { FloatingNotes } from './components/FloatingNotes';
import { DashboardView } from './views/DashboardView';
import { FocusView } from './views/FocusView';
import { StatsView } from './views/StatsView';
import { SettingsView } from './views/SettingsView';
import { useTabVisibility } from './hooks/useTabVisibility';
import { useAutoTheme } from './hooks/useAutoTheme';
import { useSoundEffects } from './hooks/useSoundEffects';
import { useIdleDetection } from './hooks/useIdleDetection';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { useNotifications } from './hooks/useNotifications';
import { useStore } from './store/useStore';
import './index.css';

function App() {
  // Initialize global app hooks
  useTabVisibility();
  useAutoTheme();
  useSoundEffects();
  useIdleDetection();
  useKeyboardShortcuts();
  useNotifications();

  const { currentView, isTabActive, isMiniMode } = useStore();

  return (
    <div className="relative h-dvh w-full overflow-hidden">
      {/* Dynamic Background */}
      <Background />
      <RainCanvas />

      {/* Main App Shell */}
      <motion.div
        className="relative z-10 flex h-full w-full flex-col"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.45 }}
      >
        <AppHeader />

        <main className="relative flex-1 min-h-0">
          {currentView === 'dashboard' && <DashboardView />}
          {currentView === 'focus' && <FocusView />}
          {currentView === 'stats' && <StatsView />}
          {currentView === 'settings' && <SettingsView />}
        </main>
      </motion.div>

      {/* Bottom Navigation */}
      <BottomNav />

      {/* Toast Notifications */}
      <Toast />

      {/* Fish Caught Modal */}
      <FishCaughtModal />

      {/* Daily Review */}
      <DailyReview />

      {/* Journal (legacy, kept for keyboard shortcut J) */}
      {!isMiniMode && currentView === 'focus' && <Journal />}

      {/* Capy Chat */}
      {!isMiniMode && currentView === 'focus' && <CapyChat />}

      {/* Floating Notes */}
      {currentView === 'focus' && <FloatingNotes />}

      {/* Tab away indicator */}
      {!isTabActive && (
        <motion.div
          className="fixed left-1/2 z-40 flex -translate-x-1/2 items-center gap-2 rounded-2xl border border-white/25 bg-white/75 px-4 py-2 shadow-[0_12px_30px_rgba(20,30,24,0.18)] backdrop-blur-xl"
          style={{ bottom: 'calc(92px + env(safe-area-inset-bottom, 0px))' }}
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <span className="text-lg">👀</span>
          <p className="text-sm text-[var(--text-strong)]">
            Capy is watching... Stay focused!
          </p>
        </motion.div>
      )}
    </div>
  );
}

export default App;
