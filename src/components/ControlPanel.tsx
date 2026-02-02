import { motion } from 'framer-motion';
import { Sun, CloudRain, Moon, Maximize, Minimize, Fish, Flame, Volume2, VolumeX, Clock, Sparkles } from 'lucide-react';
import { useStore, ACCESSORY_REWARDS } from '../store/useStore';

type ThemeType = 'sunny' | 'rainy' | 'night';

const themeIcons: Record<ThemeType, React.ReactNode> = {
  sunny: <Sun className="w-4 h-4" />,
  rainy: <CloudRain className="w-4 h-4" />,
  night: <Moon className="w-4 h-4" />,
};

const themeLabels: Record<ThemeType, string> = {
  sunny: 'Sunny',
  rainy: 'Rainy',
  night: 'Night',
};

// Toggle Switch Component
function ToggleSwitch({ 
  enabled, 
  onChange, 
  label, 
  icon 
}: { 
  enabled: boolean; 
  onChange: () => void; 
  label: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2 text-[var(--warm-brown)]">
        {icon}
        <span className="text-sm font-medium">{label}</span>
      </div>
      <motion.button
        className={`
          relative w-12 h-6 rounded-full cursor-pointer transition-colors duration-300
          ${enabled 
            ? 'bg-gradient-to-r from-[var(--sage-green)] to-[var(--soft-blue)]' 
            : 'bg-white/20'
          }
        `}
        onClick={onChange}
        whileTap={{ scale: 0.95 }}
      >
        <motion.div
          className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-md"
          animate={{
            left: enabled ? 28 : 4,
          }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
        {enabled && (
          <motion.div
            className="absolute inset-0 rounded-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
              backgroundSize: '200% 100%',
            }}
          />
        )}
      </motion.button>
    </div>
  );
}

export function ControlPanel() {
  const {
    theme,
    setTheme,
    autoTheme,
    toggleAutoTheme,
    isFullscreen,
    toggleFullscreen,
    fishCaughtCount,
    currentStreak,
    isLineBroken,
    repairLine,
    soundEnabled,
    toggleSound,
    focusFogEnabled,
    toggleFocusFog,
    accessories,
    equippedAccessory,
    equipAccessory,
  } = useStore();

  const themes: ThemeType[] = ['sunny', 'rainy', 'night'];

  return (
    <div className="glass p-4 space-y-4">
      {/* Toggle Switches */}
      <div className="space-y-3">
        <ToggleSwitch
          enabled={autoTheme}
          onChange={toggleAutoTheme}
          label="Auto Theme"
          icon={<Clock className="w-4 h-4" />}
        />
        <ToggleSwitch
          enabled={soundEnabled}
          onChange={toggleSound}
          label="ASMR Sounds"
          icon={soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        />
        <ToggleSwitch
          enabled={focusFogEnabled}
          onChange={toggleFocusFog}
          label="Focus Fog"
          icon={<Sparkles className="w-4 h-4" />}
        />
      </div>

      {/* Theme Selector - shown when auto theme is off */}
      {!autoTheme && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          <label className="text-xs text-[var(--warm-brown)]/60 uppercase tracking-wider mb-2 block">
            Theme
          </label>
          <div className="flex gap-2">
            {themes.map((t) => (
              <motion.button
                key={t}
                className={`flex-1 py-2 px-3 rounded-xl flex items-center justify-center gap-2 text-sm font-medium transition-colors cursor-pointer ${
                  theme === t
                    ? 'bg-[var(--sage-green)] text-white'
                    : 'bg-white/10 text-[var(--warm-brown)] hover:bg-white/20'
                }`}
                onClick={() => setTheme(t)}
                whileTap={{ scale: 0.95 }}
              >
                {themeIcons[t]}
                <span className="hidden sm:inline">{themeLabels[t]}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Current Theme Indicator when auto is on */}
      {autoTheme && (
        <div className="bg-white/10 rounded-xl p-3 flex items-center justify-center gap-2">
          {themeIcons[theme as ThemeType]}
          <span className="text-sm text-[var(--warm-brown)]">
            {themeLabels[theme as ThemeType]} (Auto)
          </span>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white/10 rounded-xl p-3 text-center">
          <div className="flex items-center justify-center gap-2 text-[var(--soft-blue)]">
            <Fish className="w-4 h-4" />
            <span className="text-2xl font-display">{fishCaughtCount}</span>
          </div>
          <p className="text-xs text-[var(--warm-brown)]/60 mt-1">Fish Caught</p>
        </div>
        <div className="bg-white/10 rounded-xl p-3 text-center">
          <div className="flex items-center justify-center gap-2 text-[var(--sage-green)]">
            <Flame className="w-4 h-4" />
            <span className="text-2xl font-display">{currentStreak}</span>
          </div>
          <p className="text-xs text-[var(--warm-brown)]/60 mt-1">Focus Streak</p>
        </div>
      </div>

      {/* Accessories Collection */}
      {accessories.length > 0 && (
        <div>
          <label className="text-xs text-[var(--warm-brown)]/60 uppercase tracking-wider mb-2 block">
            Collection
          </label>
          <div className="flex gap-2 flex-wrap">
            {/* None option */}
            <motion.button
              className={`w-10 h-10 rounded-xl flex items-center justify-center cursor-pointer transition-colors ${
                !equippedAccessory
                  ? 'bg-[var(--sage-green)] ring-2 ring-white/50'
                  : 'bg-white/10 hover:bg-white/20'
              }`}
              onClick={() => equipAccessory(null)}
              whileTap={{ scale: 0.9 }}
              title="No accessory"
            >
              <span className="text-sm">❌</span>
            </motion.button>
            {accessories.map((acc) => (
              <motion.button
                key={acc.id}
                className={`w-10 h-10 rounded-xl flex items-center justify-center cursor-pointer transition-colors ${
                  equippedAccessory === acc.id
                    ? 'bg-[var(--sage-green)] ring-2 ring-white/50'
                    : 'bg-white/10 hover:bg-white/20'
                }`}
                onClick={() => equipAccessory(acc.id)}
                whileTap={{ scale: 0.9 }}
                whileHover={{ scale: 1.1 }}
                title={acc.name}
              >
                <span className="text-lg">{acc.emoji}</span>
              </motion.button>
            ))}
          </div>
          {/* Next reward hint */}
          {(() => {
            const nextReward = ACCESSORY_REWARDS.find(
              r => r.streak > currentStreak && !accessories.some(a => a.id === r.id)
            );
            if (nextReward) {
              return (
                <p className="text-xs text-[var(--warm-brown)]/60 mt-2">
                  Next reward: {nextReward.emoji} at {nextReward.streak} streak
                </p>
              );
            }
            return null;
          })()}
        </div>
      )}

      {/* Broken line repair */}
      {isLineBroken && (
        <motion.button
          className="w-full py-3 rounded-xl bg-gradient-to-r from-red-400 to-red-500 text-white font-medium flex items-center justify-center gap-2 cursor-pointer"
          onClick={repairLine}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          🔧 Repair Fishing Line
        </motion.button>
      )}

      {/* Fullscreen Toggle */}
      <motion.button
        className="w-full py-3 rounded-xl bg-white/10 text-[var(--warm-brown)] font-medium flex items-center justify-center gap-2 hover:bg-white/20 transition-colors cursor-pointer"
        onClick={toggleFullscreen}
        whileTap={{ scale: 0.98 }}
      >
        {isFullscreen ? (
          <>
            <Minimize className="w-4 h-4" />
            Exit Fullscreen
          </>
        ) : (
          <>
            <Maximize className="w-4 h-4" />
            Deep Immersion Mode
          </>
        )}
      </motion.button>
    </div>
  );
}
