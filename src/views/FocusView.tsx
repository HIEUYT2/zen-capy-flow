import { motion } from 'framer-motion';
import { CapybaraMascot } from '../components/CapybaraMascot';
import { FocusTimer } from '../components/FocusTimer';
import { VinylPlayer } from '../components/VinylPlayer';
import { ControlPanel } from '../components/ControlPanel';
import { CastButton } from '../components/CastButton';
import { FocusFog } from '../components/FocusFog';
import { SpeechBubble } from '../components/CapyChat';
import { MusicCommandBar } from '../components/MusicCommandBar';
import { MiniModeButton } from '../components/MiniMode';
import { useStore } from '../store/useStore';

export function FocusView() {
  const { showFishModal, isActive, focusFogEnabled, isMiniMode } = useStore();

  const shouldDimUI = isActive && focusFogEnabled;

  return (
    <div className="w-full h-full flex flex-col overflow-hidden">
      {/* Focus Fog Overlay */}
      <FocusFog />

      {/* Mini Mode Button */}
      <MiniModeButton />

      {/* Music Command Bar - compact header on mobile */}
      <motion.div
        className="flex items-center justify-between px-3 py-2"
        animate={{
          opacity: isMiniMode ? 0 : shouldDimUI ? 0.3 : 1,
          y: isMiniMode ? -50 : 0,
        }}
        transition={{ duration: isMiniMode ? 0.4 : 1.5 }}
      >
        <span className="text-sm font-display text-[var(--warm-brown-dark)]/70">🧠 Focus Mode</span>
        <MusicCommandBar />
      </motion.div>

      {/* Main Stage */}
      <main className="flex-1 flex items-start sm:items-center justify-center px-2 sm:px-4 pb-20 sm:pb-6 pt-0 overflow-y-auto overflow-x-hidden">
        <div className="w-full max-w-md lg:max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-6 lg:gap-8 items-center place-items-center">

          {/* Timer (Top on mobile, left on desktop) */}
          <motion.div
            className="order-1 lg:col-span-4 w-full flex flex-col items-center"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <div className="glass-strong p-4 sm:p-6 lg:p-8 w-full backdrop-blur-xl">
              <FocusTimer />
            </div>
          </motion.div>

          {/* Controls (2nd on mobile, right on desktop) */}
          <motion.div
            className="order-2 lg:order-3 lg:col-span-4 w-full flex flex-col gap-3"
            initial={{ y: 20, opacity: 0 }}
            animate={{
              y: isMiniMode ? 80 : 0,
              opacity: isMiniMode ? 0 : shouldDimUI ? 0.3 : 1,
            }}
            transition={{ delay: isMiniMode ? 0 : 0.2, duration: isMiniMode ? 0.4 : shouldDimUI ? 1.5 : 0.4 }}
          >
            <VinylPlayer />
            <ControlPanel />
          </motion.div>

          {/* Capybara (3rd on mobile, center on desktop) */}
          <motion.div
            className="order-3 lg:order-2 lg:col-span-4 flex flex-col items-center justify-center gap-2 sm:gap-4 w-full"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, type: 'spring' }}
          >
            <div className="relative w-full max-w-[160px] sm:max-w-[260px] lg:max-w-md aspect-square">
              <CapybaraMascot isCatching={showFishModal} />
              <SpeechBubble />
            </div>

            <motion.div
              className="w-full max-w-xs z-20"
              animate={{ opacity: shouldDimUI ? 0.3 : 1 }}
              transition={{ duration: 1.5 }}
            >
              <CastButton />
            </motion.div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
