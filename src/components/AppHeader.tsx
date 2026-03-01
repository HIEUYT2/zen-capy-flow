import { motion } from 'framer-motion';
import { Bell, BellOff, Flame, TimerReset } from 'lucide-react';
import { useStore, type ViewType } from '../store/useStore';

const VIEW_META: Record<ViewType, { title: string; subtitle: string }> = {
  dashboard: { title: 'Trang chủ', subtitle: 'Kế hoạch học hôm nay' },
  focus: { title: 'Focus', subtitle: 'Phiên học sâu không xao nhãng' },
  stats: { title: 'Thống kê', subtitle: 'Nhịp học và tiến độ của bạn' },
  settings: { title: 'Cài đặt', subtitle: 'Tùy chỉnh trải nghiệm học tập' },
};

function formatCountdown(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

export function AppHeader() {
  const {
    currentView,
    currentStreak,
    focusHistory,
    focusDuration,
    isActive,
    sessionType,
    timeRemaining,
    notificationsEnabled,
  } = useStore();

  const today = new Date().toISOString().split('T')[0];
  const todaySessions = focusHistory[today] || 0;
  const todayMinutes = todaySessions * focusDuration;
  const meta = VIEW_META[currentView];

  return (
    <header className="px-safe pt-safe relative z-20">
      <motion.div
        className="app-header-card"
        initial={{ y: -8, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.35 }}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--text-soft)]">
              CapyFlow
            </p>
            <h1 className="font-display text-lg leading-tight text-[var(--text-strong)]">
              {meta.title}
            </h1>
            <p className="mt-0.5 text-xs text-[var(--text-soft)]">{meta.subtitle}</p>
          </div>

          <div className="flex items-center gap-2 rounded-2xl bg-white/65 px-3 py-2 text-xs text-[var(--text-soft)] shadow-[0_6px_16px_rgba(42,57,46,0.08)]">
            {notificationsEnabled ? (
              <Bell className="h-3.5 w-3.5 text-[var(--color-primary-600)]" />
            ) : (
              <BellOff className="h-3.5 w-3.5 text-[var(--text-soft)]" />
            )}
            <span className="hidden min-[390px]:inline">{notificationsEnabled ? 'Nhắc nhở bật' : 'Nhắc nhở tắt'}</span>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2.5 min-[412px]:grid-cols-3">
          <div className="header-chip">
            <Flame className="h-3.5 w-3.5 text-orange-500" />
            <div>
              <p className="text-[10px] text-[var(--text-soft)]">Streak</p>
              <p className="font-semibold text-[var(--text-strong)]">{currentStreak} ngày</p>
            </div>
          </div>

          <div className="header-chip">
            <TimerReset className="h-3.5 w-3.5 text-[var(--color-primary-600)]" />
            <div>
              <p className="text-[10px] text-[var(--text-soft)]">Hôm nay</p>
              <p className="font-semibold text-[var(--text-strong)]">{todayMinutes} phút</p>
            </div>
          </div>

          <div className="header-chip col-span-2 min-[412px]:col-span-1">
            <span className="text-sm">{isActive ? (sessionType === 'focus' ? '🧠' : '☕') : '🦫'}</span>
            <div>
              <p className="text-[10px] text-[var(--text-soft)]">
                {isActive ? (sessionType === 'focus' ? 'Đang focus' : 'Đang nghỉ') : 'Sẵn sàng'}
              </p>
              <p className="font-semibold text-[var(--text-strong)]">
                {isActive ? formatCountdown(timeRemaining) : `${todaySessions} phiên`}
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </header>
  );
}
