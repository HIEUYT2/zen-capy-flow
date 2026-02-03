import { motion } from 'framer-motion';
import { CapybaraMascot } from './components/CapybaraMascot';
import { MusicCommandBar } from './components/MusicCommandBar';
import { FocusTimer } from './components/FocusTimer';
import { FishCaughtModal } from './components/FishCaughtModal';
import { VinylPlayer } from './components/VinylPlayer';
import { Background } from './components/Background';
import { ControlPanel } from './components/ControlPanel';
import { CastButton } from './components/CastButton';
import { FocusFog } from './components/FocusFog';
import { Journal } from './components/Journal';
import { FocusHeatmap } from './components/FocusHeatmap';
import { RainCanvas } from './components/RainCanvas';
import { CapyChat, SpeechBubble } from './components/CapyChat';
import { MiniModeButton } from './components/MiniMode';
import { useTabVisibility } from './hooks/useTabVisibility';
import { useAutoTheme } from './hooks/useAutoTheme';
import { useSoundEffects } from './hooks/useSoundEffects';
import { useIdleDetection } from './hooks/useIdleDetection';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { useStore } from './store/useStore';
import './index.css';

function App() {
  // Initialize all hooks
  useTabVisibility();
  useAutoTheme();
  useSoundEffects();
  useIdleDetection();
  useKeyboardShortcuts();

  const { showFishModal, isTabActive, isActive, focusFogEnabled, isMiniMode } = useStore();

  // Determine if UI should be dimmed (focus fog active)
  const shouldDimUI = isActive && focusFogEnabled;

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Dynamic Background */}
      <Background />

      {/* Rain Canvas (only shows in rainy theme) */}
      <RainCanvas />

      {/* Focus Fog Overlay */}
      <FocusFog />

      {/* Watermark */}
      {!isMiniMode && (
        <div className="fixed top-3 left-1/2 transform -translate-x-1/2 z-50 font-display text-[10px] font-bold text-[var(--warm-brown)]/30 tracking-[0.2em] select-none pointer-events-none uppercase">
          WEB CỦA THIÊN QUỐC
        </div>
      )}

      {/* Mini Mode Button */}
      <MiniModeButton />

      {/* Main Content */}
      <motion.div
        className="relative z-10 w-full h-full flex flex-col"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Header */}
        <motion.header 
          className="flex items-center justify-between px-6 py-4"
          animate={{
            opacity: isMiniMode ? 0 : (shouldDimUI ? 0.3 : 1),
            y: isMiniMode ? -100 : 0,
          }}
          transition={{ duration: isMiniMode ? 0.5 : 2 }}
        >
          {/* Logo */}
          <motion.div
            className="flex items-center gap-3"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <span className="text-3xl">🦫</span>
            <h1 className="text-2xl font-display text-[var(--warm-brown-dark)]">
              CapyFlow
            </h1>
          </motion.div>

          {/* Music Command Bar Trigger */}
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <MusicCommandBar />
          </motion.div>
        </motion.header>

        {/* Main Stage */}
        <main className="flex-1 flex items-center justify-center px-4 pb-6 overflow-y-auto overflow-x-hidden">
          <div className="w-full max-w-md lg:max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center place-items-center">
            
            {/* Timer (Ordered 1 on Mobile, Left on Desktop) */}
            <motion.div
              className="order-1 lg:col-span-4 w-full flex flex-col items-center"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <div className="glass-strong p-6 lg:p-8 w-full backdrop-blur-xl">
                <FocusTimer />
              </div>
            </motion.div>

            {/* Controls (Ordered 2 on Mobile, Right Panel on Desktop) */}
            {/* NOTE: On Desktop this was previously the right panel.
                For Mobile First: Timer -> Controls -> Capybara (Bottom) 
                Wait, user request: "Capybara fishing at bottom".
                So Order: Timer -> Controls -> Capybara.
            */}
             <motion.div
              className="order-2 lg:order-3 lg:col-span-4 w-full flex flex-col gap-4"
              initial={{ y: 30, opacity: 0 }}
              animate={{ 
                y: isMiniMode ? 100 : 0, 
                opacity: isMiniMode ? 0 : (shouldDimUI ? 0.3 : 1),
              }}
              transition={{ delay: isMiniMode ? 0 : 0.6, duration: isMiniMode ? 0.5 : (shouldDimUI ? 2 : 0.6) }}
            >
              {/* Vinyl Player */}
              <VinylPlayer />

              {/* Control Panel */}
              <ControlPanel />
            </motion.div>

            {/* Capybara (Ordered 3 on Mobile, Center on Desktop) */}
            <motion.div
              className="order-3 lg:order-2 lg:col-span-4 flex flex-col items-center justify-center gap-4 w-full"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5, type: 'spring' }}
            >
              <div className="relative w-full max-w-[280px] lg:max-w-md aspect-square">
                <CapybaraMascot isCatching={showFishModal} />
                {/* Speech Bubble for Capy Chat */}
                <SpeechBubble />
              </div>
              
              {/* Cast Button */}
              <motion.div
                className="w-full max-w-xs z-20"
                animate={{
                  opacity: shouldDimUI ? 0.3 : 1,
                }}
                transition={{ duration: 2 }}
              >
                <CastButton />
              </motion.div>
            </motion.div>
          </div>
        </main>

        {/* Tab away indicator */}
        {!isTabActive && (
          <motion.div
            className="fixed bottom-6 left-1/2 transform -translate-x-1/2 glass-strong px-6 py-3 flex items-center gap-3"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
            <span className="text-xl">👀</span>
            <p className="text-[var(--warm-brown)]">
              Capy is watching... Stay focused!
            </p>
          </motion.div>
        )}
      </motion.div>

      {/* Fish Caught Modal */}
      <FishCaughtModal />

      {/* Journal Button + Modal */}
      {!isMiniMode && <Journal />}

      {/* Focus Heatmap Button + Modal */}
      {!isMiniMode && <FocusHeatmap />}

      {/* Capy Chat Button + Panel */}
      {!isMiniMode && <CapyChat />}
    </div>
  );
}

export default App;
