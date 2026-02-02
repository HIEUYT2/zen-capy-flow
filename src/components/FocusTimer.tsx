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
    <div className="flex flex-col items-center gap-6">
      {/* Session Type Toggle */}
      <div className="glass flex p-1 gap-1">
        <motion.button
          className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-sm font-medium transition-colors cursor-pointer ${
            sessionType === 'focus'
              ? 'bg-[var(--sage-green)] text-white'
              : 'text-[var(--warm-brown)] hover:bg-white/20'
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
              ? 'bg-[var(--soft-blue)] text-white'
              : 'text-[var(--warm-brown)] hover:bg-white/20'
          }`}
          onClick={() => setSessionType('break')}
          whileTap={{ scale: 0.95 }}
          disabled={isActive}
        >
          <Coffee className="w-4 h-4" />
          Break
        </motion.button>
      </div>

      {/* Timer Circle */}
      <div className="relative">
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="rgba(255, 255, 255, 0.2)"
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
            className="text-6xl font-display text-[var(--warm-brown-dark)] tabular-nums"
            key={timeRemaining}
            initial={{ scale: 1 }}
            animate={{ scale: timeRemaining <= 10 && isActive ? [1, 1.1, 1] : 1 }}
            transition={{ duration: 0.3 }}
          >
            {formatTime(timeRemaining)}
          </motion.span>
          <span className="text-sm text-[var(--warm-brown)]/70 mt-2 uppercase tracking-wider">
            {sessionType === 'focus' ? 'Focus Time' : 'Break Time'}
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4">
        {/* Reset button */}
        <motion.button
          className="glass w-12 h-12 flex items-center justify-center text-[var(--warm-brown)] hover:bg-white/20 transition-colors cursor-pointer"
          onClick={resetTimer}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <RotateCcw className="w-5 h-5" />
        </motion.button>

        {/* Play/Pause button */}
        <motion.button
          className={`w-16 h-16 rounded-full flex items-center justify-center text-white shadow-lg cursor-pointer ${
            sessionType === 'focus'
              ? 'bg-gradient-to-br from-[var(--sage-green)] to-[var(--sage-dark)]'
              : 'bg-gradient-to-br from-[var(--soft-blue)] to-[var(--soft-blue-dark)]'
          }`}
          onClick={handlePlayPause}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {!isActive || isPaused ? (
            <Play className="w-6 h-6 ml-1" fill="currentColor" />
          ) : (
            <Pause className="w-6 h-6" fill="currentColor" />
          )}
        </motion.button>

        {/* Placeholder for symmetry */}
        <div className="w-12 h-12" />
      </div>

      {/* Duration info */}
      <p className="text-sm text-[var(--warm-brown)]/60">
        {sessionType === 'focus' ? `${focusDuration} min session` : `${breakDuration} min break`}
      </p>
    </div>
  );
}
