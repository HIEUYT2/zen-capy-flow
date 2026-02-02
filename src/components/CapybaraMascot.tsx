import { motion, AnimatePresence, type Easing } from 'framer-motion';
import { useStore } from '../store/useStore';
import { useSoundEffects } from '../hooks/useSoundEffects';

// Typed ease values for framer-motion
const easeInOut: Easing = [0.42, 0, 0.58, 1];
const easeOut: Easing = [0, 0, 0.58, 1];

// Animation variants
const capybaraVariants = {
  idle: {
    y: [0, -3, 0],
    transition: { duration: 3, repeat: Infinity, ease: easeInOut },
  },
  fishing: {
    y: [0, -5, 0],
    transition: { duration: 2, repeat: Infinity, ease: easeInOut },
  },
  happy: {
    y: [0, -8, 0],
    scale: [1, 1.05, 1],
    transition: { duration: 0.5, repeat: 3 },
  },
  sleeping: {
    y: 0,
    rotate: 10,
    transition: { duration: 1, ease: easeInOut },
  },
  waking: {
    y: [0, -10, 0],
    rotate: [10, -5, 0],
    transition: { duration: 0.5 },
  },
  catch: {
    y: [-10, 5, -5, 0],
    rotate: [0, -5, 5, 0],
    transition: { duration: 0.8, ease: easeOut },
  },
  broken: {
    y: [0, -2, 0],
    transition: { duration: 4, repeat: Infinity, ease: easeInOut },
  },
};

const tailVariants = {
  idle: {
    rotate: [0, 8, 0, -8, 0],
    transition: { duration: 2.5, repeat: Infinity, ease: easeInOut },
  },
  happy: {
    rotate: [0, 15, -15, 15, -15, 0],
    transition: { duration: 0.8, repeat: 2 },
  },
  sleeping: {
    rotate: 0,
    transition: { duration: 0.5 },
  },
  catch: {
    rotate: [0, 20, -20, 15, -15, 0],
    transition: { duration: 0.6, ease: easeOut },
  },
};

const fishingLineVariants = {
  idle: {
    rotate: 0,
    transition: { duration: 0.5 },
  },
  casting: {
    rotate: [-60, 20, 0],
    transition: { duration: 0.8, ease: easeOut },
  },
  catch: {
    rotate: [-15, -25, -15],
    transition: { duration: 0.5, ease: easeOut },
  },
};

const bobberVariants = {
  idle: {
    y: [0, 4, 0, 4, 0],
    transition: { duration: 3, repeat: Infinity, ease: easeInOut },
  },
  casting: {
    x: [0, -80, -100],
    y: [0, -50, 80],
    transition: { duration: 0.8, ease: easeOut },
  },
  catch: {
    y: [-20, -30, -25],
    scale: [1, 1.2, 1],
    transition: { duration: 0.4, ease: easeOut },
  },
};

// Floating hearts component
function FloatingHearts() {
  const hearts = Array.from({ length: 5 }, (_, i) => ({
    id: i,
    x: 180 + Math.random() * 40,
    delay: i * 0.15,
  }));

  return (
    <g>
      {hearts.map((heart) => (
        <motion.text
          key={heart.id}
          x={heart.x}
          y="160"
          fontSize="20"
          initial={{ y: 160, opacity: 1, scale: 0.5 }}
          animate={{
            y: [160, 100, 60],
            opacity: [1, 1, 0],
            scale: [0.5, 1.2, 0.8],
            x: [heart.x, heart.x + (Math.random() - 0.5) * 40],
          }}
          transition={{
            duration: 1.5,
            delay: heart.delay,
            ease: 'easeOut',
          }}
        >
          ❤️
        </motion.text>
      ))}
    </g>
  );
}

// Sleeping Zzz bubbles
function SleepBubbles() {
  return (
    <g>
      {[0, 1, 2].map((i) => (
        <motion.text
          key={i}
          x={230 + i * 15}
          y={130 - i * 20}
          fontSize={14 + i * 4}
          fill="#4A4035"
          initial={{ opacity: 0, y: 0 }}
          animate={{
            opacity: [0, 1, 1, 0],
            y: [-5, -15],
          }}
          transition={{
            duration: 2,
            delay: i * 0.5,
            repeat: Infinity,
            ease: 'easeOut',
          }}
        >
          Z
        </motion.text>
      ))}
    </g>
  );
}

// Splash effect
function SplashEffect({ show }: { show: boolean }) {
  if (!show) return null;

  return (
    <g>
      {/* Water splash circles */}
      {[0, 1, 2].map((i) => (
        <motion.ellipse
          key={i}
          cx="50"
          cy="290"
          rx="10"
          ry="5"
          fill="none"
          stroke="rgba(167, 199, 231, 0.8)"
          strokeWidth="2"
          initial={{ rx: 5, ry: 2, opacity: 1 }}
          animate={{
            rx: [5, 30 + i * 15],
            ry: [2, 8 + i * 4],
            opacity: [1, 0],
          }}
          transition={{
            duration: 0.8,
            delay: i * 0.1,
            ease: 'easeOut',
          }}
        />
      ))}
      {/* Water droplets */}
      {[0, 1, 2, 3].map((i) => (
        <motion.circle
          key={`drop-${i}`}
          cx={40 + i * 8}
          cy="280"
          r="3"
          fill="rgba(167, 199, 231, 0.8)"
          initial={{ y: 0, opacity: 1 }}
          animate={{
            y: [0, -30, 20],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 0.6,
            delay: 0.3 + i * 0.05,
            ease: 'easeOut',
          }}
        />
      ))}
    </g>
  );
}

// Accessory components
function AccessoryDisplay({ accessoryId }: { accessoryId: string | null }) {
  if (!accessoryId) return null;

  const accessories: Record<string, React.ReactNode> = {
    sunglasses: (
      <motion.g
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Cool sunglasses */}
        <ellipse cx="185" cy="155" rx="12" ry="8" fill="#1a1a2e" opacity="0.9" />
        <ellipse cx="215" cy="155" rx="12" ry="8" fill="#1a1a2e" opacity="0.9" />
        <line x1="197" y1="155" x2="203" y2="155" stroke="#1a1a2e" strokeWidth="3" />
        <line x1="173" y1="155" x2="165" y2="150" stroke="#1a1a2e" strokeWidth="2" />
        <line x1="227" y1="155" x2="235" y2="150" stroke="#1a1a2e" strokeWidth="2" />
      </motion.g>
    ),
    flower: (
      <motion.text
        x="230"
        y="130"
        fontSize="24"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1, rotate: [0, 10, -10, 0] }}
        transition={{ duration: 0.5 }}
      >
        🌸
      </motion.text>
    ),
    orange: (
      <motion.text
        x="190"
        y="125"
        fontSize="28"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        🍊
      </motion.text>
    ),
    crown: (
      <motion.text
        x="180"
        y="120"
        fontSize="32"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 200 }}
      >
        👑
      </motion.text>
    ),
    sparkle: (
      <motion.g
        animate={{
          opacity: [0.5, 1, 0.5],
          scale: [0.9, 1.1, 0.9],
        }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <motion.text
            key={i}
            x={160 + Math.cos((i * Math.PI) / 3) * 60}
            y={180 + Math.sin((i * Math.PI) / 3) * 40}
            fontSize="16"
            animate={{
              opacity: [0.3, 1, 0.3],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: 1.5,
              delay: i * 0.2,
              repeat: Infinity,
            }}
          >
            ⭐
          </motion.text>
        ))}
      </motion.g>
    ),
  };

  return accessories[accessoryId] || null;
}

interface CapybaraMascotProps {
  isCatching?: boolean;
}

export function CapybaraMascot({ isCatching = false }: CapybaraMascotProps) {
  const {
    isLineBroken,
    showFishModal,
    capyMood,
    petCapy,
    isCasting,
    equippedAccessory,
  } = useStore();
  const { playPetSound } = useSoundEffects();

  const getCurrentState = () => {
    if (isCatching || showFishModal) return 'catch';
    if (isLineBroken) return 'broken';
    if (capyMood === 'sleeping') return 'sleeping';
    if (capyMood === 'waking') return 'waking';
    if (capyMood === 'happy') return 'happy';
    if (isCasting) return 'fishing';
    return 'idle';
  };

  const currentState = getCurrentState();

  const handleClick = () => {
    if (capyMood !== 'sleeping') {
      petCapy();
      playPetSound();
    }
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <motion.svg
        viewBox="0 0 400 350"
        className="w-full max-w-lg h-auto cursor-pointer"
        style={{ filter: 'drop-shadow(0 10px 30px rgba(0, 0, 0, 0.15))' }}
        onClick={handleClick}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {/* Water ripples */}
        <motion.ellipse
          cx="200"
          cy="300"
          rx="150"
          ry="20"
          fill="rgba(167, 199, 231, 0.3)"
          animate={{
            rx: [150, 160, 150],
            ry: [20, 22, 20],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Dock */}
        <rect x="80" y="260" width="240" height="20" rx="4" fill="#8B7355" />
        <rect x="90" y="258" width="220" height="6" rx="2" fill="#A68F71" />
        <line x1="120" y1="260" x2="120" y2="280" stroke="#6B5540" strokeWidth="2" />
        <line x1="200" y1="260" x2="200" y2="280" stroke="#6B5540" strokeWidth="2" />
        <line x1="280" y1="260" x2="280" y2="280" stroke="#6B5540" strokeWidth="2" />
        <rect x="100" y="275" width="10" height="35" fill="#6B5540" />
        <rect x="290" y="275" width="10" height="35" fill="#6B5540" />

        {/* Capybara Group */}
        <motion.g
          variants={capybaraVariants}
          animate={currentState}
        >
          {/* Main body */}
          <ellipse cx="200" cy="220" rx="55" ry="40" fill="#A68F71" />
          <ellipse cx="200" cy="225" rx="50" ry="35" fill="#BCA68A" />

          {/* Head */}
          <ellipse cx="200" cy="165" rx="40" ry="35" fill="#A68F71" />
          <ellipse cx="200" cy="170" rx="36" ry="30" fill="#BCA68A" />

          {/* Snout */}
          <ellipse cx="200" cy="182" rx="18" ry="12" fill="#D4B896" />
          <ellipse cx="195" cy="180" rx="3" ry="2" fill="#6B5540" />
          <ellipse cx="205" cy="180" rx="3" ry="2" fill="#6B5540" />

          {/* Eyes */}
          <motion.g
            animate={currentState === 'sleeping' ? { scaleY: 0.1 } : { scaleY: 1 }}
          >
            <circle cx="185" cy="155" r="8" fill="#FFF8E7" />
            <circle cx="185" cy="155" r="5" fill="#4A4035" />
            <circle cx="187" cy="153" r="2" fill="#FFF" />
            
            <circle cx="215" cy="155" r="8" fill="#FFF8E7" />
            <circle cx="215" cy="155" r="5" fill="#4A4035" />
            <circle cx="217" cy="153" r="2" fill="#FFF" />
          </motion.g>

          {/* Accessory */}
          <AccessoryDisplay accessoryId={equippedAccessory} />

          {/* Cheeks (blush) - more visible when happy */}
          <motion.ellipse
            cx="175"
            cy="168"
            rx="8"
            ry="5"
            fill="#E8B4B8"
            animate={{
              opacity: currentState === 'happy' ? 0.9 : 0.6,
            }}
          />
          <motion.ellipse
            cx="225"
            cy="168"
            rx="8"
            ry="5"
            fill="#E8B4B8"
            animate={{
              opacity: currentState === 'happy' ? 0.9 : 0.6,
            }}
          />

          {/* Ears */}
          <ellipse cx="170" cy="138" rx="10" ry="8" fill="#A68F71" />
          <ellipse cx="230" cy="138" rx="10" ry="8" fill="#A68F71" />
          <ellipse cx="170" cy="138" rx="6" ry="5" fill="#D4B896" />
          <ellipse cx="230" cy="138" rx="6" ry="5" fill="#D4B896" />

          {/* Arms/Front legs */}
          <ellipse cx="160" cy="235" rx="12" ry="20" fill="#A68F71" />
          <ellipse cx="240" cy="235" rx="12" ry="20" fill="#A68F71" />

          {/* Tail */}
          <motion.ellipse
            cx="255"
            cy="215"
            rx="8"
            ry="6"
            fill="#8B7355"
            variants={tailVariants}
            animate={currentState === 'happy' ? 'happy' : currentState === 'sleeping' ? 'sleeping' : 'idle'}
          />

          {/* Fishing rod */}
          <motion.g
            variants={fishingLineVariants}
            animate={isCasting ? 'casting' : currentState === 'catch' ? 'catch' : 'idle'}
            style={{ originX: '155px', originY: '200px' }}
          >
            <line x1="155" y1="200" x2="100" y2="120" stroke="#8B7355" strokeWidth="4" strokeLinecap="round" />
            <line x1="100" y1="120" x2="60" y2="100" stroke="#6B5540" strokeWidth="3" strokeLinecap="round" />

            {!isLineBroken && (
              <>
                <motion.line
                  x1="60"
                  y1="100"
                  x2="50"
                  y2="280"
                  stroke="#D4D4D4"
                  strokeWidth="1.5"
                />
                
                <motion.g
                  variants={bobberVariants}
                  animate={isCasting ? 'casting' : currentState === 'catch' ? 'catch' : 'idle'}
                >
                  <ellipse cx="50" cy="285" rx="8" ry="10" fill="#FF6B6B" />
                  <ellipse cx="50" cy="283" rx="6" ry="4" fill="#FF8A8A" />
                  <line x1="50" y1="275" x2="50" y2="295" stroke="#FFF" strokeWidth="2" />
                </motion.g>
              </>
            )}

            {isLineBroken && (
              <>
                <line x1="60" y1="100" x2="55" y2="180" stroke="#D4D4D4" strokeWidth="1.5" />
                <text x="40" y="200" fontSize="16">💔</text>
              </>
            )}
          </motion.g>
        </motion.g>

        {/* Splash effect when casting */}
        <AnimatePresence>
          {isCasting && <SplashEffect show={true} />}
        </AnimatePresence>

        {/* Floating hearts when happy */}
        <AnimatePresence>
          {currentState === 'happy' && <FloatingHearts />}
        </AnimatePresence>

        {/* Sleep bubbles */}
        <AnimatePresence>
          {currentState === 'sleeping' && <SleepBubbles />}
        </AnimatePresence>

        {/* Fish caught animation */}
        {(isCatching || showFishModal) && (
          <motion.g
            initial={{ y: 50, opacity: 0, scale: 0.5 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: 'backOut' }}
          >
            <motion.text
              x="50"
              y="250"
              fontSize="32"
              animate={{ y: [250, 220, 230], rotate: [-10, 10, -10] }}
              transition={{ duration: 0.5, repeat: 2 }}
            >
              🐟
            </motion.text>
            <motion.text
              x="30"
              y="220"
              fontSize="16"
              animate={{ opacity: [0, 1, 0], scale: [0.5, 1.2, 0.5] }}
              transition={{ duration: 0.6, repeat: 2 }}
            >
              ✨
            </motion.text>
            <motion.text
              x="70"
              y="230"
              fontSize="14"
              animate={{ opacity: [0, 1, 0], scale: [0.5, 1.2, 0.5] }}
              transition={{ duration: 0.6, delay: 0.2, repeat: 2 }}
            >
              ⭐
            </motion.text>
          </motion.g>
        )}
      </motion.svg>

      {/* Broken line warning */}
      {isLineBroken && (
        <motion.div
          className="absolute bottom-4 left-1/2 transform -translate-x-1/2 glass px-4 py-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-sm text-[#8B7355] font-medium">
            Oh no! The line broke... 💔
          </p>
        </motion.div>
      )}
    </div>
  );
}
