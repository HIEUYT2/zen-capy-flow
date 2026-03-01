import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { CapybaraMascot } from '../components/CapybaraMascot';
import { FocusTimer } from '../components/FocusTimer';
import { VinylPlayer } from '../components/VinylPlayer';
import { ControlPanel } from '../components/ControlPanel';
import { CastButton } from '../components/CastButton';
import { FocusFog } from '../components/FocusFog';
import { SpeechBubble } from '../components/CapyChat';
import { MusicCommandBar } from '../components/MusicCommandBar';
import { MiniModeButton } from '../components/MiniMode';
import { useStore } from '../store/useStore';

export function FocusView() {
  const { showFishModal, isActive, focusFogEnabled, isMiniMode, sessionType } = useStore();
  const shouldDimUI = isActive && focusFogEnabled;

  return (
    <section className="relative flex h-full flex-col overflow-hidden">
      <FocusFog />
      <MiniModeButton />

      <motion.div
        className="panel-section px-safe pt-3"
        animate={{
          opacity: isMiniMode ? 0 : shouldDimUI ? 0.35 : 1,
          y: isMiniMode ? -40 : 0,
        }}
        transition={{ duration: 0.35 }}
      >
        <div className="panel-card !py-2.5 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-[0.13em] text-[var(--text-soft)]">Focus workspace</p>
            <p className="truncate text-sm font-medium text-[var(--text-strong)]">
              {sessionType === 'focus' ? 'Phiên tập trung đang chờ bạn' : 'Đang trong giờ nghỉ'}
            </p>
          </div>
          <MusicCommandBar />
        </div>
      </motion.div>

      <main className="flex-1 overflow-y-auto px-safe pb-nav pt-3">
        <div className="panel-section grid grid-cols-1 gap-3 xl:grid-cols-12 xl:items-start">
          <motion.div
            className="xl:col-span-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <article className="panel-card">
              <FocusTimer />
            </article>
          </motion.div>

          <motion.div
            className="xl:col-span-4"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.05 }}
          >
            <article className="panel-card !p-4">
              <div className="relative mx-auto aspect-square w-full max-w-[260px] md:max-w-[320px]">
                <CapybaraMascot isCatching={showFishModal} />
                <SpeechBubble />
              </div>
              <div className="mt-3">
                <CastButton />
              </div>
              <p className="mt-2 text-center text-xs text-[var(--text-soft)]">
                Chạm Capy để tương tác. Nhấn giữ để ru Capy ngủ.
              </p>
            </article>
          </motion.div>

          <motion.div
            className="space-y-3 xl:col-span-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{
              opacity: isMiniMode ? 0 : shouldDimUI ? 0.35 : 1,
              y: isMiniMode ? 60 : 0,
            }}
            transition={{ delay: 0.1, duration: 0.35 }}
          >
            <article className="panel-card !p-3.5">
              <VinylPlayer />
            </article>
            <article className="panel-card !p-3.5">
              <ControlPanel />
            </article>
            <article className="panel-card !p-3.5 flex items-start gap-2">
              <Sparkles className="mt-0.5 h-4 w-4 text-[var(--color-primary-600)]" />
              <p className="text-xs leading-relaxed text-[var(--text-soft)]">
                Mẹo: bật Focus Fog để giảm xao nhãng. Khi cần giữ ý tưởng, dùng Floating Notes để ghi nhanh và quay lại bài học.
              </p>
            </article>
          </motion.div>
        </div>
      </main>
    </section>
  );
}
