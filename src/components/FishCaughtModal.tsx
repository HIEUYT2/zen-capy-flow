import { motion, AnimatePresence } from 'framer-motion';
import { X, Fish, Sparkles, PartyPopper } from 'lucide-react';
import { useStore } from '../store/useStore';

const rarityColors = {
  common: 'from-[var(--sage-light)] to-[var(--sage-green)]',
  rare: 'from-[var(--soft-blue)] to-[var(--soft-blue-dark)]',
  legendary: 'from-yellow-400 to-orange-500',
};

const rarityLabels = {
  common: 'Common',
  rare: 'Rare ✨',
  legendary: 'Legendary ⭐',
};

export function FishCaughtModal() {
  const { showFishModal, lastCaughtFish, closeFishModal, fishCaughtCount, lastFishQuote } = useStore();

  if (!lastCaughtFish) return null;

  const rarity = lastCaughtFish.rarity as keyof typeof rarityColors;
  const isGlowing = lastCaughtFish.glowing;

  return (
    <AnimatePresence>
      {showFishModal && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeFishModal}
          />

          {/* Modal */}
          <motion.div
            className="fixed top-1/2 left-1/2 z-50 w-full max-w-sm px-4"
            initial={{ opacity: 0, scale: 0.8, x: '-50%', y: '-50%' }}
            animate={{ opacity: 1, scale: 1, x: '-50%', y: '-50%' }}
            exit={{ opacity: 0, scale: 0.8, x: '-50%', y: '-50%' }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          >
            <div className="glass-strong p-8 text-center relative overflow-hidden">
              {/* Confetti-like sparkles */}
              <motion.div
                className="absolute inset-0 pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {[...Array(12)].map((_, i) => (
                  <motion.span
                    key={i}
                    className="absolute text-2xl"
                    style={{
                      left: `${10 + (i % 4) * 25}%`,
                      top: `${10 + Math.floor(i / 4) * 30}%`,
                    }}
                    initial={{ opacity: 0, scale: 0, rotate: 0 }}
                    animate={{
                      opacity: [0, 1, 0],
                      scale: [0, 1.2, 0],
                      rotate: [0, 180, 360],
                    }}
                    transition={{
                      duration: 1.5,
                      delay: i * 0.1,
                      repeat: Infinity,
                      repeatDelay: 2,
                    }}
                  >
                    {['✨', '⭐', '🌟', '💫'][i % 4]}
                  </motion.span>
                ))}
              </motion.div>

              {/* Close button */}
              <button
                onClick={closeFishModal}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/20 active:bg-white/30 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5 text-[var(--warm-brown)]" />
              </button>

              {/* Icon with optional glow effect */}
              <motion.div
                className={`w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br flex items-center justify-center shadow-lg ${isGlowing ? 'animate-glow' : ''}`}
                initial={{ rotate: -10 }}
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 0.5, delay: 0.3 }}
                style={{
                  background: `linear-gradient(to bottom right, var(--${rarity === 'legendary' ? 'soft-blue' : 'sage-green'}), var(--${rarity === 'legendary' ? 'soft-blue-dark' : 'sage-dark'}))`,
                }}
              >
                <span className="text-4xl">{lastCaughtFish.emoji}</span>
              </motion.div>

              {/* Title */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex items-center justify-center gap-2 mb-2">
                  <PartyPopper className="w-5 h-5 text-[var(--sage-green)]" />
                  <h2 className="text-xl font-display text-[var(--warm-brown-dark)]">
                    You caught a fish!
                  </h2>
                  <PartyPopper className="w-5 h-5 text-[var(--sage-green)] transform scale-x-[-1]" />
                </div>

                <motion.p
                  className="text-3xl font-display mb-2"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.4, type: 'spring' }}
                >
                  {lastCaughtFish.name}
                </motion.p>

                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm font-medium text-white bg-gradient-to-r ${rarityColors[rarity]}`}
                >
                  {rarityLabels[rarity]}
                </span>
              </motion.div>

              {/* Philosophical Quote */}
              {lastFishQuote && (
                <motion.div
                  className="mt-4 p-4 glass rounded-xl"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <p className="text-sm text-[var(--warm-brown)] italic leading-relaxed">
                    "{lastFishQuote}"
                  </p>
                </motion.div>
              )}

              {/* Stats */}
              <motion.div
                className="mt-6 pt-6 border-t border-white/20"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <div className="flex items-center justify-center gap-4">
                  <div className="flex items-center gap-2">
                    <Fish className="w-4 h-4 text-[var(--soft-blue)]" />
                    <span className="text-[var(--warm-brown)]">
                      Total: <strong>{fishCaughtCount}</strong>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[var(--sage-green)]" />
                    <span className="text-[var(--warm-brown)]">
                      Great focus session!
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* CTA */}
              <motion.button
                className="mt-6 w-full py-3 rounded-xl bg-gradient-to-r from-[var(--sage-green)] to-[var(--sage-dark)] text-white font-medium shadow-lg cursor-pointer"
                onClick={closeFishModal}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                Take a break! ☕
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
