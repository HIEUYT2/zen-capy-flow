import { memo, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  CalendarDays,
  Clock3,
  Fish,
  Sparkles,
  Target,
  TrendingUp,
  Trophy,
  CheckCircle2,
} from 'lucide-react';
import { useStore } from '../store/useStore';

function getLastNDays(n: number): string[] {
  const days: string[] = [];
  for (let index = n - 1; index >= 0; index -= 1) {
    const date = new Date();
    date.setDate(date.getDate() - index);
    days.push(date.toISOString().split('T')[0]);
  }
  return days;
}

function getIntensity(count: number) {
  if (count === 0) return 'bg-white/35';
  if (count === 1) return 'bg-[#d8e8cb]';
  if (count === 2) return 'bg-[#aac893]';
  if (count >= 3) return 'bg-[#7a9b63]';
  return 'bg-white/35';
}

const HeatCell = memo(function HeatCell({ date, value }: { date: string; value: number }) {
  const dateLabel = new Date(date).toLocaleDateString('vi-VN', { day: 'numeric', month: 'short' });
  return (
    <motion.div
      className={`h-3.5 w-3.5 rounded-[4px] ${getIntensity(value)}`}
      whileHover={{ scale: 1.32 }}
      title={`${dateLabel}: ${value} phiên`}
    />
  );
});

function WeeklyBars({ days, history }: { days: string[]; history: Record<string, number> }) {
  const max = Math.max(1, ...days.map((day) => history[day] || 0));
  return (
    <div className="grid grid-cols-7 gap-2">
      {days.map((day) => {
        const value = history[day] || 0;
        const height = Math.max(8, (value / max) * 72);
        const shortDay = new Date(day).toLocaleDateString('vi-VN', { weekday: 'short' });
        return (
          <div key={day} className="flex flex-col items-center gap-1">
            <div className="flex h-20 w-full items-end rounded-xl bg-white/45 px-1.5 pb-1.5">
              <motion.div
                className="w-full rounded-md bg-gradient-to-t from-[var(--color-primary-600)] to-[var(--color-primary-500)]"
                initial={{ height: 0 }}
                animate={{ height }}
                transition={{ duration: 0.4 }}
                title={`${value} phiên`}
              />
            </div>
            <span className="text-[10px] text-[var(--text-soft)]">{shortDay}</span>
            <span className="text-[11px] font-semibold text-[var(--text-strong)]">{value}</span>
          </div>
        );
      })}
    </div>
  );
}

function FishCollection() {
  const { fishCollection } = useStore();
  const groupedFish = useMemo(() => {
    const map = new Map<string, { emoji: string; count: number; rarity: string }>();
    fishCollection.forEach((fish) => {
      const current = map.get(fish.name);
      if (current) {
        current.count += 1;
      } else {
        map.set(fish.name, { emoji: fish.emoji, count: 1, rarity: fish.rarity });
      }
    });
    return Array.from(map.entries()).sort((a, b) => b[1].count - a[1].count);
  }, [fishCollection]);

  if (groupedFish.length === 0) {
    return <p className="text-sm text-[var(--text-soft)] text-center py-4">Chưa có cá nào, hoàn thành focus session để câu cá.</p>;
  }

  return (
    <div className="grid grid-cols-4 gap-2 sm:grid-cols-5">
      {groupedFish.slice(0, 10).map(([name, fish]) => (
        <div key={name} className="rounded-2xl border border-white/55 bg-white/55 p-2 text-center">
          <p className="text-2xl">{fish.emoji}</p>
          <p className="text-[10px] font-semibold text-[var(--text-soft)]">x{fish.count}</p>
        </div>
      ))}
    </div>
  );
}

function JournalPreview() {
  const { journalEntries } = useStore();
  const recent = journalEntries.slice().reverse().slice(0, 4);

  if (recent.length === 0) {
    return <p className="text-sm text-[var(--text-soft)] text-center py-4">Nhật ký chưa có mục nào.</p>;
  }

  return (
    <div className="space-y-2">
      {recent.map((entry) => (
        <div key={entry.id} className="rounded-xl border border-white/55 bg-white/55 px-3 py-2.5">
          <p className="text-xs text-[var(--text-soft)]">
            {new Date(entry.date).toLocaleDateString('vi-VN', { weekday: 'short', day: 'numeric', month: 'short' })}
          </p>
          <p className="text-sm text-[var(--text-strong)] line-clamp-1 mt-0.5">{entry.quote}</p>
        </div>
      ))}
    </div>
  );
}

export function StatsView() {
  const { focusHistory, ecosystemScore, fishCaughtCount, focusDuration, tasks, currentStreak } = useStore();

  const allDays = useMemo(() => getLastNDays(84), []);
  const weekDays = useMemo(() => getLastNDays(7), []);
  const weeks = useMemo(() => {
    const grouped: string[][] = [];
    for (let index = 0; index < allDays.length; index += 7) {
      grouped.push(allDays.slice(index, index + 7));
    }
    return grouped;
  }, [allDays]);

  const totalSessions = Object.values(focusHistory).reduce((sum, value) => sum + value, 0);
  const totalMinutes = totalSessions * focusDuration;
  const thisWeekSessions = weekDays.reduce((sum, day) => sum + (focusHistory[day] || 0), 0);
  const activeDays = Object.keys(focusHistory).length;
  const completedTasks = tasks.filter((task) => task.completed).length;
  const taskCompletionRate = tasks.length ? Math.round((completedTasks / tasks.length) * 100) : 0;

  return (
    <motion.section
      className="h-full overflow-y-auto"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <div className="panel-section px-safe pb-nav pt-3 space-y-4">
        <article className="panel-card">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-[var(--color-primary-600)]" />
            <h2 className="font-display text-base text-[var(--text-strong)]">Phân tích học tập</h2>
          </div>
          <p className="mt-1 text-xs text-[var(--text-soft)]">
            Theo dõi tập trung, task và độ bền streak theo từng ngày.
          </p>
        </article>

        <div className="grid grid-cols-2 gap-2.5">
          <article className="panel-card !p-3 text-center">
            <Clock3 className="mx-auto h-4 w-4 text-[var(--color-accent-500)]" />
            <p className="mt-1 text-xl font-display text-[var(--text-strong)]">{totalMinutes}</p>
            <p className="text-[10px] text-[var(--text-soft)]">Tổng phút</p>
          </article>
          <article className="panel-card !p-3 text-center">
            <TrendingUp className="mx-auto h-4 w-4 text-emerald-600" />
            <p className="mt-1 text-xl font-display text-[var(--text-strong)]">{totalSessions}</p>
            <p className="text-[10px] text-[var(--text-soft)]">Tổng session</p>
          </article>
          <article className="panel-card !p-3 text-center">
            <CalendarDays className="mx-auto h-4 w-4 text-[var(--text-soft)]" />
            <p className="mt-1 text-xl font-display text-[var(--text-strong)]">{activeDays}</p>
            <p className="text-[10px] text-[var(--text-soft)]">Ngày hoạt động</p>
          </article>
          <article className="panel-card !p-3 text-center">
            <Trophy className="mx-auto h-4 w-4 text-amber-500" />
            <p className="mt-1 text-xl font-display text-[var(--text-strong)]">{currentStreak}</p>
            <p className="text-[10px] text-[var(--text-soft)]">Streak hiện tại</p>
          </article>
        </div>

        <article className="panel-card">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-display text-sm text-[var(--text-strong)]">7 ngày gần nhất</h3>
            <span className="chip-muted">{thisWeekSessions} phiên</span>
          </div>
          <WeeklyBars days={weekDays} history={focusHistory} />
        </article>

        <article className="panel-card">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="font-display text-sm text-[var(--text-strong)] flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-[var(--color-primary-600)]" />
              Ecosystem Score
            </h3>
            <span className="text-sm font-display text-[var(--color-primary-600)]">{ecosystemScore}%</span>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-white/50">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-[var(--color-primary-500)] to-[var(--color-primary-600)]"
              initial={{ width: 0 }}
              animate={{ width: `${ecosystemScore}%` }}
              transition={{ duration: 0.7 }}
            />
          </div>
          <p className="mt-2 text-xs text-[var(--text-soft)]">
            {ecosystemScore >= 70
              ? 'Bạn đang giữ nhịp học rất tốt.'
              : ecosystemScore >= 40
                ? 'Tiến trình ổn định, hãy giữ đều session mỗi ngày.'
                : 'Tăng thêm session ngắn mỗi ngày để cải thiện nhịp học.'}
          </p>
        </article>

        <article className="panel-card">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-display text-sm text-[var(--text-strong)]">Heatmap 12 tuần</h3>
            <span className="text-xs text-[var(--text-soft)]">Ít → Nhiều</span>
          </div>
          <div className="overflow-x-auto pb-1">
            <div className="flex min-w-fit gap-[4px]">
              {weeks.map((week, weekIndex) => (
                <div key={weekIndex} className="flex flex-col gap-[4px]">
                  {week.map((day) => (
                    <HeatCell key={day} date={day} value={focusHistory[day] || 0} />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </article>

        <article className="panel-card">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-display text-sm text-[var(--text-strong)] flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              Task completion
            </h3>
            <span className="chip-muted">{taskCompletionRate}%</span>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-white/50">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600"
              initial={{ width: 0 }}
              animate={{ width: `${taskCompletionRate}%` }}
              transition={{ duration: 0.6 }}
            />
          </div>
          <p className="mt-2 text-xs text-[var(--text-soft)]">
            Hoàn thành {completedTasks}/{tasks.length} task đã tạo.
          </p>
        </article>

        <article className="panel-card">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-display text-sm text-[var(--text-strong)] flex items-center gap-1.5">
              <Fish className="h-4 w-4 text-[var(--color-accent-500)]" />
              Bộ sưu tập cá
            </h3>
            <span className="chip-muted">{fishCaughtCount} cá</span>
          </div>
          <FishCollection />
        </article>

        <article className="panel-card">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-display text-sm text-[var(--text-strong)] flex items-center gap-1.5">
              <Target className="h-4 w-4 text-[var(--color-primary-600)]" />
              Nhật ký gần đây
            </h3>
          </div>
          <JournalPreview />
        </article>
      </div>
    </motion.section>
  );
}
