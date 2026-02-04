import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flower2, X, Send } from 'lucide-react';
import { useStore } from '../store/useStore';

export function FloatingNotes() {
  const {
    showFloatingNotesInput,
    toggleFloatingNotesInput,
    addFloatingNote,
    floatingNotes,
    sessionType,
    isActive,
  } = useStore();
  
  const [noteText, setNoteText] = useState('');
  const [showDriftingNote, setShowDriftingNote] = useState(false);
  const [driftingText, setDriftingText] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = () => {
    if (noteText.trim()) {
      // Show drifting animation
      setDriftingText(noteText);
      setShowDriftingNote(true);
      
      // Add to store
      addFloatingNote(noteText);
      setNoteText('');
      
      // Hide drifting note after animation
      setTimeout(() => {
        setShowDriftingNote(false);
      }, 2000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  // Get unshown notes for break time display
  const unshownNotes = floatingNotes.filter(note => !note.shown);

  return (
    <>
      {/* Lotus Button (only show during focus session) */}
      {isActive && sessionType === 'focus' && (
        <motion.button
          className="fixed bottom-24 right-6 z-40 w-14 h-14 rounded-full glass-strong flex items-center justify-center text-[var(--warm-brown)] shadow-lg cursor-pointer"
          onClick={toggleFloatingNotesInput}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          title="Xả suy nghĩ xao nhãng"
        >
          <Flower2 className="w-6 h-6" />
        </motion.button>
      )}

      {/* Input Modal */}
      <AnimatePresence>
        {showFloatingNotesInput && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={toggleFloatingNotesInput}
            />

            {/* Input Card */}
            <motion.div
              className="fixed bottom-32 right-6 z-50 w-80"
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
            >
              <div className="glass-strong p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Flower2 className="w-5 h-5 text-[var(--sage-green)]" />
                    <span className="font-display text-[var(--warm-brown-dark)]">
                      Xả suy nghĩ
                    </span>
                  </div>
                  <button
                    onClick={toggleFloatingNotesInput}
                    className="p-1 rounded-full hover:bg-white/20 active:bg-white/30"
                  >
                    <X className="w-4 h-4 text-[var(--warm-brown)]" />
                  </button>
                </div>
                
                <p className="text-xs text-[var(--warm-brown)]/70 mb-3">
                  Viết ra những gì đang làm bạn xao nhãng. Mảnh giấy sẽ trôi đi và chỉ xuất hiện lại khi nghỉ ngơi.
                </p>

                <div className="flex gap-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Việc cần nhớ, suy nghĩ xao nhãng..."
                    className="flex-1 px-3 py-2 rounded-xl bg-white/20 border border-white/30 text-[var(--warm-brown-dark)] placeholder:text-[var(--warm-brown)]/50 focus:outline-none focus:ring-2 focus:ring-[var(--sage-green)]/50"
                    autoFocus
                  />
                  <motion.button
                    onClick={handleSubmit}
                    className="p-2 rounded-xl bg-[var(--sage-green)] text-white"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={!noteText.trim()}
                  >
                    <Send className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Drifting Paper Animation */}
      <AnimatePresence>
        {showDriftingNote && (
          <motion.div
            className="fixed bottom-40 right-10 z-50 max-w-[200px] p-3 bg-[#FFF8DC] rounded shadow-lg transform rotate-3"
            style={{
              backgroundImage: 'repeating-linear-gradient(transparent, transparent 24px, #E0D8BC 24px, #E0D8BC 25px)',
            }}
            initial={{ opacity: 1, y: 0, rotate: 3 }}
            animate={{ 
              opacity: 0, 
              y: -150, 
              x: 100, 
              rotate: 20,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2, ease: 'easeOut' }}
          >
            <p className="text-sm text-[var(--warm-brown-dark)] font-medium">
              {driftingText}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Break Time Notes Display */}
      {sessionType === 'break' && unshownNotes.length > 0 && (
        <motion.div
          className="fixed top-20 right-6 z-40 w-72"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="glass-strong p-4">
            <div className="flex items-center gap-2 mb-3">
              <Flower2 className="w-5 h-5 text-[var(--sage-green)]" />
              <span className="font-display text-[var(--warm-brown-dark)]">
                Suy nghĩ đã xả
              </span>
            </div>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {unshownNotes.map((note, i) => (
                <motion.div
                  key={note.id}
                  className="p-2 bg-[#FFF8DC]/80 rounded text-sm text-[var(--warm-brown-dark)]"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  {note.text}
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </>
  );
}
