// @ts-nocheck
import { useEffect, useRef } from 'react';
import { useStore } from '../store/useStore';

// Original document title
const originalTitle = 'CapyFlow - Focus with Capy 🦫';

export function useTabVisibility() {
  const {
    isActive,
    isTabActive,
    setTabActive,
    incrementTabAwayTime,
    resetTabAwayTime,
    breakLine,
    tabAwayTime,
    isLineBroken,
  } = useStore();

  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    const handleVisibilityChange = () => {
      const isHidden = document.hidden;

      if (isHidden) {
        // User switched away
        setTabActive(false);

        // Only track if timer is active and line isn't already broken
        if (isActive && !isLineBroken) {
          // Change document title
          document.title = 'Capy misses you! 🥺';

          // Start counting away time
          intervalRef.current = window.setInterval(() => {
            incrementTabAwayTime();
          }, 1000);
        }
      } else {
        // User came back
        setTabActive(true);
        document.title = originalTitle;

        // Clear the away time counter
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }

        // Reset tab away time
        resetTabAwayTime();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      document.title = originalTitle;
    };
  }, [isActive, isLineBroken, setTabActive, incrementTabAwayTime, resetTabAwayTime]);

  // Check if user has been away for more than 30 seconds
  useEffect(() => {
    if (tabAwayTime >= 30 && !isLineBroken && isActive) {
      breakLine();
    }
  }, [tabAwayTime, isLineBroken, isActive, breakLine]);

  // Handle fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isFullscreen = !!document.fullscreenElement;
      useStore.setState({ isFullscreen });
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  return { isTabActive, tabAwayTime };
}
