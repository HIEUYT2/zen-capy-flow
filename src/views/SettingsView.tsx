import { motion } from 'framer-motion';
import {
  Sun, CloudRain, Moon, Clock, Sparkles, Volume2, VolumeX,
  Maximize, Minimize, Bell, Target, Info
} from 'lucide-react';
import { useStore, ACCESSORY_REWARDS, type Theme } from '../store/useStore';

// Toggle Switch Component
function ToggleSwitch({
  enabled,
  onChange,
  label,
  icon,
  description,
}: {
  enabled: boolean;
  onChange: () => void;
  label: string;
  icon: React.ReactNode;
  description?: string;
}) {
  return (
    <div className="flex items-center justify-between py-1">
      <div className="flex items-center gap-2.5 flex-1 min-w-0">
        <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center shrink-0 text-[var(--warm-brown)]">
          {icon}
        </div>
        <div className="min-w-0">
          <span className="text-sm font-medium text-[var(--warm-brown-dark)] block">{label}</span>
          {description && (
            <span className="text-[10px] text-[var(--warm-brown)]/40 block mt-0.5 leading-tight">{description}</span>
          )}
        </div>
      </div>
      <motion.button
        className={`
          relative w-12 h-7 rounded-full cursor-pointer transition-colors duration-300 shrink-0 ml-3
          ${enabled
            ? 'bg-gradient-to-r from-[var(--sage-green)] to-[var(--soft-blue)]'
            : 'bg-white/20'
          }
        `}
        onClick={onChange}
        whileTap={{ scale: 0.95 }}
      >
        <motion.div
          className="absolute top-1 w-5 h-5 rounded-full bg-white shadow-md"
          animate={{ left: enabled ? 26 : 4 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      </motion.button>
    </div>
  );
}

const themeConfig: { key: Theme; icon: React.ReactNode; label: string }[] = [
  { key: 'sunny', icon: <Sun className="w-4 h-4" />, label: 'Nắng' },
  { key: 'rainy', icon: <CloudRain className="w-4 h-4" />, label: 'Mưa' },
  { key: 'night', icon: <Moon className="w-4 h-4" />, label: 'Đêm' },
];

export function SettingsView() {
  const {
    theme, setTheme, autoTheme, toggleAutoTheme,
    isFullscreen, toggleFullscreen,
    soundEnabled, toggleSound,
    focusFogEnabled, toggleFocusFog,
    accessories, equippedAccessory, equipAccessory,
    currentStreak,
    dailyGoal, setDailyGoal,
    notificationsEnabled, toggleNotifications,
  } = useStore();

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.05 } },
  };
  const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.25 } },
  };

  return (
    <motion.div
      className="w-full h-full overflow-y-auto overflow-x-hidden pb-24"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <div className="max-w-lg mx-auto px-4 pt-2 space-y-4">
        {/* Header */}
        <motion.div variants={item}>
          <h1 className="text-xl font-display text-[var(--warm-brown-dark)]">⚙️ Cài đặt</h1>
        </motion.div>

        {/* General */}
        <motion.div variants={item} className="glass-strong p-4 space-y-2">
          <h3 className="text-xs font-medium text-[var(--warm-brown)]/50 uppercase tracking-wider mb-2">Chung</h3>
          <ToggleSwitch
            enabled={autoTheme}
            onChange={toggleAutoTheme}
            label="Tự động đổi theme"
            icon={<Clock className="w-4 h-4" />}
            description="Đổi theo thời gian thực"
          />
          <ToggleSwitch
            enabled={soundEnabled}
            onChange={toggleSound}
            label="Âm thanh ASMR"
            icon={soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            description="Tiếng thiên nhiên khi tập trung"
          />
          <ToggleSwitch
            enabled={focusFogEnabled}
            onChange={toggleFocusFog}
            label="Focus Fog"
            icon={<Sparkles className="w-4 h-4" />}
            description="Làm mờ UI khi đang focus"
          />
          <ToggleSwitch
            enabled={notificationsEnabled}
            onChange={toggleNotifications}
            label="Thông báo"
            icon={<Bell className="w-4 h-4" />}
            description="Nhắc nhở khi hết session, break"
          />
        </motion.div>

        {/* Theme Selector */}
        {!autoTheme && (
          <motion.div variants={item} className="glass-strong p-4">
            <h3 className="text-xs font-medium text-[var(--warm-brown)]/50 uppercase tracking-wider mb-3">Theme</h3>
            <div className="flex gap-2">
              {themeConfig.map((t) => (
                <motion.button
                  key={t.key}
                  className={`flex-1 py-2.5 rounded-2xl flex items-center justify-center gap-2 text-sm font-medium transition-colors cursor-pointer ${
                    theme === t.key
                      ? 'bg-[var(--sage-green)] text-white'
                      : 'bg-white/10 text-[var(--warm-brown)] active:bg-white/20'
                  }`}
                  onClick={() => setTheme(t.key)}
                  whileTap={{ scale: 0.95 }}
                >
                  {t.icon}
                  {t.label}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Current Theme (when auto) */}
        {autoTheme && (
          <motion.div variants={item} className="glass p-3 flex items-center justify-center gap-2 text-sm text-[var(--warm-brown)]">
            {themeConfig.find((t) => t.key === theme)?.icon}
            <span>{themeConfig.find((t) => t.key === theme)?.label} (Tự động)</span>
          </motion.div>
        )}

        {/* Daily Goal */}
        <motion.div variants={item} className="glass-strong p-4">
          <h3 className="text-xs font-medium text-[var(--warm-brown)]/50 uppercase tracking-wider mb-3">
            <Target className="w-3 h-3 inline mr-1" />
            Mục tiêu hàng ngày
          </h3>
          <div className="flex items-center gap-3">
            <span className="text-sm text-[var(--warm-brown)]">{dailyGoal} phiên/ngày</span>
            <input
              type="range"
              min="1"
              max="12"
              value={dailyGoal}
              onChange={(e) => setDailyGoal(parseInt(e.target.value))}
              className="flex-1 h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-[var(--sage-green)]"
            />
          </div>
        </motion.div>

        {/* Accessories */}
        {accessories.length > 0 && (
          <motion.div variants={item} className="glass-strong p-4">
            <h3 className="text-xs font-medium text-[var(--warm-brown)]/50 uppercase tracking-wider mb-3">
              🎨 Trang phục Capybara
            </h3>
            <div className="flex gap-2 flex-wrap">
              <motion.button
                className={`w-11 h-11 rounded-xl flex items-center justify-center cursor-pointer transition-colors ${
                  !equippedAccessory
                    ? 'bg-[var(--sage-green)] ring-2 ring-white/50'
                    : 'bg-white/10 active:bg-white/20'
                }`}
                onClick={() => equipAccessory(null)}
                whileTap={{ scale: 0.9 }}
              >
                <span className="text-sm">❌</span>
              </motion.button>
              {accessories.map((acc) => (
                <motion.button
                  key={acc.id}
                  className={`w-11 h-11 rounded-xl flex items-center justify-center cursor-pointer transition-colors ${
                    equippedAccessory === acc.id
                      ? 'bg-[var(--sage-green)] ring-2 ring-white/50'
                      : 'bg-white/10 active:bg-white/20'
                  }`}
                  onClick={() => equipAccessory(acc.id)}
                  whileTap={{ scale: 0.9 }}
                  title={acc.name}
                >
                  <span className="text-lg">{acc.emoji}</span>
                </motion.button>
              ))}
            </div>
            {(() => {
              const next = ACCESSORY_REWARDS.find(
                (r) => r.streak > currentStreak && !accessories.some((a) => a.id === r.id)
              );
              return next ? (
                <p className="text-xs text-[var(--warm-brown)]/40 mt-2">
                  Tiếp theo: {next.emoji} tại streak {next.streak}
                </p>
              ) : null;
            })()}
          </motion.div>
        )}

        {/* Fullscreen */}
        <motion.div variants={item}>
          <motion.button
            className="w-full py-3 rounded-2xl glass text-[var(--warm-brown)] text-sm font-medium flex items-center justify-center gap-2 cursor-pointer"
            onClick={toggleFullscreen}
            whileTap={{ scale: 0.98 }}
          >
            {isFullscreen ? (
              <><Minimize className="w-4 h-4" /> Thoát toàn màn hình</>
            ) : (
              <><Maximize className="w-4 h-4" /> Chế độ toàn màn hình</>
            )}
          </motion.button>
        </motion.div>

        {/* About */}
        <motion.div variants={item} className="glass p-4 text-center">
          <span className="text-2xl block mb-1">🦫</span>
          <h3 className="text-sm font-display text-[var(--warm-brown-dark)]">CapyFlow</h3>
          <p className="text-xs text-[var(--warm-brown)]/40 mt-0.5">Focus with Capy • v2.0</p>
          <p className="text-[10px] text-[var(--warm-brown)]/30 mt-1">
            <Info className="w-3 h-3 inline mr-0.5" />
            Web của Thiên Quốc
          </p>
        </motion.div>

        <div className="h-4" />
      </div>
    </motion.div>
  );
}
