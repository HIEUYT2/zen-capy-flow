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
    <div className="space-y-3">
      {/* Stats */}
      <div className="grid grid-cols-2 gap-2.5">
        <div className="rounded-2xl border border-white/60 bg-white/55 p-3 text-center">
          <div className="flex items-center justify-center gap-1.5 text-[var(--color-accent-500)]">
            <Fish className="h-4 w-4" />
            <span className="text-2xl font-display">{fishCaughtCount}</span>
          </div>
          <p className="mt-0.5 text-[10px] text-[var(--text-soft)]">Tổng cá câu được</p>
        </div>
        <div className="rounded-2xl border border-white/60 bg-white/55 p-3 text-center">
          <div className="flex items-center justify-center gap-1.5 text-[var(--color-primary-600)]">
            <Flame className="h-4 w-4" />
            <span className="text-2xl font-display">{currentStreak}</span>
          </div>
          <p className="mt-0.5 text-[10px] text-[var(--text-soft)]">Chuỗi tập trung</p>
        </div>
      </div>

      {/* Broken line repair */}
      {isLineBroken && (
        <motion.button
          className="w-full rounded-xl bg-gradient-to-r from-rose-500 to-rose-600 py-3 text-sm font-medium text-white"
          onClick={repairLine}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          🔧 Sửa cần câu
        </motion.button>
      )}
    </div>
  );
}
