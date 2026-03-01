import { motion } from 'framer-motion';
import { Background } from './components/Background';
import { RainCanvas } from './components/RainCanvas';
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
  // Initialize all hooks
  useTabVisibility();
  useAutoTheme();
  useSoundEffects();
  useIdleDetection();
  useKeyboardShortcuts();
  useNotifications();

  const { currentView, isTabActive, isMiniMode } = useStore();

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Dynamic Background */}
      <Background />
      <RainCanvas />

      {/* Watermark */}
      {!isMiniMode && (
        <div className="fixed top-2 left-1/2 transform -translate-x-1/2 z-50 font-display text-[8px] font-bold text-[var(--warm-brown)]/20 tracking-[0.2em] select-none pointer-events-none uppercase">
          WEB CỦA THIÊN QUỐC
        </div>
      )}

      {/* Main Content Area */}
      <motion.div
        className="relative z-10 w-full h-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        {/* App Header - compact on mobile */}
        <header className="flex items-center justify-between px-4 py-2 sm:py-3">
          <div className="flex items-center gap-2">
            <span className="text-xl sm:text-2xl">🦫</span>
            <h1 className="text-base sm:text-lg font-display text-[var(--warm-brown-dark)]">
              CapyFlow
            </h1>
          </div>
        </header>

        {/* View Router */}
        <div className="w-full" style={{ height: 'calc(100% - 48px)' }}>
          {currentView === 'dashboard' && <DashboardView />}
          {currentView === 'focus' && <FocusView />}
          {currentView === 'stats' && <StatsView />}
          {currentView === 'settings' && <SettingsView />}
        </div>
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
          className="fixed bottom-20 left-1/2 transform -translate-x-1/2 glass-strong px-5 py-2.5 flex items-center gap-2 z-40"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <span className="text-lg">👀</span>
          <p className="text-sm text-[var(--warm-brown)]">
            Capy is watching... Stay focused!
          </p>
        </motion.div>
      )}
    </div>
  );
}

export default App;
