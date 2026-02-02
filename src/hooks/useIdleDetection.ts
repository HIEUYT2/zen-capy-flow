import { useEffect, useCallback } from 'react';
import { useStore } from '../store/useStore';

const IDLE_TIMEOUT = 5 * 60 * 1000; // 5 minutes in milliseconds

/**
 * Hook to detect idle state and make Capybara sleep
 */
export function useIdleDetection() {
  const { 
    capyMood, 
    lastInteractionTime, 
    goToSleep, 
    wakeUp, 
    updateInteractionTime,
    isActive // Don't sleep if timer is running
  } = useStore();

  // Check for idle state
  useEffect(() => {
    if (isActive) return; // Don't sleep during focus sessions

    const checkIdle = () => {
      const now = Date.now();
      const timeSinceInteraction = now - lastInteractionTime;

      if (timeSinceInteraction >= IDLE_TIMEOUT && capyMood !== 'sleeping') {
        goToSleep();
      }
    };

    const interval = setInterval(checkIdle, 10000); // Check every 10 seconds

    return () => clearInterval(interval);
  }, [lastInteractionTime, capyMood, goToSleep, isActive]);

  // Handle mouse/keyboard activity to wake up
  const handleActivity = useCallback(() => {
    if (capyMood === 'sleeping') {
      wakeUp();
    } else {
      updateInteractionTime();
    }
  }, [capyMood, wakeUp, updateInteractionTime]);

  // Listen for user activity
  useEffect(() => {
    const events = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll'];
    
    // Throttle the handler to avoid too many updates
    let lastCall = 0;
    const throttledHandler = () => {
      const now = Date.now();
      if (now - lastCall > 1000) { // Max once per second
        lastCall = now;
        handleActivity();
      }
    };

    events.forEach(event => {
      window.addEventListener(event, throttledHandler, { passive: true });
    });

    return () => {
      events.forEach(event => {
        window.removeEventListener(event, throttledHandler);
      });
    };
  }, [handleActivity]);
}
