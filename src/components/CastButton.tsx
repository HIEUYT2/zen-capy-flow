import { motion } from 'framer-motion';
import { Anchor } from 'lucide-react';
import { useStore } from '../store/useStore';

export function CastButton() {
  const { isCasting, isLineBroken, startCasting, isActive } = useStore();

  const isDisabled = isCasting || isLineBroken || isActive;

  return (
    <motion.button
      className={`
        relative overflow-hidden px-6 py-3 rounded-2xl font-medium
        flex items-center justify-center gap-3 w-full cursor-pointer
        transition-all duration-300
        ${isDisabled 
          ? 'bg-gray-400/30 text-gray-500 cursor-not-allowed' 
          : 'bg-gradient-to-r from-[var(--soft-blue)] via-[var(--soft-blue-light)] to-[var(--sage-green)] text-white shadow-lg hover:shadow-xl'
        }
      `}
      onClick={() => !isDisabled && startCasting()}
      disabled={isDisabled}
      whileHover={!isDisabled ? { scale: 1.02, y: -2 } : {}}
      whileTap={!isDisabled ? { scale: 0.98 } : {}}
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
        {isCasting ? 'Casting...' : isLineBroken ? 'Line Broken!' : 'Cast Line'}
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
