import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw, Coffee, Brain } from 'lucide-react';
import { useStore } from '../store/useStore';

export function FocusTimer() {
  const {
    isActive,
    isPaused,
    timeRemaining,
    sessionType,
    focusDuration,
    breakDuration,
    startTimer,
    pauseTimer,
    resumeTimer,
    resetTimer,
    tick,
    completeSession,
    setSessionType,
    setFocusDuration,
    setBreakDuration,
  } = useStore();

  const intervalRef = useRef<number | null>(null);
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 640);

  // Timer tick effect
  useEffect(() => {
    if (isActive && !isPaused) {
      intervalRef.current = window.setInterval(() => {
        tick();
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, isPaused, tick]);

  useEffect(() => {
    const media = window.matchMedia('(max-width: 639px)');
    const handleChange = () => setIsMobile(media.matches);
    handleChange();
    media.addEventListener('change', handleChange);
    return () => media.removeEventListener('change', handleChange);
  }, []);

  // Check for completion
  useEffect(() => {
    if (timeRemaining === 0 && isActive) {
      completeSession();
    }
  }, [timeRemaining, isActive, completeSession]);

  // Format time display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculate progress
  const totalDuration = sessionType === 'focus' ? focusDuration * 60 : breakDuration * 60;
  const progress = ((totalDuration - timeRemaining) / totalDuration) * 100;

  const size = isMobile ? 224 : 286;
  const strokeWidth = isMobile ? 7 : 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const handlePlayPause = () => {
    if (!isActive) {
      startTimer();
    } else if (isPaused) {
      resumeTimer();
    } else {
      pauseTimer();
    }
  };

  return (
    <div className="flex w-full flex-col items-center gap-5">
      {/* Session Type Toggle */}
      <div className="grid w-full grid-cols-2 gap-1 rounded-2xl border border-white/65 bg-white/60 p-1">
        <motion.button
          className={`flex items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-xs font-medium transition-colors sm:text-sm ${
            sessionType === 'focus'
              ? 'bg-[var(--color-primary-600)] text-white shadow-sm'
              : 'text-[var(--text-soft)] hover:bg-white/45 active:bg-white/60'
          }`}
          onClick={() => setSessionType('focus')}
          whileTap={{ scale: 0.95 }}
          disabled={isActive}
        >
          <Brain className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          Focus
        </motion.button>
        <motion.button
          className={`flex items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-xs font-medium transition-colors sm:text-sm ${
            sessionType === 'break'
              ? 'bg-[var(--color-accent-500)] text-white shadow-sm'
              : 'text-[var(--text-soft)] hover:bg-white/45 active:bg-white/60'
          }`}
          onClick={() => setSessionType('break')}
          whileTap={{ scale: 0.95 }}
          disabled={isActive}
        >
          <Coffee className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          Break
        </motion.button>
      </div>

      {/* Time Presets (only when not active) */}
      {!isActive && (
        <div className="w-full space-y-2.5">
          {/* Quick Presets */}
          <div className="grid grid-cols-3 gap-1.5">
            {[
              { focus: 25, break: 5, label: '25/5' },
              { focus: 50, break: 10, label: '50/10' },
              { focus: 90, break: 20, label: '90/20' },
            ].map((preset) => (
              <motion.button
                key={preset.label}
                className={`rounded-xl px-2 py-2 text-xs font-medium transition-colors sm:text-sm ${
                  focusDuration === preset.focus && breakDuration === preset.break
                    ? 'bg-[var(--color-primary-600)] text-white'
                    : 'bg-white/65 text-[var(--text-soft)] active:bg-white/80'
                }`}
                onClick={() => {
                  setFocusDuration(preset.focus);
                  setBreakDuration(preset.break);
                }}
                whileTap={{ scale: 0.95 }}
              >
                {preset.label}
              </motion.button>
            ))}
          </div>

          {/* Custom Slider */}
          <div className="rounded-2xl border border-white/65 bg-white/55 p-3">
            <div className="flex justify-between text-xs text-[var(--text-soft)]">
              <span>Focus: {focusDuration} min</span>
              <span>Break: {breakDuration} min</span>
            </div>
            <input
              type="range"
              min="5"
              max="120"
              step="5"
              value={focusDuration}
              onChange={(e) => {
                const newFocus = parseInt(e.target.value);
                setFocusDuration(newFocus);
                // Auto-adjust break time (roughly 1/5 of focus)
                setBreakDuration(Math.max(5, Math.round(newFocus / 5)));
              }}
              className="mt-2 w-full cursor-pointer appearance-none rounded-lg accent-[var(--color-primary-600)]"
            />
            <div className="mt-1 flex justify-between text-[10px] text-[var(--text-soft)]">
              <span>5m</span>
              <span>60m</span>
              <span>120m</span>
            </div>
          </div>
        </div>
      )}

      {/* Timer Circle */}
      <div className="relative">
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="rgba(255, 255, 255, 0.15)"
            strokeWidth={strokeWidth}
          />
          
          {/* Progress circle */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={sessionType === 'focus' ? 'var(--color-primary-600)' : 'var(--color-accent-500)'}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            initial={false}
            animate={{ strokeDashoffset }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />

          {/* Glow effect */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={sessionType === 'focus' ? 'var(--color-primary-600)' : 'var(--color-accent-500)'}
            strokeWidth={strokeWidth + 4}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            opacity={0.3}
            filter="blur(8px)"
          />
        </svg>

        {/* Timer display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className="text-5xl font-display tabular-nums tracking-[0.05em] text-[var(--text-strong)] sm:text-7xl"
            key={timeRemaining}
            initial={{ scale: 1 }}
            animate={{ scale: timeRemaining <= 10 && isActive ? [1, 1.1, 1] : 1 }}
            transition={{ duration: 0.3 }}
          >
            {formatTime(timeRemaining)}
          </motion.span>
          <span className="mt-1 text-xs font-medium uppercase tracking-[0.16em] text-[var(--text-soft)] sm:mt-2 sm:text-sm sm:tracking-[0.2em]">
            {sessionType === 'focus' ? 'Focus Time' : 'Break Time'}
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4 sm:gap-6">
        {/* Reset button */}
        <motion.button
          className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-white/65 bg-white/58 text-[var(--text-soft)] transition-colors hover:bg-white/78 sm:h-14 sm:w-14"
          onClick={resetTimer}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title="Reset timer"
          aria-label="Đặt lại bộ đếm"
        >
          <RotateCcw className="w-5 h-5 sm:w-6 sm:h-6" />
        </motion.button>

        {/* Play/Pause button */}
        <motion.button
          className={`flex h-16 w-16 items-center justify-center rounded-full text-white shadow-xl transition-all sm:h-20 sm:w-20 ${
            sessionType === 'focus'
              ? 'bg-gradient-to-br from-[var(--color-primary-500)] to-[var(--color-primary-600)] shadow-[var(--color-primary-600)]/35'
              : 'bg-gradient-to-br from-[var(--color-accent-500)] to-[var(--soft-blue-dark)] shadow-[var(--color-accent-500)]/35'
          }`}
          onClick={handlePlayPause}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label={!isActive || isPaused ? 'Bắt đầu hoặc tiếp tục phiên học' : 'Tạm dừng phiên học'}
        >
          {!isActive || isPaused ? (
            <Play className="w-6 h-6 sm:w-8 sm:h-8 ml-1" fill="currentColor" />
          ) : (
            <Pause className="w-6 h-6 sm:w-8 sm:h-8" fill="currentColor" />
          )}
        </motion.button>

        {/* Placeholder for symmetry */}
        <div className="w-11 h-11 sm:w-14 sm:h-14" />
      </div>

      {/* Duration info */}
      <p className="text-sm font-medium tracking-wide text-[var(--text-soft)]">
        {sessionType === 'focus' ? `${focusDuration} phút tập trung` : `${breakDuration} phút nghỉ`}
      </p>
    </div>
  );
}
