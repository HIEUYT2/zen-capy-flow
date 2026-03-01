import { motion } from 'framer-motion';
import { Home, Brain, BarChart3, Settings } from 'lucide-react';
import { useStore, type ViewType } from '../store/useStore';

const NAV_ITEMS: { view: ViewType; icon: typeof Home; label: string }[] = [
  { view: 'dashboard', icon: Home, label: 'Home' },
  { view: 'focus', icon: Brain, label: 'Focus' },
  { view: 'stats', icon: BarChart3, label: 'Stats' },
  { view: 'settings', icon: Settings, label: 'Settings' },
];

export function BottomNav() {
  const { currentView, setCurrentView, isActive, isPaused } = useStore();

  // Hide nav during active focus sessions (immersive mode)
  const isImmersive = isActive && !isPaused;

  return (
    <motion.nav
      className="fixed bottom-0 left-0 right-0 z-50"
      initial={{ y: 0 }}
      animate={{ y: isImmersive ? 100 : 0 }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
    >
      {/* Frosted glass background */}
      <div className="bg-white/70 dark:bg-[#1a1b2e]/80 backdrop-blur-xl border-t border-white/20 shadow-[0_-4px_24px_rgba(0,0,0,0.06)]">
        <div
          className="flex items-center justify-around px-2 mx-auto max-w-lg"
          style={{
            paddingBottom: 'max(8px, env(safe-area-inset-bottom, 8px))',
            paddingTop: '6px',
          }}
        >
          {NAV_ITEMS.map(({ view, icon: Icon, label }) => {
            const isActive = currentView === view;
            return (
              <motion.button
                key={view}
                className={`
                  relative flex flex-col items-center justify-center gap-0.5
                  min-w-[64px] min-h-[48px] rounded-2xl px-3 py-1.5
                  transition-colors duration-200 cursor-pointer
                  ${isActive 
                    ? 'text-[var(--sage-dark)]' 
                    : 'text-[var(--warm-brown)]/50 active:text-[var(--warm-brown)]/70'
                  }
                `}
                onClick={() => setCurrentView(view)}
                whileTap={{ scale: 0.9 }}
              >
                {/* Active indicator pill */}
                {isActive && (
                  <motion.div
                    className="absolute inset-x-3 top-0 h-[3px] rounded-full bg-[var(--sage-green)]"
                    layoutId="nav-indicator"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}

                <Icon
                  className={`w-5 h-5 transition-all duration-200 ${
                    isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'
                  }`}
                />
                <span
                  className={`text-[10px] leading-tight font-medium transition-all duration-200 ${
                    isActive ? 'opacity-100' : 'opacity-60'
                  }`}
                >
                  {label}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </motion.nav>
  );
}
