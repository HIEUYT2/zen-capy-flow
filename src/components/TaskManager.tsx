import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Check, Trash2, Flag, ChevronDown, ChevronUp, Calendar } from 'lucide-react';
import { useStore, type Task, type TaskPriority } from '../store/useStore';

const SUBJECT_COLORS: Record<string, string> = {
  'Toán': '#6C8EBF',
  'Lý': '#E8884F',
  'Hóa': '#82B366',
  'Văn': '#D4A0C0',
  'Anh': '#E6B655',
  'Sử': '#B07D62',
  'Địa': '#7AA874',
  'CNTT': '#7B68EE',
  'Khác': '#9CA3AF',
};

const PRIORITY_CONFIG: Record<TaskPriority, { color: string; label: string }> = {
  high: { color: '#EF4444', label: 'Cao' },
  medium: { color: '#F59E0B', label: 'Trung bình' },
  low: { color: '#6B7280', label: 'Thấp' },
};

function AddTaskForm({ onClose }: { onClose: () => void }) {
  const { addTask } = useStore();
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('Khác');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [dueDate, setDueDate] = useState('');

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
    onClose();
  };

  return (
    <motion.form
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="overflow-hidden"
      onSubmit={handleSubmit}
    >
      <div className="glass p-3 space-y-3 mt-2">
        {/* Title */}
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Tên công việc..."
          className="w-full px-3 py-2.5 bg-white/30 rounded-xl border border-white/20 text-sm
            text-[var(--warm-brown-dark)] placeholder:text-[var(--warm-brown)]/40
            focus:outline-none focus:ring-2 focus:ring-[var(--sage-green)]/50"
          autoFocus
        />

        {/* Subject tags */}
        <div className="flex flex-wrap gap-1.5">
          {Object.entries(SUBJECT_COLORS).map(([name, color]) => (
            <button
              key={name}
              type="button"
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                subject === name
                  ? 'text-white shadow-sm scale-105'
                  : 'text-[var(--warm-brown)] bg-white/20 hover:bg-white/30'
              }`}
              style={subject === name ? { backgroundColor: color } : {}}
              onClick={() => setSubject(name)}
            >
              {name}
            </button>
          ))}
        </div>

        {/* Priority & Due date row */}
        <div className="flex gap-2">
          <div className="flex gap-1 flex-1">
            {(Object.keys(PRIORITY_CONFIG) as TaskPriority[]).map((p) => (
              <button
                key={p}
                type="button"
                className={`flex-1 flex items-center justify-center gap-1 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                  priority === p
                    ? 'text-white shadow-sm'
                    : 'bg-white/15 text-[var(--warm-brown)]/70'
                }`}
                style={priority === p ? { backgroundColor: PRIORITY_CONFIG[p].color } : {}}
                onClick={() => setPriority(p)}
              >
                <Flag className="w-3 h-3" />
                {PRIORITY_CONFIG[p].label}
              </button>
            ))}
          </div>
        </div>

        {/* Due date */}
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-[var(--warm-brown)]/60" />
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="flex-1 px-3 py-2 bg-white/20 rounded-xl border border-white/10 text-xs
              text-[var(--warm-brown-dark)] focus:outline-none focus:ring-2 focus:ring-[var(--sage-green)]/50"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl bg-white/15 text-sm font-medium text-[var(--warm-brown)]/70 cursor-pointer active:scale-95 transition-transform"
          >
            Hủy
          </button>
          <button
            type="submit"
            disabled={!title.trim()}
            className="flex-1 py-2.5 rounded-xl bg-[var(--sage-green)] text-white text-sm font-medium cursor-pointer 
              active:scale-95 transition-transform disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Thêm
          </button>
        </div>
      </div>
    </motion.form>
  );
}

function TaskItem({ task }: { task: Task }) {
  const { toggleTask, deleteTask } = useStore();
  const isOverdue = task.dueDate && !task.completed && new Date(task.dueDate) < new Date();
  const subjectColor = SUBJECT_COLORS[task.subject] || SUBJECT_COLORS['Khác'];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 10, height: 0 }}
      className={`flex items-center gap-3 p-3 rounded-2xl transition-all ${
        task.completed ? 'bg-white/5 opacity-60' : 'bg-white/15'
      }`}
    >
      {/* Checkbox */}
      <motion.button
        className={`w-6 h-6 min-w-[24px] rounded-full border-2 flex items-center justify-center cursor-pointer transition-colors ${
          task.completed
            ? 'bg-[var(--sage-green)] border-[var(--sage-green)]'
            : 'border-[var(--warm-brown)]/30 hover:border-[var(--sage-green)]'
        }`}
        onClick={() => toggleTask(task.id)}
        whileTap={{ scale: 0.8 }}
      >
        {task.completed && <Check className="w-3.5 h-3.5 text-white" />}
      </motion.button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p
          className={`text-sm font-medium leading-snug ${
            task.completed
              ? 'line-through text-[var(--warm-brown)]/40'
              : 'text-[var(--warm-brown-dark)]'
          }`}
        >
          {task.title}
        </p>
        <div className="flex items-center gap-2 mt-1">
          <span
            className="text-[10px] px-1.5 py-0.5 rounded-md text-white font-medium"
            style={{ backgroundColor: subjectColor }}
          >
            {task.subject}
          </span>
          {task.dueDate && (
            <span
              className={`text-[10px] ${
                isOverdue ? 'text-red-400 font-semibold' : 'text-[var(--warm-brown)]/50'
              }`}
            >
              {isOverdue ? '⚠️ ' : ''}
              {new Date(task.dueDate).toLocaleDateString('vi-VN', {
                day: 'numeric',
                month: 'short',
              })}
            </span>
          )}
          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: PRIORITY_CONFIG[task.priority].color }} />
        </div>
      </div>

      {/* Delete */}
      <motion.button
        className="w-8 h-8 rounded-xl flex items-center justify-center text-[var(--warm-brown)]/30 hover:text-red-400 hover:bg-red-400/10 transition-colors cursor-pointer"
        onClick={() => deleteTask(task.id)}
        whileTap={{ scale: 0.85 }}
      >
        <Trash2 className="w-3.5 h-3.5" />
      </motion.button>
    </motion.div>
  );
}

interface TaskManagerProps {
  compact?: boolean; // For dashboard preview
}

export function TaskManager({ compact = false }: TaskManagerProps) {
  const { tasks } = useStore();
  const [showForm, setShowForm] = useState(false);
  const [showCompleted, setShowCompleted] = useState(false);

  const activeTasks = tasks.filter((t) => !t.completed);
  const completedTasks = tasks.filter((t) => t.completed);
  const displayTasks = compact ? activeTasks.slice(0, 3) : activeTasks;

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-display text-[var(--warm-brown-dark)] tracking-wide">
          📋 Công việc {activeTasks.length > 0 && (
            <span className="text-[var(--warm-brown)]/50 font-normal">({activeTasks.length})</span>
          )}
        </h3>
        <motion.button
          className="w-8 h-8 rounded-xl bg-[var(--sage-green)]/20 flex items-center justify-center text-[var(--sage-green)] cursor-pointer"
          onClick={() => setShowForm(!showForm)}
          whileTap={{ scale: 0.9 }}
          animate={{ rotate: showForm ? 45 : 0 }}
        >
          <Plus className="w-4 h-4" />
        </motion.button>
      </div>

      {/* Add form */}
      <AnimatePresence>{showForm && <AddTaskForm onClose={() => setShowForm(false)} />}</AnimatePresence>

      {/* Task list */}
      <div className="space-y-2 mt-2">
        <AnimatePresence mode="popLayout">
          {displayTasks.length === 0 && !showForm && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-sm text-[var(--warm-brown)]/40 py-4"
            >
              Chưa có công việc nào 🎉
            </motion.p>
          )}
          {displayTasks.map((task) => (
            <TaskItem key={task.id} task={task} />
          ))}
        </AnimatePresence>
      </div>

      {/* Compact mode "show all" link */}
      {compact && activeTasks.length > 3 && (
        <p className="text-center text-xs text-[var(--sage-green)] font-medium mt-2 cursor-pointer">
          Xem tất cả ({activeTasks.length}) →
        </p>
      )}

      {/* Completed section (full mode only) */}
      {!compact && completedTasks.length > 0 && (
        <div className="mt-4">
          <button
            className="flex items-center gap-1.5 text-xs text-[var(--warm-brown)]/50 font-medium cursor-pointer mb-2"
            onClick={() => setShowCompleted(!showCompleted)}
          >
            {showCompleted ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            Đã xong ({completedTasks.length})
          </button>
          <AnimatePresence>
            {showCompleted && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-2 overflow-hidden"
              >
                {completedTasks.map((task) => (
                  <TaskItem key={task.id} task={task} />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
