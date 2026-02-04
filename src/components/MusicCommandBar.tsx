import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Music, Sparkles, Link2, ListMusic, X } from 'lucide-react';
import { useStore } from '../store/useStore';
import { findBestMatch, getSuggestions, type MusicMapping } from '../lib/musicMapper';
import { parseYouTubeUrl, isYouTubeUrl } from '../lib/youtubeUtils';

type TabType = 'moods' | 'custom';

export function MusicCommandBar() {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState<MusicMapping[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<TabType>('moods');
  const [urlError, setUrlError] = useState<string | null>(null);
  const [detectedUrl, setDetectedUrl] = useState<{
    type: 'video' | 'playlist';
    videoId?: string;
    playlistId?: string;
  } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    isCommandBarOpen,
    toggleCommandBar,
    setMusicMood,
    setVideoId,
    setPlaylistId,
    musicMood,
  } = useStore();

  // Update suggestions when input changes
  useEffect(() => {
    if (activeTab === 'moods') {
      // Check if input looks like a URL first
      if (isYouTubeUrl(inputValue)) {
        setActiveTab('custom');
        return;
      }
      setSuggestions(getSuggestions(inputValue));
      setSelectedIndex(0);
    }
  }, [inputValue, activeTab]);

  // Parse URL when in custom tab
  useEffect(() => {
    if (activeTab === 'custom' && inputValue.trim()) {
      const result = parseYouTubeUrl(inputValue);
      if (result.type === 'invalid') {
        setDetectedUrl(null);
        if (inputValue.length > 5) {
          setUrlError('Không nhận dạng được URL YouTube. Hãy thử link khác.');
        }
      } else {
        setUrlError(null);
        setDetectedUrl({
          type: result.type,
          videoId: result.videoId,
          playlistId: result.playlistId,
        });
      }
    } else {
      setDetectedUrl(null);
      setUrlError(null);
    }
  }, [inputValue, activeTab]);

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
    } else {
      // Reset state when closed
      setInputValue('');
      setActiveTab('moods');
      setUrlError(null);
      setDetectedUrl(null);
    }
  }, [isCommandBarOpen]);

  const handleSubmit = (mapping?: MusicMapping) => {
    if (activeTab === 'custom' && detectedUrl) {
      // Handle custom URL
      if (detectedUrl.playlistId) {
        setMusicMood('Custom Playlist 🎵');
        setPlaylistId(detectedUrl.playlistId);
        if (detectedUrl.videoId) {
          setVideoId(detectedUrl.videoId);
        }
      } else if (detectedUrl.videoId) {
        setMusicMood('Custom Video 🎶');
        setVideoId(detectedUrl.videoId);
        setPlaylistId(null);
      }
      setInputValue('');
      toggleCommandBar();
      return;
    }

    // Handle mood selection
    const selected = mapping || findBestMatch(inputValue);
    if (selected) {
      setMusicMood(`${selected.emoji || '🎵'} ${selected.mood}`);
      setVideoId(selected.videoId);
      setPlaylistId(null);
      setInputValue('');
      toggleCommandBar();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (activeTab === 'moods') {
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
    } else if (activeTab === 'custom' && e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
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
              className="fixed top-1/4 left-1/2 w-full max-w-lg z-50 px-4"
              initial={{ opacity: 0, y: -20, x: '-50%' }}
              animate={{ opacity: 1, y: 0, x: '-50%' }}
              exit={{ opacity: 0, y: -20, x: '-50%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            >
              <div className="glass-strong overflow-hidden shadow-2xl rounded-2xl">
                {/* Tabs */}
                <div className="flex border-b border-white/10">
                  <button
                    className={`flex-1 px-4 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                      activeTab === 'moods'
                        ? 'text-[var(--sage-green)] bg-[var(--sage-green)]/10'
                        : 'text-[var(--warm-brown)]/60 hover:text-[var(--warm-brown)]'
                    }`}
                    onClick={() => setActiveTab('moods')}
                  >
                    <Sparkles className="w-4 h-4" />
                    Mood Presets
                  </button>
                  <button
                    className={`flex-1 px-4 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                      activeTab === 'custom'
                        ? 'text-[var(--sage-green)] bg-[var(--sage-green)]/10'
                        : 'text-[var(--warm-brown)]/60 hover:text-[var(--warm-brown)]'
                    }`}
                    onClick={() => setActiveTab('custom')}
                  >
                    <Link2 className="w-4 h-4" />
                    Dán URL YouTube
                  </button>
                </div>

                {/* Input */}
                <div className="flex items-center gap-3 px-4 py-4 border-b border-white/10">
                  {activeTab === 'moods' ? (
                    <Search className="w-5 h-5 text-[var(--sage-green)]" />
                  ) : (
                    <Link2 className="w-5 h-5 text-[var(--sage-green)]" />
                  )}
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={
                      activeTab === 'moods'
                        ? "Tâm trạng hôm nay? (vd: 'coding', 'mưa', 'jazz')"
                        : "Dán link YouTube video hoặc playlist..."
                    }
                    className="flex-1 bg-transparent text-[var(--warm-brown-dark)] placeholder-[var(--warm-brown)]/50 outline-none text-lg"
                  />
                  {inputValue && (
                    <button
                      onClick={() => setInputValue('')}
                      className="p-1 hover:bg-white/10 rounded-full transition-colors cursor-pointer"
                    >
                      <X className="w-4 h-4 text-[var(--warm-brown)]/60" />
                    </button>
                  )}
                </div>

                {/* Content Area */}
                <div className="max-h-72 overflow-y-auto p-2">
                  {activeTab === 'moods' ? (
                    // Mood suggestions
                    suggestions.map((suggestion, index) => (
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
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--sage-light)] to-[var(--soft-blue)] flex items-center justify-center text-lg">
                          {suggestion.emoji || '🎵'}
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
                    ))
                  ) : (
                    // Custom URL content
                    <div className="p-4 space-y-4">
                      {/* URL Status */}
                      {detectedUrl ? (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-4 rounded-xl bg-[var(--sage-green)]/20 border border-[var(--sage-green)]/30"
                        >
                          <div className="flex items-center gap-3">
                            {detectedUrl.type === 'playlist' ? (
                              <ListMusic className="w-6 h-6 text-[var(--sage-green)]" />
                            ) : (
                              <Music className="w-6 h-6 text-[var(--sage-green)]" />
                            )}
                            <div>
                              <p className="font-medium text-[var(--sage-green)]">
                                {detectedUrl.type === 'playlist'
                                  ? '🎵 Playlist detected!'
                                  : '🎶 Video detected!'}
                              </p>
                              <p className="text-sm text-[var(--warm-brown)]/70">
                                {detectedUrl.type === 'playlist'
                                  ? detectedUrl.videoId
                                    ? 'Sẽ phát video đầu tiên từ playlist'
                                    : 'Sẽ phát ngẫu nhiên từ playlist'
                                  : `Video ID: ${detectedUrl.videoId}`}
                              </p>
                            </div>
                          </div>
                          <motion.button
                            className="mt-4 w-full py-3 rounded-xl bg-[var(--sage-green)] text-white font-medium hover:bg-[var(--sage-green)]/90 transition-colors cursor-pointer"
                            onClick={() => handleSubmit()}
                            whileTap={{ scale: 0.98 }}
                          >
                            ▶ Phát ngay
                          </motion.button>
                        </motion.div>
                      ) : urlError ? (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-center"
                        >
                          {urlError}
                        </motion.div>
                      ) : (
                        <div className="text-center text-[var(--warm-brown)]/60 py-6">
                          <Link2 className="w-10 h-10 mx-auto mb-3 opacity-40" />
                          <p className="text-sm">
                            Dán link YouTube video hoặc playlist
                          </p>
                          <p className="text-xs mt-2 opacity-70">
                            Hỗ trợ: youtube.com/watch, youtu.be, playlist
                          </p>
                        </div>
                      )}

                      {/* Examples */}
                      <div className="text-xs text-[var(--warm-brown)]/50 space-y-1">
                        <p className="font-medium mb-2">Ví dụ URLs:</p>
                        <p>• https://youtube.com/watch?v=jfKfPfyJRdk</p>
                        <p>• https://youtu.be/jfKfPfyJRdk</p>
                        <p>• https://youtube.com/playlist?list=PLxxxxx</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Quick tips */}
                <div className="p-3 border-t border-white/10 flex items-center justify-between text-xs text-[var(--warm-brown)]/60">
                  {activeTab === 'moods' ? (
                    <>
                      <span>Thử: "coding", "mưa", "jazz cafe", "kpop"</span>
                      <span>
                        <kbd className="px-1.5 py-0.5 bg-white/20 rounded">↑↓</kbd> navigate
                        <kbd className="px-1.5 py-0.5 bg-white/20 rounded ml-2">↵</kbd> select
                      </span>
                    </>
                  ) : (
                    <span className="w-full text-center">
                      💡 Tip: Có thể paste Video ID trực tiếp (11 ký tự)
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

