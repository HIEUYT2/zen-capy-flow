import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Send, X } from 'lucide-react';
import { useState, memo, useCallback } from 'react';
import { useStore } from '../store/useStore';

// Speech bubble near Capybara
const SpeechBubble = memo(function SpeechBubble() {
  const { lastCapyResponse } = useStore();

  return (
    <AnimatePresence>
      {lastCapyResponse && (
        <motion.div
          className="absolute -top-20 left-1/2 transform -translate-x-1/2 w-64"
          initial={{ opacity: 0, scale: 0.8, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 10 }}
        >
          <div 
            className="glass-strong p-4 rounded-2xl text-center text-[var(--warm-brown)] text-sm relative"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,248,231,0.9) 100%)',
            }}
          >
            {lastCapyResponse}
            {/* Bubble tail */}
            <div 
              className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-4 rotate-45"
              style={{
                background: 'rgba(255,248,231,0.9)',
              }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

// Chat input panel
const ChatPanel = memo(function ChatPanel() {
  const { showCapyChat, toggleCapyChat, sendCapyMessage } = useStore();
  const [input, setInput] = useState('');

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      sendCapyMessage(input.trim());
      setInput('');
    }
  }, [input, sendCapyMessage]);

  return (
    <AnimatePresence>
      {showCapyChat && (
        <motion.div
          className="fixed left-1/2 z-40 w-[calc(100%-1.5rem)] max-w-sm -translate-x-1/2"
          style={{ bottom: 'calc(106px + env(safe-area-inset-bottom, 0px))' }}
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
        >
          <div className="rounded-2xl border border-white/65 bg-white/85 p-4 shadow-[0_16px_30px_rgba(24,30,24,0.18)] backdrop-blur-xl">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-[var(--warm-brown)]">
                🦫 Nói chuyện với Capy
              </h3>
              <button
                className="w-6 h-6 rounded-full bg-white/30 flex items-center justify-center hover:bg-white/50"
                onClick={toggleCapyChat}
              >
                <X className="w-3 h-3 text-[var(--warm-brown)]" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Hôm nay bạn thế nào?"
                className="input-shell flex-1 px-4 py-2 text-sm"
                autoFocus
              />
              <motion.button
                type="submit"
                className="w-10 h-10 rounded-xl bg-[var(--sage-green)] text-white flex items-center justify-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Send className="w-4 h-4" />
              </motion.button>
            </form>

            <p className="text-xs text-[var(--warm-brown)]/50 mt-2">
              Gõ "mệt", "vui", hoặc "focus" để nhận phản hồi
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

// Chat toggle button
const ChatButton = memo(function ChatButton() {
  const { toggleCapyChat, showCapyChat } = useStore();

  return (
    <motion.button
      className={`fixed left-4 z-40 flex h-14 w-14 items-center justify-center rounded-full transition-colors ${
        showCapyChat ? 'bg-[var(--color-primary-600)]' : 'border border-white/65 bg-white/85 backdrop-blur-lg'
      }`}
      style={{ bottom: 'calc(96px + env(safe-area-inset-bottom, 0px))' }}
      onClick={toggleCapyChat}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      title="Nói chuyện với Capy (T)"
    >
      <MessageCircle className={`w-6 h-6 ${showCapyChat ? 'text-white' : 'text-[var(--warm-brown)]'}`} />
    </motion.button>
  );
});

export function CapyChat() {
  return (
    <>
      <ChatButton />
      <ChatPanel />
    </>
  );
}

export { SpeechBubble };
