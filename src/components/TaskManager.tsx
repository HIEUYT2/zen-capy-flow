import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Calendar, Check, ChevronDown, ChevronUp, Flag, Plus, Trash2 } from 'lucide-react';
import { useStore, type Task, type TaskPriority } from '../store/useStore';

const SUBJECT_COLORS: Record<string, string> = {
  Toán: '#7C9CC4',
  Lý: '#E29A5F',
  Hóa: '#78A876',
  Văn: '#C88CB2',
  Anh: '#D7AD4B',
  Sử: '#AF7A5A',
  Địa: '#6D9A6A',
  CNTT: '#7E78D6',
  Khác: '#8E98A8',
};

const SUBJECT_OPTIONS = [
  { label: 'Toán', value: 'Toán' },
  { label: 'Lý', value: 'Lý' },
  { label: 'Hóa', value: 'Hóa' },
  { label: 'Văn', value: 'Văn' },
  { label: 'Anh', value: 'Anh' },
  { label: 'Sử', value: 'Sử' },
  { label: 'Địa', value: 'Địa' },
  { label: 'CNTT', value: 'CNTT' },
  { label: 'Khác', value: 'Khác' },
];

const PRIORITY_CONFIG: Record<TaskPriority, { color: string; label: string; order: number }> = {
  high: { color: '#E5484D', label: 'Cao', order: 1 },
  medium: { color: '#D97706', label: 'TB', order: 2 },
  low: { color: '#64748B', label: 'Thấp', order: 3 },
};

function parseDate(value: string) {
  const [year, month, day] = value.split('-').map(Number);
  return new Date(year, month - 1, day);
}

function AddTaskForm({ onClose }: { onClose: () => void }) {
  const { addTask } = useStore();
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('Khác');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [dueDate, setDueDate] = useState('');

  const today = new Date().toISOString().split('T')[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    addTask({
      title: title.trim(),
      subject,
      priority,
      dueDate: dueDate || undefined,
    });
    setTitle('');
    setDueDate('');
    onClose();
  };

  return (
    <motion.form
      className="overflow-hidden"
      onSubmit={handleSubmit}
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
    >
      <div className="mt-2 rounded-2xl border border-white/60 bg-white/55 p-3.5 space-y-3">
        <input
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Ví dụ: Ôn chương 4 đại số"
          className="input-shell w-full text-sm"
          maxLength={90}
          autoFocus
          aria-label="Tên công việc"
        />

        <div className="flex flex-wrap gap-1.5">
          {SUBJECT_OPTIONS.map((item) => (
            <button
              key={item.value}
              type="button"
              className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${
                subject === item.value
                  ? 'text-white shadow-sm'
                  : 'bg-white/65 text-[var(--text-soft)]'
              }`}
              style={subject === item.value ? { backgroundColor: SUBJECT_COLORS[item.value] } : undefined}
              onClick={() => setSubject(item.value)}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-1.5">
          {(Object.keys(PRIORITY_CONFIG) as TaskPriority[]).map((level) => (
            <button
              key={level}
              type="button"
              className={`rounded-lg px-2 py-2 text-xs font-medium ${
                priority === level ? 'text-white' : 'bg-white/65 text-[var(--text-soft)]'
              }`}
              style={priority === level ? { backgroundColor: PRIORITY_CONFIG[level].color } : undefined}
              onClick={() => setPriority(level)}
            >
              <Flag className="mr-1 inline h-3 w-3" />
              {PRIORITY_CONFIG[level].label}
            </button>
          ))}
        </div>

        <label className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-[var(--text-soft)]" />
          <input
            type="date"
            min={today}
            value={dueDate}
            onChange={(event) => setDueDate(event.target.value)}
            className="input-shell w-full text-xs"
            aria-label="Hạn chót"
          />
        </label>

        <div className="grid grid-cols-2 gap-2">
          <button type="button" className="btn-soft px-3 py-2.5 text-sm" onClick={onClose}>
            Hủy
          </button>
          <button type="submit" className="btn-primary px-3 py-2.5 text-sm disabled:opacity-45" disabled={!title.trim()}>
            Lưu task
          </button>
        </div>
      </div>
    </motion.form>
  );
}

function TaskItem({ task }: { task: Task }) {
  const { toggleTask, deleteTask } = useStore();
  const isOverdue =
    task.dueDate ? parseDate(task.dueDate) < new Date(new Date().toDateString()) && !task.completed : false;
  const subjectColor = SUBJECT_COLORS[task.subject] ?? SUBJECT_COLORS.Khác;
  const priority = PRIORITY_CONFIG[task.priority];

  return (
    <motion.div
      layout
      className={`flex items-start gap-3 rounded-2xl border px-3 py-2.5 ${
        task.completed ? 'border-white/50 bg-white/35 opacity-70' : 'border-white/65 bg-white/55'
      }`}
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 8, height: 0 }}
    >
      <button
        aria-label={task.completed ? 'Đánh dấu chưa hoàn thành' : 'Đánh dấu hoàn thành'}
        className={`mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full border-2 ${
          task.completed
            ? 'border-[var(--color-primary-600)] bg-[var(--color-primary-600)] text-white'
            : 'border-[var(--color-primary-500)]/55 text-transparent'
        }`}
        onClick={() => toggleTask(task.id)}
      >
        <Check className="h-3.5 w-3.5" />
      </button>

      <div className="min-w-0 flex-1">
        <p className={`text-sm font-medium leading-snug ${task.completed ? 'line-through text-[var(--text-soft)]' : 'text-[var(--text-strong)]'}`}>
          {task.title}
        </p>
        <div className="mt-1 flex flex-wrap items-center gap-1.5">
          <span className="rounded-md px-1.5 py-0.5 text-[10px] font-semibold text-white" style={{ backgroundColor: subjectColor }}>
            {SUBJECT_OPTIONS.find((item) => item.value === task.subject)?.label ?? 'Khác'}
          </span>
          {task.dueDate && (
            <span className={`text-[10px] ${isOverdue ? 'font-semibold text-rose-600' : 'text-[var(--text-soft)]'}`}>
              {isOverdue ? 'Quá hạn' : 'Đến hạn'} {parseDate(task.dueDate).toLocaleDateString('vi-VN', { day: 'numeric', month: 'short' })}
            </span>
          )}
          <span className={`text-[10px] font-semibold ${priority.color}`}>Ưu tiên {priority.label}</span>
        </div>
      </div>

      <button
        aria-label="Xóa công việc"
        className="inline-flex h-8 w-8 items-center justify-center rounded-xl text-[var(--text-soft)] hover:bg-rose-100 hover:text-rose-600"
        onClick={() => deleteTask(task.id)}
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </motion.div>
  );
}

function sortTasks(a: Task, b: Task) {
  if (a.dueDate && b.dueDate) {
    const dueDiff = parseDate(a.dueDate).getTime() - parseDate(b.dueDate).getTime();
    if (dueDiff !== 0) return dueDiff;
  } else if (a.dueDate && !b.dueDate) {
    return -1;
  } else if (!a.dueDate && b.dueDate) {
    return 1;
  }

  const priorityDiff = PRIORITY_CONFIG[a.priority].order - PRIORITY_CONFIG[b.priority].order;
  if (priorityDiff !== 0) return priorityDiff;

  return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
}

interface TaskManagerProps {
  compact?: boolean;
}

export function TaskManager({ compact = false }: TaskManagerProps) {
  const { tasks } = useStore();
  const [showForm, setShowForm] = useState(false);
  const [showCompleted, setShowCompleted] = useState(false);
  const [expandCompact, setExpandCompact] = useState(false);

  const activeTasks = useMemo(() => tasks.filter((task) => !task.completed).slice().sort(sortTasks), [tasks]);
  const completedTasks = useMemo(() => tasks.filter((task) => task.completed).slice().sort(sortTasks), [tasks]);
  const visibleTasks = compact && !expandCompact ? activeTasks.slice(0, 3) : activeTasks;

  return (
    <section>
      <header className="mb-3 flex items-center justify-between">
        <div>
          <h3 className="font-display text-sm text-[var(--text-strong)]">Task học tập</h3>
          <p className="text-xs text-[var(--text-soft)]">{activeTasks.length} task chưa hoàn thành</p>
        </div>
        <button
          className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--color-primary-100)] text-[var(--color-primary-600)]"
          onClick={() => setShowForm((prev) => !prev)}
          aria-label={showForm ? 'Đóng form thêm task' : 'Mở form thêm task'}
        >
          <motion.span animate={{ rotate: showForm ? 45 : 0 }}>
            <Plus className="h-4 w-4" />
          </motion.span>
        </button>
      </header>

      <AnimatePresence>{showForm && <AddTaskForm onClose={() => setShowForm(false)} />}</AnimatePresence>

      <div className="mt-2 space-y-2">
        <AnimatePresence mode="popLayout">
          {visibleTasks.length === 0 && !showForm && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-xl border border-dashed border-white/65 bg-white/45 py-4 text-center text-sm text-[var(--text-soft)]"
            >
              Chưa có task, thêm một việc để bắt đầu.
            </motion.p>
          )}
          {visibleTasks.map((task) => (
            <TaskItem key={task.id} task={task} />
          ))}
        </AnimatePresence>
      </div>

      {compact && activeTasks.length > 3 && (
        <button
          className="mt-2 text-xs font-semibold text-[var(--color-primary-600)]"
          onClick={() => setExpandCompact((prev) => !prev)}
        >
          {expandCompact ? 'Thu gọn' : `Xem thêm ${activeTasks.length - 3} task`}
        </button>
      )}

      {!compact && completedTasks.length > 0 && (
        <div className="mt-4">
          <button
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--text-soft)]"
            onClick={() => setShowCompleted((prev) => !prev)}
          >
            {showCompleted ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
            Đã hoàn thành ({completedTasks.length})
          </button>
          <AnimatePresence>
            {showCompleted && (
              <motion.div
                className="mt-2 space-y-2 overflow-hidden"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                {completedTasks.map((task) => (
                  <TaskItem key={task.id} task={task} />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </section>
  );
}
