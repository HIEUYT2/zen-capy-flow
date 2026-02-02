import { motion } from 'framer-motion';
import { Minimize2, Maximize2 } from 'lucide-react';
import { memo } from 'react';
import { useStore } from '../store/useStore';

// Mini mode toggle button
const MiniModeButton = memo(function MiniModeButton() {
  const { toggleMiniMode, isMiniMode } = useStore();

  return (
    <motion.button
      className="fixed top-4 right-4 w-10 h-10 rounded-full glass flex items-center justify-center cursor-pointer z-50"
      onClick={toggleMiniMode}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      title={isMiniMode ? 'Mở rộng (H)' : 'Thu nhỏ (H)'}
    >
      {isMiniMode ? (
        <Maximize2 className="w-4 h-4 text-[var(--warm-brown)]" />
      ) : (
        <Minimize2 className="w-4 h-4 text-[var(--warm-brown)]" />
      )}
    </motion.button>
  );
});

// Mini mode wrapper - hides UI elements when active
function MiniModeWrapper({ children }: { children: React.ReactNode }) {
  const { isMiniMode } = useStore();

  return (
    <>
      <MiniModeButton />
      
      {/* Mini mode overlay that hides other elements */}
      {isMiniMode && (
        <motion.div
          className="fixed inset-0 pointer-events-none z-40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Gradual fade on edges */}
          <div 
            className="absolute inset-0"
            style={{
              background: `
                linear-gradient(to right, rgba(0,0,0,0.5) 0%, transparent 20%, transparent 80%, rgba(0,0,0,0.5) 100%),
                linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, transparent 30%, transparent 70%, rgba(0,0,0,0.3) 100%)
              `,
            }}
          />
        </motion.div>
      )}

      {children}
    </>
  );
}

export { MiniModeWrapper, MiniModeButton };
