import { motion } from 'framer-motion';
import { Anchor } from 'lucide-react';
import { useStore } from '../store/useStore';

export function CastButton() {
  const { isCasting, isLineBroken, startCasting, isActive } = useStore();

  const isDisabled = isCasting || isLineBroken || isActive;

  return (
    <motion.button
      className={`
        relative flex w-full items-center justify-center gap-2.5 overflow-hidden rounded-2xl px-5 py-3 text-sm font-semibold
        transition-all duration-300
        ${isDisabled 
          ? 'cursor-not-allowed bg-slate-300/45 text-slate-500' 
          : 'bg-gradient-to-r from-[var(--color-accent-500)] via-[var(--soft-blue-light)] to-[var(--color-primary-500)] text-white shadow-[0_12px_28px_rgba(70,118,157,0.3)]'
        }
      `}
      onClick={() => !isDisabled && startCasting()}
      disabled={isDisabled}
      whileTap={!isDisabled ? { scale: 0.98 } : {}}
      aria-label="Thả cần câu"
    >
      {/* Shimmer effect */}
      {!isDisabled && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
          animate={{
            x: ['-200%', '200%'],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      )}

      {/* Glow effect */}
      {!isDisabled && (
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[var(--soft-blue)]/50 to-[var(--sage-green)]/50 blur-xl -z-10" />
      )}

      <motion.span
        animate={isCasting ? { rotate: [0, -30, 30, 0] } : {}}
        transition={{ duration: 0.5, repeat: isCasting ? Infinity : 0 }}
      >
        <Anchor className="w-5 h-5" />
      </motion.span>
      
      <span className="relative z-10">
        {isCasting ? 'Đang thả cần...' : isLineBroken ? 'Dây câu bị đứt' : 'Thả cần câu'}
      </span>

      {/* Ripple on cast */}
      {isCasting && (
        <motion.div
          className="absolute inset-0 rounded-2xl border-2 border-white/50"
          initial={{ scale: 1, opacity: 0.5 }}
          animate={{ scale: 1.5, opacity: 0 }}
          transition={{ duration: 0.5, repeat: Infinity }}
        />
      )}
    </motion.button>
  );
}
