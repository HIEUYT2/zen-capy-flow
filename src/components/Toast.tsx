import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';
import { useStore } from '../store/useStore';

export function Toast() {
  const { toasts, removeToast } = useStore();

  return (
    <div
      className="pointer-events-none fixed left-1/2 z-[100] flex w-[92vw] max-w-sm -translate-x-1/2 flex-col gap-2"
      style={{ top: 'calc(12px + env(safe-area-inset-top, 0px))' }}
      aria-live="polite"
      aria-atomic="true"
    >
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
      className="pointer-events-auto flex cursor-pointer items-center gap-3 rounded-2xl border border-white/65 bg-white/84 px-4 py-3 shadow-[0_16px_32px_rgba(30,40,32,0.2)] backdrop-blur-xl"
      onClick={onDismiss}
      role="status"
    >
      {toast.emoji && <span className="text-xl shrink-0">{toast.emoji}</span>}
      <p className="text-sm font-medium leading-snug text-[var(--text-strong)]">
        {toast.message}
      </p>
    </motion.div>
  );
}
