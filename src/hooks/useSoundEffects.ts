import { useCallback, useEffect, useRef } from 'react';
import { useStore } from '../store/useStore';

// Sound URLs - using free sound effects
const SOUNDS = {
  splash: 'https://cdn.freesound.org/previews/398/398032_1676145-lq.mp3',
  nightAmbient: 'https://cdn.freesound.org/previews/531/531947_5674468-lq.mp3',
  rainAmbient: 'https://cdn.freesound.org/previews/346/346695_1676145-lq.mp3',
  sunnyAmbient: 'https://cdn.freesound.org/previews/520/520635_9497060-lq.mp3',
  petSound: 'https://cdn.freesound.org/previews/456/456968_6142149-lq.mp3',
};

/**
 * Hook to manage ASMR sound effects
 */
export function useSoundEffects() {
  const { soundEnabled, theme, isCasting } = useStore();
  const ambientRef = useRef<HTMLAudioElement | null>(null);
  const effectsRef = useRef<Map<string, HTMLAudioElement>>(new Map());

  // Preload effects
  useEffect(() => {
    Object.entries(SOUNDS).forEach(([key, url]) => {
      const audio = new Audio(url);
      audio.preload = 'auto';
      audio.volume = 0.3;
      effectsRef.current.set(key, audio);
    });

    return () => {
      effectsRef.current.forEach(audio => {
        audio.pause();
        audio.src = '';
      });
      effectsRef.current.clear();
    };
  }, []);

  // Play ambient sound based on theme
  useEffect(() => {
    if (!soundEnabled) {
      if (ambientRef.current) {
        ambientRef.current.pause();
      }
      return;
    }

    const playAmbient = async () => {
      // Stop current ambient
      if (ambientRef.current) {
        ambientRef.current.pause();
      }

      let soundKey: string;
      switch (theme) {
        case 'night':
          soundKey = 'nightAmbient';
          break;
        case 'rainy':
          soundKey = 'rainAmbient';
          break;
        default:
          soundKey = 'sunnyAmbient';
      }

      const audio = effectsRef.current.get(soundKey);
      if (audio) {
        audio.loop = true;
        audio.volume = 0.2;
        ambientRef.current = audio;
        try {
          await audio.play();
        } catch (e) {
          // Autoplay might be blocked, user interaction needed
          console.log('Ambient sound requires user interaction to play');
        }
      }
    };

    playAmbient();

    return () => {
      if (ambientRef.current) {
        ambientRef.current.pause();
      }
    };
  }, [soundEnabled, theme]);

  // Play splash when casting
  useEffect(() => {
    if (isCasting && soundEnabled) {
      const timeout = setTimeout(() => {
        const splashAudio = effectsRef.current.get('splash');
        if (splashAudio) {
          splashAudio.currentTime = 0;
          splashAudio.volume = 0.5;
          splashAudio.play().catch(() => {});
        }
      }, 800); // Delay to sync with bobber landing

      return () => clearTimeout(timeout);
    }
  }, [isCasting, soundEnabled]);

  const playSplash = useCallback(() => {
    if (!soundEnabled) return;
    const audio = effectsRef.current.get('splash');
    if (audio) {
      audio.currentTime = 0;
      audio.volume = 0.5;
      audio.play().catch(() => {});
    }
  }, [soundEnabled]);

  const playPetSound = useCallback(() => {
    if (!soundEnabled) return;
    const audio = effectsRef.current.get('petSound');
    if (audio) {
      audio.currentTime = 0;
      audio.volume = 0.4;
      audio.play().catch(() => {});
    }
  }, [soundEnabled]);

  const stopAmbient = useCallback(() => {
    if (ambientRef.current) {
      ambientRef.current.pause();
    }
  }, []);

  return { playSplash, playPetSound, stopAmbient };
}
