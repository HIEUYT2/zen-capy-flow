import { motion } from 'framer-motion';
import { Play, Flame, Clock, Target, Zap, TrendingUp } from 'lucide-react';
import { useStore } from '../store/useStore';
import { TaskManager } from '../components/TaskManager';
import { QuickNotes } from '../components/QuickNotes';

export function DashboardView() {
  const {
    currentStreak,
    focusHistory,
    focusDuration,
    fishCaughtCount,
    tasks,
    setCurrentView,
    dailyGoal,
  } = useStore();

  // Today's stats
  const today = new Date().toISOString().split('T')[0];
  const todaySessions = focusHistory[today] || 0;
  const todayMinutes = todaySessions * focusDuration;
  const goalProgress = Math.min(100, (todaySessions / dailyGoal) * 100);
  const activeTasks = tasks.filter((t) => !t.completed).length;

  // Greeting based on time
  const hour = new Date().getHours();
  const greeting =
    hour < 5 ? 'Khuya rồi' : hour < 12 ? 'Chào buổi sáng' : hour < 18 ? 'Chào buổi chiều' : 'Chào buổi tối';

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
  };

  return (
    <motion.div
      className="w-full h-full overflow-y-auto overflow-x-hidden pb-24"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <div className="max-w-lg mx-auto px-4 pt-2 space-y-4">
        {/* Greeting */}
        <motion.div variants={itemVariants} className="pt-1">
          <p className="text-[var(--warm-brown)]/60 text-sm">{greeting} 🦫</p>
          <h1 className="text-xl font-display text-[var(--warm-brown-dark)] mt-0.5">
            Sẵn sàng học chưa?
          </h1>
        </motion.div>

        {/* Today Progress Hero Card */}
        <motion.div
          variants={itemVariants}
          className="glass-strong p-4 relative overflow-hidden"
        >
          {/* Background decoration */}
          <div className="absolute -right-6 -top-6 w-28 h-28 rounded-full bg-[var(--sage-green)]/10" />
          <div className="absolute -right-2 -bottom-8 w-20 h-20 rounded-full bg-[var(--soft-blue)]/10" />

          <div className="flex items-center gap-4 relative">
            {/* Progress Ring */}
            <div className="relative w-20 h-20 shrink-0">
              <svg width="80" height="80" className="transform -rotate-90">
                <circle
                  cx="40" cy="40" r="34"
                  fill="none"
                  stroke="rgba(255,255,255,0.15)"
                  strokeWidth="6"
                />
                <motion.circle
                  cx="40" cy="40" r="34"
                  fill="none"
                  stroke="var(--sage-green)"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 34}
                  initial={{ strokeDashoffset: 2 * Math.PI * 34 }}
                  animate={{ strokeDashoffset: 2 * Math.PI * 34 * (1 - goalProgress / 100) }}
                  transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-lg font-display text-[var(--warm-brown-dark)]">
                  {todaySessions}
                </span>
                <span className="text-[9px] text-[var(--warm-brown)]/50">/{dailyGoal}</span>
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[var(--warm-brown-dark)]">Mục tiêu hôm nay</p>
              <p className="text-xs text-[var(--warm-brown)]/50 mt-0.5">
                {goalProgress >= 100
                  ? '🎉 Hoàn thành mục tiêu!'
                  : `Còn ${dailyGoal - todaySessions} phiên nữa`}
              </p>
              <div className="mt-2 h-1.5 bg-white/15 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-[var(--sage-green)] to-[var(--soft-blue)]"
                  initial={{ width: 0 }}
                  animate={{ width: `${goalProgress}%` }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div variants={itemVariants} className="grid grid-cols-3 gap-2.5">
          <div className="glass p-3 text-center">
            <Flame className="w-4 h-4 mx-auto mb-1 text-orange-400" />
            <div className="text-xl font-display text-[var(--warm-brown-dark)]">{currentStreak}</div>
            <div className="text-[10px] text-[var(--warm-brown)]/50">Streak</div>
          </div>
          <div className="glass p-3 text-center">
            <Clock className="w-4 h-4 mx-auto mb-1 text-[var(--soft-blue)]" />
            <div className="text-xl font-display text-[var(--warm-brown-dark)]">{todayMinutes}p</div>
            <div className="text-[10px] text-[var(--warm-brown)]/50">Hôm nay</div>
          </div>
          <div className="glass p-3 text-center">
            <Target className="w-4 h-4 mx-auto mb-1 text-[var(--sage-green)]" />
            <div className="text-xl font-display text-[var(--warm-brown-dark)]">{fishCaughtCount}</div>
            <div className="text-[10px] text-[var(--warm-brown)]/50">Cá câu</div>
          </div>
        </motion.div>

        {/* Quick Start Focus */}
        <motion.div variants={itemVariants}>
          <motion.button
            className="w-full py-4 rounded-3xl bg-gradient-to-r from-[var(--sage-green)] to-[var(--sage-dark)] text-white font-display text-base flex items-center justify-center gap-2.5 shadow-lg shadow-[var(--sage-green)]/20 cursor-pointer"
            onClick={() => setCurrentView('focus')}
            whileTap={{ scale: 0.98 }}
          >
            <Play className="w-5 h-5" fill="currentColor" />
            Bắt đầu tập trung
          </motion.button>
        </motion.div>

        {/* Tasks & Notes */}
        <motion.div variants={itemVariants} className="glass-strong p-4">
          <TaskManager compact />
        </motion.div>

        <motion.div variants={itemVariants} className="glass-strong p-4">
          <QuickNotes compact />
        </motion.div>

        {/* Quick Tip */}
        <motion.div variants={itemVariants} className="glass p-3 flex items-start gap-3">
          <Zap className="w-4 h-4 text-[var(--sage-green)] shrink-0 mt-0.5" />
          <p className="text-xs text-[var(--warm-brown)]/60 leading-relaxed">
            {todaySessions === 0
              ? 'Hãy bắt đầu phiên tập trung đầu tiên trong ngày! 🌟'
              : activeTasks > 0
              ? `Bạn còn ${activeTasks} công việc cần hoàn thành. Tập trung nào! 💪`
              : 'Capybara đang cổ vũ bạn! Tiếp tục cố gắng nhé 🦫✨'}
          </p>
        </motion.div>

        {/* Spacer for bottom nav */}
        <div className="h-4" />
      </div>
    </motion.div>
  );
}
