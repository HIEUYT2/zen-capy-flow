import { useEffect } from 'react';
import { useStore } from '../store/useStore';

/**
 * Hook to automatically switch themes based on time of day
 * - Sunny: 6:00 - 17:00
 * - Night: 18:00 - 5:00
 * - Rainy: 15% random chance each hour
 */
export function useAutoTheme() {
  const { autoTheme, setTheme, theme } = useStore();

  useEffect(() => {
    if (!autoTheme) return;

    const updateTheme = () => {
      const hour = new Date().getHours();
      
      // Random chance for rainy (15%)
      const isRainy = Math.random() < 0.15;
      
      if (isRainy && theme !== 'rainy') {
        setTheme('rainy');
        return;
      }

      // Night: 18:00 - 5:00
      if (hour >= 18 || hour < 6) {
        if (theme !== 'night' && !isRainy) {
          setTheme('night');
        }
      }
      // Sunny: 6:00 - 17:00
      else {
        if (theme !== 'sunny' && !isRainy) {
          setTheme('sunny');
        }
      }
    };

    // Initial update
    updateTheme();

    // Update every minute
    const interval = setInterval(updateTheme, 60 * 1000);

    return () => clearInterval(interval);
  }, [autoTheme, setTheme, theme]);
}
