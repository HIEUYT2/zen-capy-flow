// @ts-nocheck
import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';
import { useEffect, useState } from 'react';

type ThemeType = 'sunny' | 'rainy' | 'night';

// Parallax layer components
function Firefly({ delay = 0 }: { delay?: number }) {
  const [position] = useState(() => ({
    x: Math.random() * 100,
    y: Math.random() * 70,
  }));

  return (
    <motion.div
      className="absolute w-2 h-2 rounded-full"
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        background: 'radial-gradient(circle, #FFE87C 0%, #FFD700 30%, transparent 70%)',
        boxShadow: '0 0 10px 5px rgba(255, 232, 124, 0.5)',
      }}
      animate={{
        x: [0, 30, -20, 40, 0],
        y: [0, -20, 30, -10, 0],
        opacity: [0.3, 1, 0.5, 1, 0.3],
        scale: [1, 1.2, 0.8, 1.1, 1],
      }}
      transition={{
        duration: 8 + Math.random() * 4,
        delay,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  );
}

function Leaf({ delay = 0 }: { delay?: number }) {
  const [startX] = useState(() => Math.random() * 100);

  return (
    <motion.div
      className="absolute text-2xl"
      style={{ left: `${startX}%` }}
      initial={{ y: '-10%', rotate: 0, opacity: 0 }}
      animate={{
        y: '110%',
        rotate: [0, 180, 360],
        x: [0, 30, -30, 20, 0],
        opacity: [0, 1, 1, 1, 0],
      }}
      transition={{
        duration: 15 + Math.random() * 10,
        delay,
        repeat: Infinity,
        ease: 'linear',
      }}
    >
      🍂
    </motion.div>
  );
}

function ShootingStar({ delay = 0 }: { delay?: number }) {
  const [position] = useState(() => ({
    x: 20 + Math.random() * 60,
    y: 5 + Math.random() * 30,
  }));

  return (
    <motion.div
      className="absolute w-1 h-1 bg-white rounded-full"
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        boxShadow: '0 0 6px 2px white',
      }}
      initial={{ opacity: 0, x: 0, y: 0 }}
      animate={{
        opacity: [0, 1, 1, 0],
        x: [0, 100],
        y: [0, 50],
      }}
      transition={{
        duration: 1,
        delay: delay + Math.random() * 20,
        repeat: Infinity,
        repeatDelay: 15 + Math.random() * 20,
      }}
    />
  );
}

function Lightning() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() < 0.1) { // 10% chance every check
        setShow(true);
        setTimeout(() => setShow(false), 200);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  if (!show) return null;

  return (
    <motion.div
      className="fixed inset-0 bg-white/20 pointer-events-none z-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 1, 0, 0.5, 0] }}
      transition={{ duration: 0.3 }}
    />
  );
}

function Cloud({ delay = 0, className = '', speed = 1 }: { delay?: number; className?: string; speed?: number }) {
  return (
    <motion.div
      className={`absolute opacity-60 ${className}`}
      initial={{ x: '-100%' }}
      animate={{ x: '200vw' }}
      transition={{
        duration: 60 / speed,
        delay,
        repeat: Infinity,
        ease: 'linear',
      }}
    >
      <svg viewBox="0 0 100 40" className="w-32 h-12 fill-white/50">
        <ellipse cx="30" cy="25" rx="25" ry="15" />
        <ellipse cx="55" cy="20" rx="20" ry="12" />
        <ellipse cx="75" cy="25" rx="18" ry="10" />
      </svg>
    </motion.div>
  );
}

function RainDrop({ delay = 0, left = 0 }: { delay?: number; left?: number }) {
  return (
    <motion.div
      className="absolute w-0.5 h-8 bg-gradient-to-b from-transparent via-[var(--soft-blue)]/50 to-[var(--soft-blue)]/20 rounded-full"
      style={{ left: `${left}%` }}
      initial={{ y: '-100vh', opacity: 0 }}
      animate={{ y: '100vh', opacity: [0, 1, 1, 0] }}
      transition={{
        duration: 1.5,
        delay,
        repeat: Infinity,
        ease: 'linear',
      }}
    />
  );
}

function Star({ x, y, size = 2, delay = 0 }: { x: number; y: number; size?: number; delay?: number }) {
  return (
    <motion.div
      className="absolute rounded-full bg-white"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: size,
        height: size,
      }}
      animate={{
        opacity: [0.3, 1, 0.3],
        scale: [1, 1.2, 1],
      }}
      transition={{
        duration: 2 + Math.random() * 2,
        delay,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  );
}

const themeConfigs: Record<ThemeType, { gradient: string; waterColor: string }> = {
  sunny: {
    gradient: 'from-[#87CEEB] via-[#98D8EA] to-[#E8DCC4]',
    waterColor: 'rgba(167, 199, 231, 0.6)',
  },
  rainy: {
    gradient: 'from-[#4A5568] via-[#667788] to-[#8899AA]',
    waterColor: 'rgba(100, 130, 160, 0.7)',
  },
  night: {
    gradient: 'from-[#1A1B2E] via-[#2D2F4A] to-[#3D405A]',
    waterColor: 'rgba(40, 50, 80, 0.8)',
  },
};

export function Background() {
  const { theme, mouseX, mouseY, setMousePosition } = useStore();
  const config = themeConfigs[theme as ThemeType];

  // Track mouse for parallax
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;
      setMousePosition(x, y);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [setMousePosition]);

  // Parallax offset calculations
  const parallaxOffset = {
    far: { x: (mouseX - 0.5) * 20, y: (mouseY - 0.5) * 10 },
    mid: { x: (mouseX - 0.5) * 40, y: (mouseY - 0.5) * 20 },
    near: { x: (mouseX - 0.5) * 60, y: (mouseY - 0.5) * 30 },
  };

  // Generate elements
  const stars = Array.from({ length: 50 }, (_, i) => ({
    x: Math.random() * 100,
    y: Math.random() * 60,
    size: 1 + Math.random() * 2,
    delay: Math.random() * 3,
  }));

  const rainDrops = Array.from({ length: 50 }, (_, i) => ({
    left: Math.random() * 100,
    delay: Math.random() * 2,
  }));

  const fireflies = Array.from({ length: 15 }, (_, i) => ({
    delay: i * 0.5,
  }));

  const leaves = Array.from({ length: 8 }, (_, i) => ({
    delay: i * 2,
  }));

  const shootingStars = Array.from({ length: 3 }, (_, i) => ({
    delay: i * 8,
  }));

  return (
    <motion.div
      className={`fixed inset-0 bg-gradient-to-b ${config.gradient} overflow-hidden -z-10`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
      key={theme} // Re-render on theme change for smooth transition
    >
      {/* LAYER 1: FAR - Clouds/Stars (slowest parallax) */}
      <motion.div
        className="absolute inset-0"
        style={{
          transform: `translate(${parallaxOffset.far.x}px, ${parallaxOffset.far.y}px)`,
        }}
        transition={{ type: 'spring', stiffness: 50, damping: 30 }}
      >
        {/* Sun (sunny theme) */}
        {theme === 'sunny' && (
          <motion.div
            className="absolute top-10 right-20 w-24 h-24"
            animate={{
              scale: [1, 1.05, 1],
              opacity: [0.9, 1, 0.9],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <div className="w-full h-full rounded-full bg-gradient-to-br from-yellow-200 to-orange-300 shadow-lg shadow-orange-200/50" />
            <div className="absolute inset-0 rounded-full bg-yellow-200/30 blur-xl" />
          </motion.div>
        )}

        {/* Moon (night theme) */}
        {theme === 'night' && (
          <motion.div
            className="absolute top-16 right-24"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          >
            <div className="relative w-20 h-20">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-yellow-100 to-yellow-200 shadow-lg shadow-yellow-100/30" />
              <div className="absolute top-2 right-2 w-14 h-14 rounded-full bg-[#1A1B2E]" />
            </div>
          </motion.div>
        )}

        {/* Far clouds */}
        {(theme === 'sunny' || theme === 'rainy') && (
          <>
            <Cloud delay={0} className="top-10" speed={0.5} />
            <Cloud delay={20} className="top-5" speed={0.4} />
          </>
        )}

        {/* Stars */}
        {theme === 'night' && stars.map((star, i) => (
          <Star key={i} {...star} />
        ))}
      </motion.div>

      {/* LAYER 2: MID - Fireflies/Leaves/Shooting Stars */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          transform: `translate(${parallaxOffset.mid.x}px, ${parallaxOffset.mid.y}px)`,
        }}
        transition={{ type: 'spring', stiffness: 100, damping: 30 }}
      >
        {/* Fireflies for night */}
        {theme === 'night' && fireflies.map((ff, i) => (
          <Firefly key={i} delay={ff.delay} />
        ))}

        {/* Shooting stars */}
        {theme === 'night' && shootingStars.map((ss, i) => (
          <ShootingStar key={i} delay={ss.delay} />
        ))}

        {/* Falling leaves for sunny */}
        {theme === 'sunny' && leaves.map((leaf, i) => (
          <Leaf key={i} delay={leaf.delay} />
        ))}

        {/* Mid-layer clouds */}
        {(theme === 'sunny' || theme === 'rainy') && (
          <>
            <Cloud delay={10} className="top-20" speed={0.8} />
            <Cloud delay={35} className="top-16" speed={0.7} />
          </>
        )}
      </motion.div>

      {/* LAYER 3: NEAR - Rain/Particles (fastest parallax) */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          transform: `translate(${parallaxOffset.near.x}px, ${parallaxOffset.near.y}px)`,
        }}
        transition={{ type: 'spring', stiffness: 150, damping: 30 }}
      >
        {/* Rain */}
        {theme === 'rainy' && (
          <>
            {rainDrops.map((drop, i) => (
              <RainDrop key={i} left={drop.left} delay={drop.delay} />
            ))}
            <Lightning />
          </>
        )}
      </motion.div>

      {/* Water/Lake at bottom (no parallax) */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-32"
        style={{ backgroundColor: config.waterColor }}
        animate={{ opacity: [0.6, 0.8, 0.6] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      >
        <svg className="absolute bottom-0 left-0 right-0 h-full w-full opacity-30">
          <defs>
            <pattern id="water-pattern" x="0" y="0" width="100" height="20" patternUnits="userSpaceOnUse">
              <motion.path
                d="M0 10 Q25 0 50 10 T100 10"
                fill="none"
                stroke="white"
                strokeWidth="1"
                animate={{
                  d: [
                    'M0 10 Q25 0 50 10 T100 10',
                    'M0 10 Q25 20 50 10 T100 10',
                    'M0 10 Q25 0 50 10 T100 10',
                  ],
                }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#water-pattern)" />
        </svg>
      </motion.div>
    </motion.div>
  );
}
