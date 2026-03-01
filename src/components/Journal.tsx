import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, memo } from 'react';
import { useStore } from '../store/useStore';

// Memoized journal page component
const JournalPage = memo(function JournalPage({ 
  entry, 
  index 
}: { 
  entry: { date: string; quote: string; scene: string; fishCaught: string; duration: number }; 
  index: number;
}) {
  const date = new Date(entry.date).toLocaleDateString('vi-VN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="w-full h-full p-6 flex flex-col">
      {/* Page number */}
      <div className="text-xs text-[var(--warm-brown)]/40 mb-4">
        Trang {index + 1}
      </div>

      {/* Date */}
      <h3 className="text-lg font-display text-[var(--warm-brown-dark)] mb-4">
        {date}
      </h3>

      {/* Scene */}
      <div className="text-6xl text-center my-6">{entry.scene}</div>

      {/* Quote */}
      <blockquote className="text-center italic text-[var(--warm-brown)] my-4 px-4">
        "{entry.quote}"
      </blockquote>

      {/* Stats */}
      <div className="flex justify-center gap-6 mt-auto">
        <div className="text-center">
          <div className="text-2xl">{entry.fishCaught}</div>
          <div className="text-xs text-[var(--warm-brown)]/60">Đã câu</div>
        </div>
        <div className="text-center">
          <div className="text-2xl">{entry.duration} phút</div>
          <div className="text-xs text-[var(--warm-brown)]/60">Tập trung</div>
        </div>
      </div>
    </div>
  );
});

function JournalButton() {
  const { toggleJournal, journalEntries } = useStore();

  return (
    <motion.button
      className="fixed right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full border border-white/65 bg-white/85 backdrop-blur-lg"
      style={{ bottom: 'calc(96px + env(safe-area-inset-bottom, 0px))' }}
      onClick={toggleJournal}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      title="Nhật ký câu cá (J)"
    >
      <BookOpen className="w-6 h-6 text-[var(--warm-brown)]" />
      {journalEntries.length > 0 && (
        <motion.span
          className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[var(--sage-green)] text-white text-xs flex items-center justify-center"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
        >
          {journalEntries.length}
        </motion.span>
      )}
    </motion.button>
  );
}

function JournalModal() {
  const { showJournal, toggleJournal, journalEntries } = useStore();
  const [currentPage, setCurrentPage] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);

  const goToPage = (direction: 'prev' | 'next') => {
    if (isFlipping) return;
    
    setIsFlipping(true);
    setTimeout(() => {
      if (direction === 'prev' && currentPage > 0) {
        setCurrentPage(currentPage - 1);
      } else if (direction === 'next' && currentPage < journalEntries.length - 1) {
        setCurrentPage(currentPage + 1);
      }
      setIsFlipping(false);
    }, 300);
  };

  return (
    <AnimatePresence>
      {showJournal && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={toggleJournal}
        >
          {/* Journal book */}
          <motion.div
            className="relative h-[min(78dvh,540px)] w-[min(92vw,420px)] perspective-1000"
            initial={{ scale: 0.8, rotateY: -30 }}
            animate={{ scale: 1, rotateY: 0 }}
            exit={{ scale: 0.8, rotateY: 30 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Book cover */}
            <div 
              className="absolute inset-0 rounded-2xl shadow-2xl overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, #8B7355 0%, #6B5540 100%)',
                transform: 'translateZ(-10px)',
              }}
            >
              {/* Spine */}
              <div 
                className="absolute left-0 top-0 bottom-0 w-4"
                style={{
                  background: 'linear-gradient(90deg, #5a4530, #6B5540)',
                }}
              />
            </div>

            {/* Pages container */}
            <motion.div
              className="absolute inset-4 bg-[#FFF8E7] rounded-lg shadow-inner overflow-hidden"
              animate={{
                rotateY: isFlipping ? (currentPage % 2 === 0 ? -15 : 15) : 0,
              }}
              transition={{ duration: 0.3 }}
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Close button */}
              <button
                className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/50 flex items-center justify-center hover:bg-white/80 transition-colors z-10"
                onClick={toggleJournal}
              >
                <X className="w-4 h-4 text-[var(--warm-brown)]" />
              </button>

              {journalEntries.length === 0 ? (
                <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center">
                  <span className="text-6xl mb-4">📔</span>
                  <h3 className="text-xl font-display text-[var(--warm-brown-dark)] mb-2">
                    Nhật ký trống
                  </h3>
                  <p className="text-[var(--warm-brown)]/60">
                    Hoàn thành các phiên tập trung để thu thập mảnh ký ức!
                  </p>
                </div>
              ) : (
                <>
                  <JournalPage 
                    entry={journalEntries[currentPage]} 
                    index={currentPage}
                  />

                  {/* Navigation */}
                  <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4">
                    <button
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                        currentPage > 0
                          ? 'bg-[var(--sage-green)] text-white cursor-pointer'
                          : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      }`}
                      onClick={() => goToPage('prev')}
                      disabled={currentPage === 0}
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <span className="flex items-center text-sm text-[var(--warm-brown)]/60">
                      {currentPage + 1} / {journalEntries.length}
                    </span>
                    <button
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                        currentPage < journalEntries.length - 1
                          ? 'bg-[var(--sage-green)] text-white cursor-pointer'
                          : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      }`}
                      onClick={() => goToPage('next')}
                      disabled={currentPage === journalEntries.length - 1}
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function Journal() {
  return (
    <>
      <JournalButton />
      <JournalModal />
    </>
  );
}
