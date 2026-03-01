import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Play,
  Flame,
  Clock3,
  Target,
  CheckCircle2,
  CalendarClock,
  Sparkles,
  ChevronRight,
  ClipboardList,
} from 'lucide-react';
import { useStore, type Task } from '../store/useStore';
import { TaskManager } from '../components/TaskManager';
import { QuickNotes } from '../components/QuickNotes';

const PRIORITY_LABEL: Record<string, { text: string; color: string }> = {
  high: { text: 'Cao', color: 'text-rose-600' },
  medium: { text: 'TB', color: 'text-amber-600' },
  low: { text: 'Thấp', color: 'text-slate-500' },
};

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 5) return 'Đêm khuya rồi';
  if (hour < 12) return 'Chào buổi sáng';
  if (hour < 18) return 'Chào buổi chiều';
  return 'Chào buổi tối';
}

function formatDueLabel(task: Task) {
  if (!task.dueDate) return 'Không deadline';
  const [year, month, day] = task.dueDate.split('-').map(Number);
  const dueDate = new Date(year, month - 1, day);
  const today = new Date();
  const todayFloor = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const dueFloor = new Date(dueDate.getFullYear(), dueDate.getMonth(), dueDate.getDate());
  const diff = Math.round((dueFloor.getTime() - todayFloor.getTime()) / 86400000);

  if (diff < 0) return `Quá hạn ${Math.abs(diff)} ngày`;
  if (diff === 0) return 'Đến hạn hôm nay';
  if (diff === 1) return 'Đến hạn ngày mai';
  return dueDate.toLocaleDateString('vi-VN', { day: 'numeric', month: 'short' });
}

function LoadingSkeleton() {
  return (
    <div className="panel-section px-safe pb-nav pt-3">
      <div className="panel-card space-y-3">
        <div className="skeleton-block h-4 w-32" />
        <div className="skeleton-block h-7 w-52" />
        <div className="grid grid-cols-3 gap-2">
          <div className="skeleton-block h-16" />
          <div className="skeleton-block h-16" />
          <div className="skeleton-block h-16" />
        </div>
      </div>
      <div className="mt-4 grid grid-cols-1 gap-3">
        <div className="skeleton-block h-28" />
        <div className="skeleton-block h-28" />
      </div>
    </div>
  );
}

export function DashboardView() {
  const [isBooting, setIsBooting] = useState(true);
  const {
    currentStreak,
    focusHistory,
    focusDuration,
    fishCaughtCount,
    tasks,
    setCurrentView,
    dailyGoal,
    setShowDailyReview,
  } = useStore();

  useEffect(() => {
    const timer = window.setTimeout(() => setIsBooting(false), 260);
    return () => window.clearTimeout(timer);
  }, []);

  const today = new Date().toISOString().split('T')[0];
  const todaySessions = focusHistory[today] || 0;
  const todayMinutes = todaySessions * focusDuration;
  const goalProgress = Math.min(100, (todaySessions / dailyGoal) * 100);
  const activeTasks = tasks.filter((task) => !task.completed);
  const completedToday = tasks.filter((task) => task.completedAt?.startsWith(today)).length;
  const dueTasks = useMemo(
    () =>
      activeTasks
        .filter((task) => Boolean(task.dueDate))
        .sort((a, b) => {
          if (!a.dueDate || !b.dueDate) return 0;
          const [aYear, aMonth, aDay] = a.dueDate.split('-').map(Number);
          const [bYear, bMonth, bDay] = b.dueDate.split('-').map(Number);
          return new Date(aYear, aMonth - 1, aDay).getTime() - new Date(bYear, bMonth - 1, bDay).getTime();
        }),
    [activeTasks],
  );
  const checklist = [
    {
      id: 'first-session',
      text: 'Hoàn thành ít nhất 1 phiên focus',
      done: todaySessions >= 1,
    },
    {
      id: 'goal',
      text: `Đạt mục tiêu ${dailyGoal} phiên/ngày`,
      done: todaySessions >= dailyGoal,
    },
    {
      id: 'task-clear',
      text: 'Xử lý tất cả task đến hạn hôm nay',
      done: dueTasks.filter((task) => formatDueLabel(task) === 'Đến hạn hôm nay').length === 0,
    },
  ];

  const dueSoon = dueTasks.slice(0, 4);
  const progressLabel =
    goalProgress >= 100
      ? 'Mục tiêu hôm nay đã hoàn thành, tiếp tục giữ nhịp.'
      : `Còn ${Math.max(dailyGoal - todaySessions, 0)} phiên để chạm mục tiêu ngày.`;

  const hour = new Date().getHours();
  const showReflectionCard = hour >= 19;

  if (isBooting) {
    return (
      <div className="h-full overflow-y-auto">
        <LoadingSkeleton />
      </div>
    );
  }

  return (
    <motion.section
      className="h-full overflow-y-auto"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <div className="panel-section px-safe pb-nav pt-3 space-y-4">
        <article className="panel-card relative overflow-hidden">
          <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-[var(--color-primary-100)]/80" />
          <div className="absolute -bottom-10 -left-6 h-24 w-24 rounded-full bg-[#d9eaf8]/70" />

          <p className="text-sm text-[var(--text-soft)]">{getGreeting()} 🦫</p>
          <h2 className="mt-1 text-[1.35rem] font-display leading-tight text-[var(--text-strong)]">
            Hôm nay bạn muốn học gì?
          </h2>
          <p className="mt-1 text-xs text-[var(--text-soft)]">{progressLabel}</p>

          <div className="mt-4 flex items-center gap-4">
            <div className="relative h-[84px] w-[84px] shrink-0">
              <svg width="84" height="84" className="-rotate-90">
                <circle cx="42" cy="42" r="36" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="8" />
                <circle
                  cx="42"
                  cy="42"
                  r="36"
                  fill="none"
                  stroke="var(--color-primary-600)"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 36}
                  strokeDashoffset={2 * Math.PI * 36 * (1 - goalProgress / 100)}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-lg font-display text-[var(--text-strong)]">{todaySessions}</p>
                <p className="text-[10px] text-[var(--text-soft)]">/{dailyGoal} phiên</p>
              </div>
            </div>

            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <span className="chip-muted inline-flex items-center gap-1.5">
                  <Flame className="h-3.5 w-3.5 text-orange-500" />
                  {currentStreak} ngày
                </span>
                <span className="chip-muted inline-flex items-center gap-1.5">
                  <Clock3 className="h-3.5 w-3.5 text-[var(--color-accent-500)]" />
                  {todayMinutes} phút
                </span>
              </div>
              <button
                className="btn-primary flex w-full items-center justify-center gap-2 px-4 py-3 text-sm"
                onClick={() => setCurrentView('focus')}
              >
                <Play className="h-4 w-4" fill="currentColor" />
                Bắt đầu phiên tập trung
              </button>
            </div>
          </div>
        </article>

        <div className="grid grid-cols-3 gap-2.5">
          <article className="panel-card !p-3 text-center">
            <Target className="mx-auto h-4 w-4 text-[var(--color-primary-600)]" />
            <p className="mt-1 text-lg font-display text-[var(--text-strong)]">{dailyGoal}</p>
            <p className="text-[10px] text-[var(--text-soft)]">Mục tiêu ngày</p>
          </article>
          <article className="panel-card !p-3 text-center">
            <CheckCircle2 className="mx-auto h-4 w-4 text-emerald-600" />
            <p className="mt-1 text-lg font-display text-[var(--text-strong)]">{completedToday}</p>
            <p className="text-[10px] text-[var(--text-soft)]">Task đã xong</p>
          </article>
          <article className="panel-card !p-3 text-center">
            <Sparkles className="mx-auto h-4 w-4 text-amber-500" />
            <p className="mt-1 text-lg font-display text-[var(--text-strong)]">{fishCaughtCount}</p>
            <p className="text-[10px] text-[var(--text-soft)]">Fish total</p>
          </article>
        </div>

        <article className="panel-card">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-display text-sm text-[var(--text-strong)]">Checklist trong ngày</h3>
            <span className="text-xs text-[var(--text-soft)]">
              {checklist.filter((item) => item.done).length}/{checklist.length}
            </span>
          </div>
          <div className="space-y-2">
            {checklist.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-2 rounded-xl border border-white/60 bg-white/60 px-3 py-2"
              >
                <span
                  className={`inline-flex h-5 w-5 items-center justify-center rounded-full text-[11px] ${
                    item.done
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-[var(--color-primary-100)] text-[var(--color-primary-600)]'
                  }`}
                >
                  {item.done ? '✓' : '•'}
                </span>
                <p className={`text-xs ${item.done ? 'text-emerald-800' : 'text-[var(--text-soft)]'}`}>{item.text}</p>
              </div>
            ))}
          </div>
        </article>

        <article className="panel-card">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-display text-sm text-[var(--text-strong)]">Task sắp đến hạn</h3>
            <button
              className="inline-flex items-center gap-1 text-xs font-medium text-[var(--color-primary-600)]"
              onClick={() => setCurrentView('stats')}
            >
              Xem tiến độ <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {dueSoon.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/70 bg-white/45 px-3 py-5 text-center">
              <ClipboardList className="mx-auto h-5 w-5 text-[var(--text-soft)]" />
              <p className="mt-1 text-sm text-[var(--text-soft)]">Chưa có deadline gần. Bạn đang kiểm soát tốt.</p>
            </div>
          ) : (
            <ul className="space-y-2">
              {dueSoon.map((task) => {
                const dueText = formatDueLabel(task);
                const priority = PRIORITY_LABEL[task.priority] ?? PRIORITY_LABEL.medium;
                return (
                  <li
                    key={task.id}
                    className="flex items-start gap-2.5 rounded-xl border border-white/60 bg-white/55 px-3 py-2.5"
                  >
                    <CalendarClock className="mt-0.5 h-4 w-4 text-[var(--color-primary-600)]" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-[var(--text-strong)]">{task.title}</p>
                      <p className="mt-0.5 text-xs text-[var(--text-soft)]">{task.subject}</p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p
                        className={`text-xs font-semibold ${
                          dueText.includes('Quá hạn')
                            ? 'text-rose-600'
                            : dueText.includes('hôm nay')
                              ? 'text-amber-600'
                              : 'text-[var(--text-soft)]'
                        }`}
                      >
                        {dueText}
                      </p>
                      <p className={`text-[10px] ${priority.color}`}>Ưu tiên {priority.text}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </article>

        <article className="panel-card">
          <TaskManager compact />
        </article>

        <article className="panel-card">
          <QuickNotes compact />
        </article>

        {showReflectionCard && (
          <article className="panel-card bg-[linear-gradient(120deg,rgba(255,255,255,0.9),rgba(235,246,255,0.72))]">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.14em] text-[var(--text-soft)]">Daily review</p>
                <h3 className="mt-1 text-base font-display text-[var(--text-strong)]">Hôm nay ổn chứ?</h3>
                <p className="mt-1 text-sm text-[var(--text-soft)]">
                  Bạn đã focus {todayMinutes} phút và hoàn thành {completedToday} task.
                </p>
              </div>
              <span className="text-2xl">🌙</span>
            </div>
            <button
              className="btn-soft mt-3 w-full px-4 py-2.5 text-sm"
              onClick={() => setShowDailyReview(true)}
            >
              Mở tổng kết cuối ngày
            </button>
          </article>
        )}
      </div>
    </motion.section>
  );
}
