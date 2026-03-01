import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, Plus, StickyNote, Trash2 } from 'lucide-react';
import { useStore, type QuickNote } from '../store/useStore';

function NoteRow({ note }: { note: QuickNote }) {
  const { toggleNoteCheck, deleteNote } = useStore();

  return (
    <motion.div
      layout
      className="flex items-start gap-2.5 rounded-xl border border-white/60 bg-white/55 px-3 py-2.5"
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
    >
      {note.isChecklist ? (
        <button
          className={`mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-md border-2 ${
            note.checked
              ? 'border-[var(--color-primary-600)] bg-[var(--color-primary-600)] text-white'
              : 'border-[var(--color-primary-500)]/60 text-transparent'
          }`}
          onClick={() => toggleNoteCheck(note.id)}
          aria-label={note.checked ? 'Bỏ chọn ghi chú' : 'Đánh dấu hoàn thành ghi chú'}
        >
          <Check className="h-3 w-3" />
        </button>
      ) : (
        <span className="mt-2 inline-block h-2 w-2 rounded-full bg-[var(--color-primary-500)]" />
      )}

      <p className={`flex-1 text-sm leading-relaxed ${note.checked ? 'text-[var(--text-soft)] line-through' : 'text-[var(--text-strong)]'}`}>
        {note.text}
      </p>

      <button
        className="inline-flex h-7 w-7 items-center justify-center rounded-lg text-[var(--text-soft)] hover:bg-rose-100 hover:text-rose-600"
        onClick={() => deleteNote(note.id)}
        aria-label="Xóa ghi chú"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    </motion.div>
  );
}

interface QuickNotesProps {
  compact?: boolean;
}

export function QuickNotes({ compact = false }: QuickNotesProps) {
  const { quickNotes, addNote } = useStore();
  const [showInput, setShowInput] = useState(false);
  const [text, setText] = useState('');
  const [isChecklist, setIsChecklist] = useState(false);
  const [expandCompact, setExpandCompact] = useState(false);

  const notes = compact && !expandCompact ? quickNotes.slice(0, 4) : quickNotes;

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!text.trim()) return;
    addNote({ text: text.trim(), isChecklist });
    setText('');
  };

  return (
    <section>
      <header className="mb-3 flex items-center justify-between">
        <div>
          <h3 className="font-display text-sm text-[var(--text-strong)] flex items-center gap-1.5">
            <StickyNote className="h-4 w-4 text-[var(--color-accent-500)]" />
            Quick Notes
          </h3>
          <p className="text-xs text-[var(--text-soft)]">{quickNotes.length} ghi chú cá nhân</p>
        </div>
        <button
          className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-[#dfeefd] text-[var(--color-accent-500)]"
          onClick={() => setShowInput((prev) => !prev)}
          aria-label={showInput ? 'Đóng form ghi chú' : 'Mở form ghi chú'}
        >
          <motion.span animate={{ rotate: showInput ? 45 : 0 }}>
            <Plus className="h-4 w-4" />
          </motion.span>
        </button>
      </header>

      <AnimatePresence>
        {showInput && (
          <motion.form
            className="mb-3 overflow-hidden rounded-2xl border border-white/65 bg-white/55 p-3.5"
            onSubmit={submit}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <input
              type="text"
              value={text}
              onChange={(event) => setText(event.target.value)}
              placeholder="Ví dụ: Tối xem lại đề cũ"
              className="input-shell w-full text-sm"
              maxLength={180}
              autoFocus
              aria-label="Nội dung ghi chú"
            />
            <div className="mt-2 flex items-center justify-between">
              <label className="inline-flex items-center gap-2 text-xs text-[var(--text-soft)]">
                <input
                  type="checkbox"
                  checked={isChecklist}
                  onChange={(event) => setIsChecklist(event.target.checked)}
                  className="h-4 w-4 min-h-0 min-w-0 accent-[var(--color-primary-600)]"
                />
                Dùng dạng checklist
              </label>
              <button className="btn-primary px-3 py-2 text-xs disabled:opacity-45" disabled={!text.trim()} type="submit">
                Thêm ghi chú
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      <div className="space-y-2">
        <AnimatePresence mode="popLayout">
          {notes.length === 0 && !showInput && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-xl border border-dashed border-white/65 bg-white/45 py-4 text-center text-sm text-[var(--text-soft)]"
            >
              Chưa có ghi chú, lưu nhanh một ý quan trọng.
            </motion.p>
          )}
          {notes.map((note) => (
            <NoteRow key={note.id} note={note} />
          ))}
        </AnimatePresence>
      </div>

      {compact && quickNotes.length > 4 && (
        <button className="mt-2 text-xs font-semibold text-[var(--color-accent-500)]" onClick={() => setExpandCompact((prev) => !prev)}>
          {expandCompact ? 'Thu gọn' : `Xem thêm ${quickNotes.length - 4} ghi chú`}
        </button>
      )}
    </section>
  );
}
