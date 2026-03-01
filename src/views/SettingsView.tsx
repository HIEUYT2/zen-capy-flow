import { useEffect, useState, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import {
  Bell,
  CloudRain,
  Download,
  Maximize,
  Minimize,
  Moon,
  Sparkles,
  Sun,
  Target,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { ACCESSORY_REWARDS, useStore, type Theme } from '../store/useStore';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

function ToggleRow({
  enabled,
  label,
  description,
  icon,
  onToggle,
}: {
  enabled: boolean;
  label: string;
  description: string;
  icon: ReactNode;
  onToggle: () => void;
}) {
  return (
    <div className="rounded-2xl border border-white/60 bg-white/55 px-3 py-2.5">
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white/70 text-[var(--text-soft)]">
            {icon}
          </span>
          <div className="min-w-0">
            <p className="text-sm font-medium text-[var(--text-strong)]">{label}</p>
            <p className="text-[11px] text-[var(--text-soft)]">{description}</p>
          </div>
        </div>
        <button
          role="switch"
          aria-checked={enabled}
          onClick={onToggle}
          className={`relative h-7 w-12 rounded-full p-1 transition-colors ${
            enabled ? 'bg-[var(--color-primary-500)]' : 'bg-slate-300'
          }`}
        >
          <motion.span
            className="block h-5 w-5 rounded-full bg-white shadow-sm"
            animate={{ x: enabled ? 20 : 0 }}
            transition={{ type: 'spring', stiffness: 420, damping: 32 }}
          />
        </button>
      </div>
    </div>
  );
}

const THEMES: { key: Theme; label: string; icon: React.ReactNode }[] = [
  { key: 'sunny', label: 'Nắng', icon: <Sun className="h-4 w-4" /> },
  { key: 'rainy', label: 'Mưa', icon: <CloudRain className="h-4 w-4" /> },
  { key: 'night', label: 'Đêm', icon: <Moon className="h-4 w-4" /> },
];

export function SettingsView() {
  const {
    theme,
    setTheme,
    autoTheme,
    toggleAutoTheme,
    isFullscreen,
    toggleFullscreen,
    soundEnabled,
    toggleSound,
    focusFogEnabled,
    toggleFocusFog,
    accessories,
    equippedAccessory,
    equipAccessory,
    currentStreak,
    dailyGoal,
    setDailyGoal,
    notificationsEnabled,
    toggleNotifications,
  } = useStore();

  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>(() =>
    typeof window !== 'undefined' && 'Notification' in window ? Notification.permission : 'denied',
  );
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [installStatus, setInstallStatus] = useState<'idle' | 'accepted' | 'dismissed'>('idle');

  useEffect(() => {
    const handleBeforeInstall = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as BeforeInstallPromptEvent);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  const requestPermission = async () => {
    if (!('Notification' in window)) return;
    const permission = await Notification.requestPermission();
    setNotificationPermission(permission);
  };

  const handleInstall = async () => {
    if (!installPrompt) return;
    await installPrompt.prompt();
    const result = await installPrompt.userChoice;
    setInstallStatus(result.outcome);
    setInstallPrompt(null);
  };

  return (
    <motion.section
      className="h-full overflow-y-auto"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <div className="panel-section px-safe pb-nav pt-3 space-y-4">
        <article className="panel-card">
          <h2 className="font-display text-base text-[var(--text-strong)]">Tùy chỉnh trải nghiệm</h2>
          <p className="mt-1 text-xs text-[var(--text-soft)]">
            Tối ưu môi trường học cho mobile và sẵn sàng đóng gói Android app.
          </p>
        </article>

        <article className="panel-card space-y-2.5">
          <h3 className="text-xs uppercase tracking-[0.14em] text-[var(--text-soft)]">Focus & âm thanh</h3>
          <ToggleRow
            enabled={autoTheme}
            onToggle={toggleAutoTheme}
            label="Tự động đổi theme"
            description="Đổi theo thời gian trong ngày"
            icon={<Sparkles className="h-4 w-4" />}
          />
          <ToggleRow
            enabled={soundEnabled}
            onToggle={toggleSound}
            label="Âm thanh nền"
            description="Nhẹ nhàng, giúp giữ nhịp tập trung"
            icon={soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          />
          <ToggleRow
            enabled={focusFogEnabled}
            onToggle={toggleFocusFog}
            label="Focus Fog"
            description="Làm mờ vùng ngoài để giảm nhiễu"
            icon={<Moon className="h-4 w-4" />}
          />
        </article>

        <article className="panel-card space-y-2.5">
          <h3 className="text-xs uppercase tracking-[0.14em] text-[var(--text-soft)]">Thông báo & nhắc nhở</h3>
          <ToggleRow
            enabled={notificationsEnabled}
            onToggle={toggleNotifications}
            label="Bật nhắc nhở học tập"
            description="Session xong, break xong, task gần hạn, streak"
            icon={<Bell className="h-4 w-4" />}
          />
          <div className="rounded-xl border border-white/60 bg-white/55 p-3">
            <p className="text-xs text-[var(--text-soft)]">
              Quyền thông báo hiện tại:{' '}
              <span className="font-semibold text-[var(--text-strong)]">{notificationPermission}</span>
            </p>
            {notificationPermission !== 'granted' && (
              <button className="btn-soft mt-2 px-3 py-2 text-xs" onClick={requestPermission}>
                Cho phép thông báo
              </button>
            )}
          </div>
        </article>

        {!autoTheme && (
          <article className="panel-card">
            <h3 className="mb-3 text-xs uppercase tracking-[0.14em] text-[var(--text-soft)]">Giao diện</h3>
            <div className="grid grid-cols-3 gap-2">
              {THEMES.map((item) => (
                <button
                  key={item.key}
                  className={`rounded-xl px-2 py-2.5 text-xs font-medium ${
                    theme === item.key
                      ? 'bg-[var(--color-primary-600)] text-white'
                      : 'bg-white/60 text-[var(--text-soft)]'
                  }`}
                  onClick={() => setTheme(item.key)}
                >
                  <span className="mb-1 inline-flex items-center justify-center">{item.icon}</span>
                  <span className="block">{item.label}</span>
                </button>
              ))}
            </div>
          </article>
        )}

        <article className="panel-card">
          <h3 className="text-xs uppercase tracking-[0.14em] text-[var(--text-soft)]">
            <Target className="mr-1 inline h-3.5 w-3.5" />
            Mục tiêu mỗi ngày
          </h3>
          <div className="mt-3 rounded-2xl border border-white/65 bg-white/55 px-3 py-3">
            <div className="flex items-center justify-between text-sm text-[var(--text-strong)]">
              <span>{dailyGoal} phiên / ngày</span>
              <span className="chip-muted">1 - 12 phiên</span>
            </div>
            <input
              type="range"
              min="1"
              max="12"
              value={dailyGoal}
              onChange={(event) => setDailyGoal(Number(event.target.value))}
              className="mt-2 w-full accent-[var(--color-primary-600)]"
              aria-label="Mục tiêu số phiên mỗi ngày"
            />
          </div>
        </article>

        <article className="panel-card">
          <h3 className="text-xs uppercase tracking-[0.14em] text-[var(--text-soft)]">Capy Accessories</h3>
          {accessories.length === 0 ? (
            <p className="mt-2 text-sm text-[var(--text-soft)]">
              Chưa mở khóa accessory. Giữ streak để nhận quà.
            </p>
          ) : (
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                className={`inline-flex h-10 w-10 items-center justify-center rounded-xl text-sm ${
                  !equippedAccessory ? 'bg-[var(--color-primary-600)] text-white' : 'bg-white/60 text-[var(--text-soft)]'
                }`}
                onClick={() => equipAccessory(null)}
              >
                ✕
              </button>
              {accessories.map((item) => (
                <button
                  key={item.id}
                  className={`inline-flex h-10 w-10 items-center justify-center rounded-xl text-lg ${
                    equippedAccessory === item.id
                      ? 'bg-[var(--color-primary-600)] text-white'
                      : 'bg-white/60 text-[var(--text-strong)]'
                  }`}
                  onClick={() => equipAccessory(item.id)}
                  title={item.name}
                >
                  {item.emoji}
                </button>
              ))}
            </div>
          )}
          {(() => {
            const nextReward = ACCESSORY_REWARDS.find(
              (reward) => reward.streak > currentStreak && !accessories.some((item) => item.id === reward.id),
            );
            if (!nextReward) return null;
            return (
              <p className="mt-2 text-xs text-[var(--text-soft)]">
                Tiếp theo: {nextReward.emoji} tại streak {nextReward.streak} ngày.
              </p>
            );
          })()}
        </article>

        <article className="panel-card space-y-2.5">
          <h3 className="text-xs uppercase tracking-[0.14em] text-[var(--text-soft)]">PWA & Android readiness</h3>
          <div className="rounded-xl border border-white/65 bg-white/55 p-3 text-xs text-[var(--text-soft)]">
            <p>Manifest, service worker, theme color và install prompt đã được chuẩn bị.</p>
          </div>
          {installPrompt ? (
            <button className="btn-primary flex w-full items-center justify-center gap-2 px-4 py-2.5 text-sm" onClick={handleInstall}>
              <Download className="h-4 w-4" />
              Cài CapyFlow lên màn hình chính
            </button>
          ) : (
            <div className="rounded-xl border border-white/65 bg-white/55 p-3 text-xs text-[var(--text-soft)]">
              {installStatus === 'accepted'
                ? 'Bạn đã chấp nhận cài đặt.'
                : installStatus === 'dismissed'
                  ? 'Bạn đã đóng prompt cài đặt.'
                  : 'Nếu chưa thấy nút cài, mở menu trình duyệt và chọn "Add to Home screen".'}
            </div>
          )}
        </article>

        <button className="btn-soft flex w-full items-center justify-center gap-2 py-3 text-sm" onClick={toggleFullscreen}>
          {isFullscreen ? (
            <>
              <Minimize className="h-4 w-4" />
              Thoát toàn màn hình
            </>
          ) : (
            <>
              <Maximize className="h-4 w-4" />
              Chế độ toàn màn hình
            </>
          )}
        </button>
      </div>
    </motion.section>
  );
}
