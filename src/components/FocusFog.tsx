import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store/useStore';

export function FocusFog() {
  const { isActive, focusFogEnabled } = useStore();

  const showFog = isActive && focusFogEnabled;

  return (
    <AnimatePresence>
      {showFog && (
        <>
          {/* Radial gradient fog overlay */}
          <motion.div
            className="fixed inset-0 pointer-events-none z-30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2, ease: 'easeInOut' }}
            style={{
              background: `
                radial-gradient(
                  ellipse 50% 50% at 50% 50%,
                  transparent 0%,
                  transparent 30%,
                  rgba(0, 0, 0, 0.1) 50%,
                  rgba(0, 0, 0, 0.3) 70%,
                  rgba(0, 0, 0, 0.5) 100%
                )
              `,
            }}
          />

          {/* Breathing fog animation */}
          <motion.div
            className="fixed inset-0 pointer-events-none z-30"
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: [0.3, 0.5, 0.3],
            }}
            exit={{ opacity: 0 }}
            transition={{ 
              duration: 4, 
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            style={{
              background: `
                radial-gradient(
                  ellipse 60% 60% at 50% 50%,
                  transparent 0%,
                  transparent 40%,
                  rgba(200, 220, 255, 0.05) 60%,
                  rgba(200, 220, 255, 0.1) 100%
                )
              `,
            }}
          />

          {/* Soft vignette edges */}
          <motion.div
            className="fixed inset-0 pointer-events-none z-30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2 }}
            style={{
              boxShadow: 'inset 0 0 200px 100px rgba(0, 0, 0, 0.2)',
            }}
          />
        </>
      )}
    </AnimatePresence>
  );
}
