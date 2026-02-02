import { motion } from 'framer-motion';
import { BarChart3, X } from 'lucide-react';
import { useState, useMemo, memo } from 'react';
import { useStore } from '../store/useStore';

// Get the last N days
function getLastNDays(n: number): string[] {
  const days: string[] = [];
  for (let i = n - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    days.push(date.toISOString().split('T')[0]);
  }
  return days;
}

// Get color intensity based on session count
function getColorIntensity(count: number): string {
  if (count === 0) return 'bg-gray-200';
  if (count === 1) return 'bg-[var(--sage-light)]';
  if (count === 2) return 'bg-[var(--sage-green)]';
  if (count >= 3) return 'bg-[var(--sage-dark)]';
  return 'bg-gray-200';
}

// Memoized calendar cell
const CalendarCell = memo(function CalendarCell({
  date,
  count,
}: {
  date: string;
  count: number;
}) {
  const displayDate = new Date(date).toLocaleDateString('vi-VN', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  return (
    <motion.div
      className={`w-3 h-3 rounded-sm ${getColorIntensity(count)} cursor-pointer`}
      whileHover={{ scale: 1.5 }}
      title={`${displayDate}: ${count} phiên`}
    />
  );
});

function HeatmapModal() {
  const { focusHistory, ecosystemScore, toggleMiniMode } = useStore();
  const [showModal, setShowModal] = useState(false);

  // Generate last 84 days (12 weeks)
  const days = useMemo(() => getLastNDays(84), []);

  // Calculate stats
  const stats = useMemo(() => {
    const totalSessions = Object.values(focusHistory).reduce((a, b) => a + b, 0);
    const activeDays = Object.keys(focusHistory).length;
    const thisWeek = days.slice(-7).reduce((sum, day) => sum + (focusHistory[day] || 0), 0);
    return { totalSessions, activeDays, thisWeek };
  }, [focusHistory, days]);

  // Organize into weeks (columns)
  const weeks: string[][] = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  return (
    <>
      {/* Trigger button */}
      <motion.button
        className="fixed bottom-6 right-24 w-14 h-14 rounded-full glass-strong flex items-center justify-center cursor-pointer z-40"
        onClick={() => setShowModal(true)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        title="Thống kê tập trung"
      >
        <BarChart3 className="w-6 h-6 text-[var(--warm-brown)]" />
      </motion.button>

      {/* Modal */}
      {showModal && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setShowModal(false)}
        >
          <motion.div
            className="glass-strong p-6 max-w-lg w-full mx-4"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-display text-[var(--warm-brown-dark)]">
                Focus Heatmap
              </h2>
              <button
                className="w-8 h-8 rounded-full bg-white/30 flex items-center justify-center hover:bg-white/50"
                onClick={() => setShowModal(false)}
              >
                <X className="w-4 h-4 text-[var(--warm-brown)]" />
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center p-3 bg-white/20 rounded-xl">
                <div className="text-2xl font-display text-[var(--sage-green)]">
                  {stats.totalSessions}
                </div>
                <div className="text-xs text-[var(--warm-brown)]/60">Tổng phiên</div>
              </div>
              <div className="text-center p-3 bg-white/20 rounded-xl">
                <div className="text-2xl font-display text-[var(--soft-blue)]">
                  {stats.activeDays}
                </div>
                <div className="text-xs text-[var(--warm-brown)]/60">Ngày hoạt động</div>
              </div>
              <div className="text-center p-3 bg-white/20 rounded-xl">
                <div className="text-2xl font-display text-[var(--warm-brown)]">
                  {stats.thisWeek}
                </div>
                <div className="text-xs text-[var(--warm-brown)]/60">Tuần này</div>
              </div>
            </div>

            {/* Ecosystem Score */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-[var(--warm-brown)]">Ecosystem Score</span>
                <span className="text-sm font-medium text-[var(--sage-green)]">{ecosystemScore}%</span>
              </div>
              <div className="h-3 bg-white/20 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-[var(--sage-light)] to-[var(--sage-green)]"
                  initial={{ width: 0 }}
                  animate={{ width: `${ecosystemScore}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                />
              </div>
              <p className="text-xs text-[var(--warm-brown)]/60 mt-1">
                {ecosystemScore >= 70 ? '🌸 Hệ sinh thái đang nở hoa!' : 
                 ecosystemScore >= 40 ? '🌿 Đang phát triển tốt' : 
                 '🌱 Cần chăm chỉ hơn nữa'}
              </p>
            </div>

            {/* Heatmap Grid */}
            <div className="overflow-x-auto pb-2">
              <div className="flex gap-1 min-w-fit">
                {weeks.map((week, weekIndex) => (
                  <div key={weekIndex} className="flex flex-col gap-1">
                    {week.map((day) => (
                      <CalendarCell
                        key={day}
                        date={day}
                        count={focusHistory[day] || 0}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* Legend */}
            <div className="flex items-center justify-end gap-2 mt-4 text-xs text-[var(--warm-brown)]/60">
              <span>Ít</span>
              <div className="flex gap-1">
                <div className="w-3 h-3 rounded-sm bg-gray-200" />
                <div className="w-3 h-3 rounded-sm bg-[var(--sage-light)]" />
                <div className="w-3 h-3 rounded-sm bg-[var(--sage-green)]" />
                <div className="w-3 h-3 rounded-sm bg-[var(--sage-dark)]" />
              </div>
              <span>Nhiều</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  );
}

export const FocusHeatmap = memo(HeatmapModal);
