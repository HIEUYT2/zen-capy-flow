import { motion } from 'framer-motion';
import { Fish, Flame } from 'lucide-react';
import { useStore } from '../store/useStore';

export function ControlPanel() {
  const {
    fishCaughtCount,
    currentStreak,
    isLineBroken,
    repairLine,
  } = useStore();

  return (
    <div className="glass p-3 sm:p-4 space-y-3">
      {/* Stats */}
      <div className="grid grid-cols-2 gap-2 sm:gap-3">
        <div className="bg-white/10 rounded-xl p-2 sm:p-3 text-center">
          <div className="flex items-center justify-center gap-1.5 sm:gap-2 text-[var(--soft-blue)]">
            <Fish className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="text-xl sm:text-2xl font-display">{fishCaughtCount}</span>
          </div>
          <p className="text-[10px] sm:text-xs text-[var(--warm-brown)]/60 mt-0.5 sm:mt-1">Fish Caught</p>
        </div>
        <div className="bg-white/10 rounded-xl p-2 sm:p-3 text-center">
          <div className="flex items-center justify-center gap-1.5 sm:gap-2 text-[var(--sage-green)]">
            <Flame className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="text-xl sm:text-2xl font-display">{currentStreak}</span>
          </div>
          <p className="text-[10px] sm:text-xs text-[var(--warm-brown)]/60 mt-0.5 sm:mt-1">Focus Streak</p>
        </div>
      </div>

      {/* Broken line repair */}
      {isLineBroken && (
        <motion.button
          className="w-full py-3 rounded-xl bg-gradient-to-r from-red-400 to-red-500 text-white font-medium flex items-center justify-center gap-2 cursor-pointer"
          onClick={repairLine}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          🔧 Repair Fishing Line
        </motion.button>
      )}
    </div>
  );
}
