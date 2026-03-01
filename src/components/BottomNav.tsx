import { motion } from 'framer-motion';
import { Home, Brain, BarChart3, Settings } from 'lucide-react';
import { useStore, type ViewType } from '../store/useStore';

const NAV_ITEMS: { view: ViewType; icon: typeof Home; label: string }[] = [
  { view: 'dashboard', icon: Home, label: 'Hôm nay' },
  { view: 'focus', icon: Brain, label: 'Focus' },
  { view: 'stats', icon: BarChart3, label: 'Phân tích' },
  { view: 'settings', icon: Settings, label: 'Cài đặt' },
];

export function BottomNav() {
  const { currentView, setCurrentView, isActive, isPaused } = useStore();

  // Hide nav during active focus sessions (immersive mode)
  const isImmersive = isActive && !isPaused;

  return (
    <motion.nav
      aria-label="Điều hướng chính"
      className="fixed inset-x-0 z-50"
      style={{ bottom: 'max(8px, env(safe-area-inset-bottom, 0px))' }}
      initial={{ y: 0 }}
      animate={{ y: isImmersive ? 120 : 0, opacity: isImmersive ? 0.4 : 1 }}
      transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
    >
      <div className="px-safe">
        <div className="mx-auto max-w-xl rounded-[24px] border border-white/55 bg-white/78 p-1.5 shadow-[0_18px_38px_rgba(24,34,26,0.2)] backdrop-blur-xl">
          <div className="relative grid grid-cols-4 gap-1">
          {NAV_ITEMS.map(({ view, icon: Icon, label }) => {
            const isCurrent = currentView === view;
            return (
              <motion.button
                key={view}
                aria-current={isCurrent ? 'page' : undefined}
                className={`relative flex min-h-[56px] flex-col items-center justify-center gap-1 rounded-[18px] px-2 py-1 transition-colors ${
                  isCurrent
                    ? 'text-[var(--color-primary-600)]'
                    : 'text-[var(--text-soft)] active:text-[var(--text-strong)]'
                }`}
                onClick={() => setCurrentView(view)}
                whileTap={{ scale: 0.9 }}
              >
                {isCurrent && (
                  <motion.div
                    className="absolute inset-0 rounded-[18px] bg-[var(--color-primary-100)]"
                    layoutId="nav-indicator"
                    transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                  />
                )}

                <Icon
                  className={`relative z-10 h-5 w-5 transition-all duration-200 ${
                    isCurrent ? 'stroke-[2.4]' : 'stroke-[2]'
                  }`}
                />
                <span
                  className={`relative z-10 text-[10px] font-semibold leading-tight transition-all duration-200 ${
                    isCurrent ? 'opacity-100' : 'opacity-75'
                  }`}
                >
                  {label}
                </span>
              </motion.button>
            );
          })}
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
