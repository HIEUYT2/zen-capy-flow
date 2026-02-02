import { useEffect } from 'react';
import { useStore } from '../store/useStore';

/**
 * Keyboard shortcuts for CapyFlow
 * Space: Start/Pause Timer
 * M: Toggle Mute
 * C: Cast Line
 * /: Open Music Command Bar
 * Esc: Close modals
 * J: Toggle Journal
 * H: Toggle Mini Mode (Hide)
 */
export function useKeyboardShortcuts() {
  const {
    isActive,
    isPaused,
    startTimer,
    pauseTimer,
    resumeTimer,
    toggleMute,
    startCasting,
    isCasting,
    isLineBroken,
    toggleCommandBar,
    isCommandBarOpen,
    showJournal,
    toggleJournal,
    showFishModal,
    closeFishModal,
    toggleMiniMode,
    showCapyChat,
    toggleCapyChat,
  } = useStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in input
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      switch (e.code) {
        case 'Space':
          e.preventDefault();
          if (!isActive) {
            startTimer();
          } else if (isPaused) {
            resumeTimer();
          } else {
            pauseTimer();
          }
          break;

        case 'KeyM':
          e.preventDefault();
          toggleMute();
          break;

        case 'KeyC':
          e.preventDefault();
          if (!isCasting && !isLineBroken) {
            startCasting();
          }
          break;

        case 'Slash':
          e.preventDefault();
          toggleCommandBar();
          break;

        case 'KeyJ':
          e.preventDefault();
          toggleJournal();
          break;

        case 'KeyH':
          e.preventDefault();
          toggleMiniMode();
          break;

        case 'KeyT':
          e.preventDefault();
          toggleCapyChat();
          break;

        case 'Escape':
          e.preventDefault();
          if (showFishModal) {
            closeFishModal();
          } else if (isCommandBarOpen) {
            toggleCommandBar();
          } else if (showJournal) {
            toggleJournal();
          } else if (showCapyChat) {
            toggleCapyChat();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    isActive,
    isPaused,
    startTimer,
    pauseTimer,
    resumeTimer,
    toggleMute,
    startCasting,
    isCasting,
    isLineBroken,
    toggleCommandBar,
    isCommandBarOpen,
    showJournal,
    toggleJournal,
    showFishModal,
    closeFishModal,
    toggleMiniMode,
    showCapyChat,
    toggleCapyChat,
  ]);
}
