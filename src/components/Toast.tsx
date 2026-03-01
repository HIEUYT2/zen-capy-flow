import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';
import { useStore } from '../store/useStore';

export function Toast() {
  const { toasts, removeToast } = useStore();

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 w-[90vw] max-w-sm pointer-events-none">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onDismiss={() => removeToast(toast.id)} />
        ))}
      </AnimatePresence>
    </div>
  );
}

function ToastItem({
  toast,
  onDismiss,
}: {
  toast: { id: string; message: string; emoji?: string; duration?: number };
  onDismiss: () => void;
}) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, toast.duration || 3000);
    return () => clearTimeout(timer);
  }, [toast.duration, onDismiss]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      className="pointer-events-auto glass-strong px-4 py-3 flex items-center gap-3 cursor-pointer shadow-lg"
      onClick={onDismiss}
    >
      {toast.emoji && <span className="text-xl shrink-0">{toast.emoji}</span>}
      <p className="text-sm font-medium text-[var(--warm-brown-dark)] leading-snug">
        {toast.message}
      </p>
    </motion.div>
  );
}
