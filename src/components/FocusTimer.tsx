import { useEffect, useRef } from 'react';
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

  // Circle SVG dimensions
  const size = 280;
  const strokeWidth = 8;
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
    <div className="flex flex-col items-center gap-6 w-full">
      {/* Session Type Toggle */}
      <div className="glass flex p-1 gap-1">
        <motion.button
          className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-sm font-medium transition-colors cursor-pointer ${
            sessionType === 'focus'
              ? 'bg-[var(--sage-green)] text-white shadow-sm'
              : 'text-[var(--warm-brown)] hover:bg-white/20 active:bg-white/30'
          }`}
          onClick={() => setSessionType('focus')}
          whileTap={{ scale: 0.95 }}
          disabled={isActive}
        >
          <Brain className="w-4 h-4" />
          Focus
        </motion.button>
        <motion.button
          className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-sm font-medium transition-colors cursor-pointer ${
            sessionType === 'break'
              ? 'bg-[var(--soft-blue)] text-white shadow-sm'
              : 'text-[var(--warm-brown)] hover:bg-white/20 active:bg-white/30'
          }`}
          onClick={() => setSessionType('break')}
          whileTap={{ scale: 0.95 }}
          disabled={isActive}
        >
          <Coffee className="w-4 h-4" />
          Break
        </motion.button>
      </div>

      {/* Time Presets (only when not active) */}
      {!isActive && (
        <div className="w-full space-y-3">
          {/* Quick Presets */}
          <div className="flex justify-center gap-2">
            {[
              { focus: 25, break: 5, label: '25/5' },
              { focus: 50, break: 10, label: '50/10' },
              { focus: 90, break: 20, label: '90/20' },
            ].map((preset) => (
              <motion.button
                key={preset.label}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                  focusDuration === preset.focus && breakDuration === preset.break
                    ? 'bg-[var(--sage-green)] text-white'
                    : 'glass text-[var(--warm-brown)] active:bg-white/30'
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
          <div className="glass p-3 space-y-2">
            <div className="flex justify-between text-xs text-[var(--warm-brown)]/70">
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
              className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-[var(--sage-green)]"
            />
            <div className="flex justify-between text-[10px] text-[var(--warm-brown)]/50">
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
            stroke={sessionType === 'focus' ? 'var(--sage-green)' : 'var(--soft-blue)'}
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
            stroke={sessionType === 'focus' ? 'var(--sage-green)' : 'var(--soft-blue)'}
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
            className="text-7xl font-display text-[var(--warm-brown-dark)] tabular-nums tracking-widest"
            key={timeRemaining}
            initial={{ scale: 1 }}
            animate={{ scale: timeRemaining <= 10 && isActive ? [1, 1.1, 1] : 1 }}
            transition={{ duration: 0.3 }}
          >
            {formatTime(timeRemaining)}
          </motion.span>
          <span className="text-sm text-[var(--warm-brown)]/70 mt-2 uppercase tracking-[0.2em] font-medium">
            {sessionType === 'focus' ? 'Focus Time' : 'Break Time'}
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-6">
        {/* Reset button */}
        <motion.button
          className="glass w-14 h-14 flex items-center justify-center text-[var(--warm-brown)] hover:bg-white/20 transition-colors cursor-pointer"
          onClick={resetTimer}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title="Reset Timer"
        >
          <RotateCcw className="w-6 h-6" />
        </motion.button>

        {/* Play/Pause button */}
        <motion.button
          className={`w-20 h-20 rounded-full flex items-center justify-center text-white shadow-xl cursor-pointer transition-all ${
            sessionType === 'focus'
              ? 'bg-gradient-to-br from-[var(--sage-green)] to-[var(--sage-dark)] shadow-[var(--sage-green)]/30'
              : 'bg-gradient-to-br from-[var(--soft-blue)] to-[var(--soft-blue-dark)] shadow-[var(--soft-blue)]/30'
          }`}
          onClick={handlePlayPause}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {!isActive || isPaused ? (
            <Play className="w-8 h-8 ml-1" fill="currentColor" />
          ) : (
            <Pause className="w-8 h-8" fill="currentColor" />
          )}
        </motion.button>

        {/* Placeholder for symmetry -> Replacing with Skip/Next purely visual or potentially useful in future. 
            For now, keeping empty div for balance but adjusting size 
        */}
        <div className="w-14 h-14" />
      </div>

      {/* Duration info */}
      <p className="text-sm text-[var(--warm-brown)]/60 font-medium tracking-wide">
        {sessionType === 'focus' ? `${focusDuration} min session` : `${breakDuration} min break`}
      </p>
    </div>
  );
}
