import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Check, StickyNote } from 'lucide-react';
import { useStore, type QuickNote } from '../store/useStore';

function NoteItem({ note }: { note: QuickNote }) {
  const { toggleNoteCheck, deleteNote } = useStore();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="flex items-start gap-2.5 group"
    >
      {note.isChecklist ? (
        <motion.button
          className={`mt-0.5 w-5 h-5 min-w-[20px] rounded-md border-2 flex items-center justify-center cursor-pointer transition-colors ${
            note.checked
              ? 'bg-[var(--sage-green)] border-[var(--sage-green)]'
              : 'border-[var(--warm-brown)]/25 hover:border-[var(--sage-green)]'
          }`}
          onClick={() => toggleNoteCheck(note.id)}
          whileTap={{ scale: 0.8 }}
        >
          {note.checked && <Check className="w-3 h-3 text-white" />}
        </motion.button>
      ) : (
        <div className="mt-1.5 w-2 h-2 min-w-[8px] rounded-full bg-[var(--sage-green)]/60" />
      )}
      <p
        className={`flex-1 text-sm leading-relaxed ${
          note.checked
            ? 'line-through text-[var(--warm-brown)]/30'
            : 'text-[var(--warm-brown-dark)]'
        }`}
      >
        {note.text}
      </p>
      <motion.button
        className="opacity-0 group-hover:opacity-100 w-6 h-6 min-w-[24px] rounded-lg flex items-center justify-center text-[var(--warm-brown)]/20 hover:text-red-400 cursor-pointer transition-opacity"
        onClick={() => deleteNote(note.id)}
        whileTap={{ scale: 0.8 }}
      >
        <X className="w-3 h-3" />
      </motion.button>
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

  const notes = compact ? quickNotes.slice(0, 4) : quickNotes;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    addNote({ text: text.trim(), isChecklist });
    setText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-display text-[var(--warm-brown-dark)] tracking-wide flex items-center gap-1.5">
          <StickyNote className="w-3.5 h-3.5 text-[var(--sage-green)]" />
          Ghi chú nhanh
          {quickNotes.length > 0 && (
            <span className="text-[var(--warm-brown)]/50 font-normal">({quickNotes.length})</span>
          )}
        </h3>
        <motion.button
          className="w-8 h-8 rounded-xl bg-[var(--soft-blue)]/20 flex items-center justify-center text-[var(--soft-blue)] cursor-pointer"
          onClick={() => setShowInput(!showInput)}
          whileTap={{ scale: 0.9 }}
          animate={{ rotate: showInput ? 45 : 0 }}
        >
          <Plus className="w-4 h-4" />
        </motion.button>
      </div>

      {/* Input */}
      <AnimatePresence>
        {showInput && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mb-3"
            onSubmit={handleSubmit}
          >
            <div className="glass p-3 space-y-2">
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ghi nhanh một ý..."
                className="w-full px-3 py-2.5 bg-white/30 rounded-xl border border-white/20 text-sm
                  text-[var(--warm-brown-dark)] placeholder:text-[var(--warm-brown)]/40
                  focus:outline-none focus:ring-2 focus:ring-[var(--soft-blue)]/50"
                autoFocus
              />
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isChecklist}
                    onChange={(e) => setIsChecklist(e.target.checked)}
                    className="w-4 h-4 rounded accent-[var(--sage-green)] min-h-0 min-w-0"
                  />
                  <span className="text-xs text-[var(--warm-brown)]/60">Checklist</span>
                </label>
                <button
                  type="submit"
                  disabled={!text.trim()}
                  className="px-3 py-1.5 rounded-lg bg-[var(--soft-blue)] text-white text-xs font-medium cursor-pointer
                    active:scale-95 transition-transform disabled:opacity-40"
                >
                  Thêm
                </button>
              </div>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Notes list */}
      <div className="space-y-2">
        <AnimatePresence mode="popLayout">
          {notes.length === 0 && !showInput && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-sm text-[var(--warm-brown)]/40 py-3"
            >
              Chưa có ghi chú 📝
            </motion.p>
          )}
          {notes.map((note) => (
            <NoteItem key={note.id} note={note} />
          ))}
        </AnimatePresence>
      </div>

      {compact && quickNotes.length > 4 && (
        <p className="text-center text-xs text-[var(--soft-blue)] font-medium mt-2 cursor-pointer">
          Xem tất cả ({quickNotes.length}) →
        </p>
      )}
    </div>
  );
}
