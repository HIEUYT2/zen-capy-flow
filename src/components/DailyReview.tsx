import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { X, Star, Clock, CheckCircle2, Flame, TrendingUp } from 'lucide-react';
import { useStore } from '../store/useStore';

export function DailyReview() {
  const { showDailyReview, dismissDailyReview, focusHistory, tasks, currentStreak, focusDuration } = useStore();
  const [mood, setMood] = useState<string>('');

  // Calculate today's stats
  const today = new Date().toISOString().split('T')[0];
  const todaySessions = focusHistory[today] || 0;
  const todayMinutes = todaySessions * focusDuration;
  const todayCompletedTasks = tasks.filter(
    (t) => t.completed && t.completedAt && t.completedAt.startsWith(today)
  ).length;

  // Show daily review after 8 PM if there were sessions today
  useEffect(() => {
    const now = new Date();
    const hour = now.getHours();
    if (hour >= 20 && todaySessions > 0 && !showDailyReview) {
      // Check if already dismissed today
      const lastDismiss = localStorage.getItem('capyflow-last-daily-review');
      if (lastDismiss !== today) {
        useStore.getState().setShowDailyReview(true);
      }
    }
  }, [todaySessions, today, showDailyReview]);

  const handleDismiss = () => {
    localStorage.setItem('capyflow-last-daily-review', today);
    dismissDailyReview();
  };

  if (!showDailyReview) return null;

  const moods = ['😫', '😐', '🙂', '😊', '🤩'];

  return (
    <motion.div
      className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={handleDismiss}
    >
      <motion.div
        className="w-full max-w-md mx-4 mb-4 sm:mb-0 glass-strong p-5 sm:p-6 overflow-hidden"
        initial={{ y: 100, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors cursor-pointer"
          onClick={handleDismiss}
        >
          <X className="w-4 h-4 text-[var(--warm-brown)]" />
        </button>

        {/* Header */}
        <div className="text-center mb-5">
          <span className="text-4xl block mb-2">🌙</span>
          <h2 className="text-lg font-display text-[var(--warm-brown-dark)]">
            Tổng kết hôm nay
          </h2>
          <p className="text-xs text-[var(--warm-brown)]/50 mt-1">
            {new Date().toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="bg-white/15 rounded-2xl p-3 text-center">
            <Clock className="w-5 h-5 mx-auto mb-1 text-[var(--soft-blue)]" />
            <div className="text-2xl font-display text-[var(--warm-brown-dark)]">{todayMinutes}</div>
            <div className="text-[10px] text-[var(--warm-brown)]/50 mt-0.5">phút tập trung</div>
          </div>
          <div className="bg-white/15 rounded-2xl p-3 text-center">
            <TrendingUp className="w-5 h-5 mx-auto mb-1 text-[var(--sage-green)]" />
            <div className="text-2xl font-display text-[var(--warm-brown-dark)]">{todaySessions}</div>
            <div className="text-[10px] text-[var(--warm-brown)]/50 mt-0.5">phiên hoàn thành</div>
          </div>
          <div className="bg-white/15 rounded-2xl p-3 text-center">
            <CheckCircle2 className="w-5 h-5 mx-auto mb-1 text-[var(--sage-green)]" />
            <div className="text-2xl font-display text-[var(--warm-brown-dark)]">{todayCompletedTasks}</div>
            <div className="text-[10px] text-[var(--warm-brown)]/50 mt-0.5">task hoàn thành</div>
          </div>
          <div className="bg-white/15 rounded-2xl p-3 text-center">
            <Flame className="w-5 h-5 mx-auto mb-1 text-orange-400" />
            <div className="text-2xl font-display text-[var(--warm-brown-dark)]">{currentStreak}</div>
            <div className="text-[10px] text-[var(--warm-brown)]/50 mt-0.5">streak 🔥</div>
          </div>
        </div>

        {/* Mood check */}
        <div className="text-center mb-4">
          <p className="text-sm text-[var(--warm-brown)] mb-3">Hôm nay bạn thấy thế nào?</p>
          <div className="flex justify-center gap-3">
            {moods.map((m) => (
              <motion.button
                key={m}
                className={`w-11 h-11 rounded-full flex items-center justify-center text-xl cursor-pointer transition-all ${
                  mood === m ? 'bg-[var(--sage-green)]/30 ring-2 ring-[var(--sage-green)] scale-110' : 'bg-white/15 hover:bg-white/25'
                }`}
                onClick={() => setMood(m)}
                whileTap={{ scale: 0.85 }}
              >
                {m}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Encouragement */}
        <div className="bg-white/10 rounded-2xl p-3 text-center mb-4">
          <p className="text-sm text-[var(--warm-brown)] leading-relaxed">
            {todaySessions >= 4
              ? '🏆 Tuyệt vời! Bạn học rất chăm chỉ hôm nay!'
              : todaySessions >= 2
              ? '👏 Tốt lắm! Tiếp tục giữ phong độ nhé!'
              : todaySessions >= 1
              ? '🌱 Khởi đầu tốt! Ngày mai cố gắng hơn nha!'
              : '💫 Mỗi ngày đều là cơ hội mới!'}
          </p>
        </div>

        {/* Done button */}
        <motion.button
          className="w-full py-3 rounded-2xl bg-gradient-to-r from-[var(--sage-green)] to-[var(--soft-blue)] text-white font-medium text-sm cursor-pointer"
          onClick={handleDismiss}
          whileTap={{ scale: 0.98 }}
        >
          <Star className="w-4 h-4 inline-block mr-1.5 -mt-0.5" />
          Nghỉ ngơi thôi! 🦫
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
