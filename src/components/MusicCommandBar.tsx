import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Music, Sparkles } from 'lucide-react';
import { useStore } from '../store/useStore';
import { findBestMatch, getSuggestions, type MusicMapping } from '../lib/musicMapper';

export function MusicCommandBar() {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState<MusicMapping[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    isCommandBarOpen,
    toggleCommandBar,
    setMusicMood,
    setVideoId,
    musicMood,
  } = useStore();

  // Update suggestions when input changes
  useEffect(() => {
    setSuggestions(getSuggestions(inputValue));
    setSelectedIndex(0);
  }, [inputValue]);

  // Keyboard shortcut to open
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        toggleCommandBar();
      }
      if (e.key === 'Escape' && isCommandBarOpen) {
        toggleCommandBar();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCommandBarOpen, toggleCommandBar]);

  // Focus input when opened
  useEffect(() => {
    if (isCommandBarOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isCommandBarOpen]);

  const handleSubmit = (mapping?: MusicMapping) => {
    const selected = mapping || findBestMatch(inputValue);
    if (selected) {
      setMusicMood(selected.mood);
      setVideoId(selected.videoId);
      setInputValue('');
      toggleCommandBar();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit(suggestions[selectedIndex]);
    }
  };

  return (
    <>
      {/* Trigger Button */}
      <motion.button
        onClick={toggleCommandBar}
        className="glass-strong px-4 py-2 flex items-center gap-2 cursor-pointer hover:bg-white/20 transition-colors"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Music className="w-4 h-4 text-[var(--sage-dark)]" />
        <span className="text-sm text-[var(--warm-brown)] hidden sm:inline">
          {musicMood || 'Set the mood...'}
        </span>
        <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-xs bg-white/30 rounded-md text-[var(--warm-brown-dark)]">
          ⌘K
        </kbd>
      </motion.button>

      {/* Command Bar Modal */}
      <AnimatePresence>
        {isCommandBarOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={toggleCommandBar}
            />

            {/* Modal */}
            <motion.div
              className="fixed top-1/3 left-1/2 w-full max-w-lg z-50"
              initial={{ opacity: 0, y: -20, x: '-50%' }}
              animate={{ opacity: 1, y: 0, x: '-50%' }}
              exit={{ opacity: 0, y: -20, x: '-50%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            >
              <div className="glass-strong overflow-hidden shadow-2xl">
                {/* Input */}
                <div className="flex items-center gap-3 px-4 py-4 border-b border-white/10">
                  <Search className="w-5 h-5 text-[var(--sage-green)]" />
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="What's the vibe? (e.g., 'coding deadline', 'rainy reading')"
                    className="flex-1 bg-transparent text-[var(--warm-brown-dark)] placeholder-[var(--warm-brown)]/50 outline-none text-lg"
                  />
                  <Sparkles className="w-5 h-5 text-[var(--sage-green)] animate-pulse" />
                </div>

                {/* Suggestions */}
                <div className="max-h-72 overflow-y-auto p-2">
                  {suggestions.map((suggestion, index) => (
                    <motion.button
                      key={suggestion.mood}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors cursor-pointer ${
                        index === selectedIndex
                          ? 'bg-[var(--sage-green)]/20'
                          : 'hover:bg-white/10'
                      }`}
                      onClick={() => handleSubmit(suggestion)}
                      whileHover={{ x: 4 }}
                    >
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--sage-light)] to-[var(--soft-blue)] flex items-center justify-center">
                        <Music className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-[var(--warm-brown-dark)]">
                          {suggestion.mood}
                        </p>
                        <p className="text-sm text-[var(--warm-brown)]/70">
                          {suggestion.description}
                        </p>
                      </div>
                      {index === selectedIndex && (
                        <span className="text-xs text-[var(--sage-green)] font-medium">
                          ↵ Enter
                        </span>
                      )}
                    </motion.button>
                  ))}
                </div>

                {/* Quick tips */}
                <div className="p-3 border-t border-white/10 flex items-center justify-between text-xs text-[var(--warm-brown)]/60">
                  <span>Try: "coding", "rainy", "jazz cafe", "gaming"</span>
                  <span>
                    <kbd className="px-1.5 py-0.5 bg-white/20 rounded">↑↓</kbd> navigate
                    <kbd className="px-1.5 py-0.5 bg-white/20 rounded ml-2">↵</kbd> select
                  </span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
