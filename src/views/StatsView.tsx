import { motion } from 'framer-motion';
import { useMemo, memo } from 'react';
import { BarChart3, Fish, Clock, CalendarDays, TrendingUp, Award } from 'lucide-react';
import { useStore } from '../store/useStore';

// ============ HEATMAP ============
function getLastNDays(n: number): string[] {
  const days: string[] = [];
  for (let i = n - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    days.push(date.toISOString().split('T')[0]);
  }
  return days;
}

function getColorIntensity(count: number): string {
  if (count === 0) return 'bg-white/10';
  if (count === 1) return 'bg-[var(--sage-light)]';
  if (count === 2) return 'bg-[var(--sage-green)]';
  if (count >= 3) return 'bg-[var(--sage-dark)]';
  return 'bg-white/10';
}

const CalendarCell = memo(function CalendarCell({ date, count }: { date: string; count: number }) {
  const displayDate = new Date(date).toLocaleDateString('vi-VN', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
  return (
    <motion.div
      className={`w-3.5 h-3.5 rounded-[3px] ${getColorIntensity(count)} cursor-default`}
      whileHover={{ scale: 1.5 }}
      title={`${displayDate}: ${count} phiên`}
    />
  );
});

// ============ FISH GALLERY ============
function FishCollection() {
  const { fishCollection } = useStore();
  const uniqueFish = useMemo(() => {
    const map = new Map<string, { name: string; emoji: string; count: number; rarity: string }>();
    fishCollection.forEach((f) => {
      const existing = map.get(f.name);
      if (existing) {
        existing.count++;
      } else {
        map.set(f.name, { name: f.name, emoji: f.emoji, count: 1, rarity: f.rarity });
      }
    });
    return Array.from(map.values()).sort((a, b) => b.count - a.count);
  }, [fishCollection]);

  const rarityColor: Record<string, string> = {
    common: 'text-[var(--warm-brown)]/50',
    rare: 'text-[var(--soft-blue)]',
    legendary: 'text-amber-400',
  };

  if (uniqueFish.length === 0) {
    return (
      <div className="text-center py-6">
        <span className="text-3xl block mb-2">🎣</span>
        <p className="text-sm text-[var(--warm-brown)]/40">Chưa câu được cá nào</p>
        <p className="text-xs text-[var(--warm-brown)]/30 mt-1">Hoàn thành phiên tập trung để câu cá!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
      {uniqueFish.map((fish) => (
        <motion.div
          key={fish.name}
          className="bg-white/10 rounded-2xl p-2.5 text-center"
          whileHover={{ scale: 1.05 }}
          title={`${fish.name} (${fish.rarity})`}
        >
          <div className="text-2xl mb-0.5">{fish.emoji}</div>
          <div className={`text-[10px] font-medium ${rarityColor[fish.rarity] || ''}`}>×{fish.count}</div>
        </motion.div>
      ))}
    </div>
  );
}

// ============ JOURNAL LIST ============
function JournalList() {
  const { journalEntries } = useStore();
  const recent = journalEntries.slice().reverse().slice(0, 10);

  if (recent.length === 0) {
    return (
      <div className="text-center py-6">
        <span className="text-3xl block mb-2">📔</span>
        <p className="text-sm text-[var(--warm-brown)]/40">Nhật ký trống</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {recent.map((entry) => {
        const date = new Date(entry.date).toLocaleDateString('vi-VN', {
          day: 'numeric',
          month: 'short',
          weekday: 'short',
        });
        return (
          <div key={entry.id} className="bg-white/10 rounded-2xl p-3 flex items-center gap-3">
            <span className="text-2xl shrink-0">{entry.scene}</span>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-[var(--warm-brown)]/50">{date}</p>
              <p className="text-sm text-[var(--warm-brown)] leading-snug mt-0.5 line-clamp-1">
                {entry.quote}
              </p>
            </div>
            <div className="text-right shrink-0">
              <span className="text-lg">{entry.fishCaught}</span>
              <div className="text-[10px] text-[var(--warm-brown)]/40">{entry.duration}p</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ============ MAIN STATS VIEW ============
export function StatsView() {
  const { focusHistory, ecosystemScore, fishCaughtCount, fishCollection, journalEntries, focusDuration } = useStore();

  // Generated data
  const days = useMemo(() => getLastNDays(84), []);
  const weeks: string[][] = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  // Stats
  const totalSessions = Object.values(focusHistory).reduce((a: number, b: number) => a + b, 0);
  const activeDays = Object.keys(focusHistory).length;
  const totalMinutes = totalSessions * focusDuration;
  const thisWeek = days.slice(-7).reduce((sum, day) => sum + (focusHistory[day] || 0), 0);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.06 } },
  };
  const item = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  return (
    <motion.div
      className="w-full h-full overflow-y-auto overflow-x-hidden pb-24"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <div className="max-w-lg mx-auto px-4 pt-2 space-y-4">
        {/* Header */}
        <motion.div variants={item} className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-[var(--sage-green)]" />
          <h1 className="text-xl font-display text-[var(--warm-brown-dark)]">Thống kê</h1>
        </motion.div>

        {/* Overview Stats */}
        <motion.div variants={item} className="grid grid-cols-2 gap-2.5">
          <div className="glass p-3 text-center">
            <Clock className="w-4 h-4 mx-auto mb-1 text-[var(--soft-blue)]" />
            <div className="text-2xl font-display text-[var(--warm-brown-dark)]">{totalMinutes}</div>
            <div className="text-[10px] text-[var(--warm-brown)]/50">Tổng phút</div>
          </div>
          <div className="glass p-3 text-center">
            <TrendingUp className="w-4 h-4 mx-auto mb-1 text-[var(--sage-green)]" />
            <div className="text-2xl font-display text-[var(--warm-brown-dark)]">{totalSessions}</div>
            <div className="text-[10px] text-[var(--warm-brown)]/50">Tổng phiên</div>
          </div>
          <div className="glass p-3 text-center">
            <CalendarDays className="w-4 h-4 mx-auto mb-1 text-[var(--warm-brown)]" />
            <div className="text-2xl font-display text-[var(--warm-brown-dark)]">{activeDays}</div>
            <div className="text-[10px] text-[var(--warm-brown)]/50">Ngày hoạt động</div>
          </div>
          <div className="glass p-3 text-center">
            <Award className="w-4 h-4 mx-auto mb-1 text-amber-500" />
            <div className="text-2xl font-display text-[var(--warm-brown-dark)]">{thisWeek}</div>
            <div className="text-[10px] text-[var(--warm-brown)]/50">Tuần này</div>
          </div>
        </motion.div>

        {/* Ecosystem Score */}
        <motion.div variants={item} className="glass-strong p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-[var(--warm-brown)]">Ecosystem Score</span>
            <span className="text-sm font-display text-[var(--sage-green)]">{ecosystemScore}%</span>
          </div>
          <div className="h-3 bg-white/15 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-[var(--sage-light)] to-[var(--sage-green)] rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${ecosystemScore}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </div>
          <p className="text-xs text-[var(--warm-brown)]/50 mt-1.5">
            {ecosystemScore >= 70 ? '🌸 Hệ sinh thái đang nở hoa!' :
             ecosystemScore >= 40 ? '🌿 Đang phát triển tốt' :
             '🌱 Cần chăm chỉ hơn nữa'}
          </p>
        </motion.div>

        {/* Heatmap */}
        <motion.div variants={item} className="glass-strong p-4">
          <h3 className="text-sm font-display text-[var(--warm-brown-dark)] mb-3">📅 Lịch sử học tập</h3>
          <div className="overflow-x-auto pb-2 -mx-1 px-1">
            <div className="flex gap-[3px] min-w-fit">
              {weeks.map((week, weekIndex) => (
                <div key={weekIndex} className="flex flex-col gap-[3px]">
                  {week.map((day) => (
                    <CalendarCell key={day} date={day} count={focusHistory[day] || 0} />
                  ))}
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-end gap-2 mt-3 text-[10px] text-[var(--warm-brown)]/50">
            <span>Ít</span>
            <div className="flex gap-[3px]">
              <div className="w-3 h-3 rounded-[3px] bg-white/10" />
              <div className="w-3 h-3 rounded-[3px] bg-[var(--sage-light)]" />
              <div className="w-3 h-3 rounded-[3px] bg-[var(--sage-green)]" />
              <div className="w-3 h-3 rounded-[3px] bg-[var(--sage-dark)]" />
            </div>
            <span>Nhiều</span>
          </div>
        </motion.div>

        {/* Fish Collection */}
        <motion.div variants={item} className="glass-strong p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-display text-[var(--warm-brown-dark)]">🐠 Bộ sưu tập cá</h3>
            <span className="text-xs text-[var(--warm-brown)]/50">
              <Fish className="w-3 h-3 inline mr-0.5" />{fishCaughtCount} tổng
            </span>
          </div>
          <FishCollection />
        </motion.div>

        {/* Journal */}
        <motion.div variants={item} className="glass-strong p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-display text-[var(--warm-brown-dark)]">📔 Nhật ký</h3>
            <span className="text-xs text-[var(--warm-brown)]/50">{journalEntries.length} trang</span>
          </div>
          <JournalList />
        </motion.div>

        <div className="h-4" />
      </div>
    </motion.div>
  );
}
