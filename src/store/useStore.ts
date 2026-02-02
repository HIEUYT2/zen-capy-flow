import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Fish types for rewards
export const FISH_TYPES = [
  { name: 'Golden Koi', rarity: 'legendary', emoji: '🐟' },
  { name: 'Rainbow Trout', rarity: 'rare', emoji: '🌈' },
  { name: 'Zen Carp', rarity: 'common', emoji: '🐠' },
  { name: 'Crystal Salmon', rarity: 'rare', emoji: '💎' },
  { name: 'Moonfish', rarity: 'legendary', emoji: '🌙' },
  { name: 'Sunset Bass', rarity: 'common', emoji: '🌅' },
  { name: 'Lucky Catfish', rarity: 'common', emoji: '🍀' },
  { name: 'Starfish Spirit', rarity: 'rare', emoji: '⭐' },
  { name: 'Dream Guppy', rarity: 'common', emoji: '💭' },
  { name: 'Phoenix Betta', rarity: 'legendary', emoji: '🔥' },
];

// Accessory rewards based on streak
export const ACCESSORY_REWARDS = [
  { streak: 1, id: 'sunglasses', name: 'Cool Sunglasses', emoji: '🕶️' },
  { streak: 3, id: 'flower', name: 'Pretty Flower', emoji: '🌸' },
  { streak: 5, id: 'orange', name: 'Orange Hat', emoji: '🍊' },
  { streak: 10, id: 'crown', name: 'Royal Crown', emoji: '👑' },
  { streak: 25, id: 'sparkle', name: 'Sparkle Aura', emoji: '⭐' },
];

export type Theme = 'sunny' | 'rainy' | 'night';
export type SessionType = 'focus' | 'break';
export type CapyMood = 'idle' | 'sleeping' | 'happy' | 'fishing' | 'waking';

export interface Fish {
  id: string;
  name: string;
  rarity: string;
  emoji: string;
  caughtAt: Date;
}

export interface Accessory {
  id: string;
  name: string;
  emoji: string;
  unlockedAt: Date;
}

// Journal entry for Living Journal feature
export interface JournalEntry {
  id: string;
  date: string;
  quote: string;
  scene: string; // emoji scene
  fishCaught: string;
  duration: number;
}

// Motivational quotes for journal
export const MOTIVATIONAL_QUOTES = [
  "Mỗi bước nhỏ đều là tiến bộ lớn 🌟",
  "Tập trung là siêu năng lực của bạn 💪",
  "Hôm nay bạn đã làm tốt lắm rồi! 🎉",
  "Cá sẽ đến với người kiên nhẫn 🐟",
  "Thành công là tổng của những nỗ lực nhỏ 🏆",
  "Capybara tin tưởng bạn! 🦫",
  "Nghỉ ngơi cũng là một phần của thành công 🌙",
  "Bạn thật tuyệt vời! ⭐",
];

// Scene emojis for journal
export const SCENE_EMOJIS = ['🌅', '🌄', '🏞️', '🌊', '🌺', '🌸', '🍃', '🌿'];

// Capy chat responses
export const CAPY_RESPONSES: Record<string, string[]> = {
  tired: [
    "Đừng lo, cá vẫn đang đợi! 🐟",
    "Nghỉ một chút rồi quay lại nhé 💤",
    "Mình ở đây cùng bạn mà! 🦫",
  ],
  happy: [
    "Tuyệt vời! Tiếp tục nào! 🎉",
    "Woohoo! Bạn đang làm rất tốt! 🌟",
    "Yeah! Mình vui lây nè! 🦫✨",
  ],
  focus: [
    "Hít thở sâu... thở ra... 🧘",
    "Tập trung đi, mình tin bạn! 💪",
  ],
  default: [
    "Mình nghe bạn nè 👂",
    "Cùng cố gắng nhé! 🦫",
  ],
};

interface CapyFlowState {
  // Timer State
  isActive: boolean;
  isPaused: boolean;
  timeRemaining: number;
  sessionType: SessionType;
  focusDuration: number;
  breakDuration: number;

  // Music State
  musicMood: string;
  videoId: string | null;
  volume: number;
  isMuted: boolean;
  isPlaying: boolean;

  // Fish Collection
  fishCaughtCount: number;
  fishCollection: Fish[];
  currentStreak: number;
  showFishModal: boolean;
  lastCaughtFish: Fish | null;

  // Tab & Immersion
  isTabActive: boolean;
  isFullscreen: boolean;
  tabAwayTime: number;
  isLineBroken: boolean;

  // Theme
  theme: Theme;
  autoTheme: boolean;

  // Casting
  isCasting: boolean;

  // Capybara Emotions
  capyMood: CapyMood;
  lastInteractionTime: number;
  accessories: Accessory[];
  equippedAccessory: string | null;

  // Sound
  soundEnabled: boolean;

  // Focus Fog
  focusFogEnabled: boolean;

  // Command Bar
  isCommandBarOpen: boolean;

  // Mouse position for parallax
  mouseX: number;
  mouseY: number;

  // Journal
  journalEntries: JournalEntry[];
  showJournal: boolean;

  // Focus Heatmap
  focusHistory: Record<string, number>; // date string -> sessions count
  ecosystemScore: number;

  // Mini Mode
  isMiniMode: boolean;

  // Capy Chat
  showCapyChat: boolean;
  capyChatMessage: string;
  lastCapyResponse: string;

  // Actions
  startTimer: () => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  resetTimer: () => void;
  tick: () => void;
  completeSession: () => void;
  setSessionType: (type: SessionType) => void;
  setFocusDuration: (minutes: number) => void;
  setBreakDuration: (minutes: number) => void;

  setMusicMood: (mood: string) => void;
  setVideoId: (id: string | null) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  setIsPlaying: (playing: boolean) => void;

  catchFish: () => Fish;
  closeFishModal: () => void;

  setTabActive: (active: boolean) => void;
  incrementTabAwayTime: () => void;
  resetTabAwayTime: () => void;
  breakLine: () => void;
  repairLine: () => void;
  toggleFullscreen: () => void;

  setTheme: (theme: Theme) => void;
  toggleAutoTheme: () => void;
  toggleCommandBar: () => void;

  // Casting actions
  startCasting: () => void;
  endCasting: () => void;

  // Capybara emotions
  petCapy: () => void;
  goToSleep: () => void;
  wakeUp: () => void;
  updateInteractionTime: () => void;
  addAccessory: (accessory: Accessory) => void;
  equipAccessory: (id: string | null) => void;

  // Sound
  toggleSound: () => void;

  // Focus Fog
  toggleFocusFog: () => void;

  // Parallax
  setMousePosition: (x: number, y: number) => void;

  // Journal
  addJournalEntry: (entry: JournalEntry) => void;
  toggleJournal: () => void;

  // Focus History
  recordFocusSession: () => void;

  // Mini Mode
  toggleMiniMode: () => void;

  // Capy Chat
  toggleCapyChat: () => void;
  sendCapyMessage: (message: string) => void;
}

export const useStore = create<CapyFlowState>()(
  persist(
    (set, get) => ({
      // Initial Timer State
      isActive: false,
      isPaused: false,
      timeRemaining: 25 * 60,
      sessionType: 'focus',
      focusDuration: 25,
      breakDuration: 5,

      // Initial Music State
      musicMood: '',
      videoId: null,
      volume: 0.7,
      isMuted: false,
      isPlaying: false,

      // Initial Fish Collection
      fishCaughtCount: 0,
      fishCollection: [],
      currentStreak: 0,
      showFishModal: false,
      lastCaughtFish: null,

      // Initial Tab & Immersion
      isTabActive: true,
      isFullscreen: false,
      tabAwayTime: 0,
      isLineBroken: false,

      // Initial Theme
      theme: 'sunny',
      autoTheme: true,

      // Initial Casting
      isCasting: false,

      // Initial Capybara Emotions
      capyMood: 'idle',
      lastInteractionTime: Date.now(),
      accessories: [],
      equippedAccessory: null,

      // Sound
      soundEnabled: true,

      // Focus Fog
      focusFogEnabled: true,

      // Command Bar
      isCommandBarOpen: false,

      // Mouse position
      mouseX: 0.5,
      mouseY: 0.5,

      // Journal
      journalEntries: [],
      showJournal: false,

      // Focus History
      focusHistory: {},
      ecosystemScore: 50,

      // Mini Mode
      isMiniMode: false,

      // Capy Chat
      showCapyChat: false,
      capyChatMessage: '',
      lastCapyResponse: '',

      // Timer Actions
      startTimer: () => set({
        isActive: true,
        isPaused: false,
        timeRemaining: get().sessionType === 'focus'
          ? get().focusDuration * 60
          : get().breakDuration * 60,
      }),

      pauseTimer: () => set({ isPaused: true }),

      resumeTimer: () => set({ isPaused: false }),

      resetTimer: () => set({
        isActive: false,
        isPaused: false,
        timeRemaining: get().sessionType === 'focus'
          ? get().focusDuration * 60
          : get().breakDuration * 60,
      }),

      tick: () => {
        const { timeRemaining, isActive, isPaused } = get();
        if (isActive && !isPaused && timeRemaining > 0) {
          set({ timeRemaining: timeRemaining - 1 });
        }
      },

      completeSession: () => {
        const { sessionType, focusDuration, breakDuration, currentStreak } = get();
        if (sessionType === 'focus') {
          const fish = get().catchFish();
          const newStreak = currentStreak + 1;
          
          // Check for accessory rewards
          const rewardToUnlock = ACCESSORY_REWARDS.find(
            r => r.streak === newStreak && !get().accessories.some(a => a.id === r.id)
          );
          
          if (rewardToUnlock) {
            get().addAccessory({
              id: rewardToUnlock.id,
              name: rewardToUnlock.name,
              emoji: rewardToUnlock.emoji,
              unlockedAt: new Date(),
            });
          }

          // Add journal entry (Living Journal)
          const quote = MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)];
          const scene = SCENE_EMOJIS[Math.floor(Math.random() * SCENE_EMOJIS.length)];
          get().addJournalEntry({
            id: `journal-${Date.now()}`,
            date: new Date().toISOString(),
            quote,
            scene,
            fishCaught: fish.emoji,
            duration: focusDuration,
          });

          // Record focus session for heatmap
          get().recordFocusSession();

          set({
            isActive: false,
            sessionType: 'break',
            timeRemaining: breakDuration * 60,
            showFishModal: true,
            lastCaughtFish: fish,
          });
        } else {
          set({
            isActive: false,
            sessionType: 'focus',
            timeRemaining: focusDuration * 60,
          });
        }
      },

      setSessionType: (type) => set({
        sessionType: type,
        timeRemaining: type === 'focus'
          ? get().focusDuration * 60
          : get().breakDuration * 60,
        isActive: false,
        isPaused: false,
      }),

      setFocusDuration: (minutes) => set({
        focusDuration: minutes,
        timeRemaining: get().sessionType === 'focus' ? minutes * 60 : get().timeRemaining,
      }),

      setBreakDuration: (minutes) => set({
        breakDuration: minutes,
        timeRemaining: get().sessionType === 'break' ? minutes * 60 : get().timeRemaining,
      }),

      // Music Actions
      setMusicMood: (mood) => set({ musicMood: mood }),
      setVideoId: (id) => set({ videoId: id }),
      setVolume: (volume) => set({ volume: Math.max(0, Math.min(1, volume)) }),
      toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),
      setIsPlaying: (playing) => set({ isPlaying: playing }),

      // Fish Actions
      catchFish: () => {
        const randomFish = FISH_TYPES[Math.floor(Math.random() * FISH_TYPES.length)];
        const newFish: Fish = {
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          ...randomFish,
          caughtAt: new Date(),
        };

        set((state) => ({
          fishCaughtCount: state.fishCaughtCount + 1,
          fishCollection: [...state.fishCollection, newFish],
          currentStreak: state.currentStreak + 1,
          lastCaughtFish: newFish,
        }));

        return newFish;
      },

      closeFishModal: () => set({ showFishModal: false, lastCaughtFish: null }),

      // Tab & Immersion Actions
      setTabActive: (active) => set({ isTabActive: active }),

      incrementTabAwayTime: () => set((state) => ({
        tabAwayTime: state.tabAwayTime + 1,
      })),

      resetTabAwayTime: () => set({ tabAwayTime: 0 }),

      breakLine: () => set({
        isLineBroken: true,
        currentStreak: 0,
      }),

      repairLine: () => set({ isLineBroken: false }),

      toggleFullscreen: () => {
        const { isFullscreen } = get();
        if (!isFullscreen) {
          document.documentElement.requestFullscreen?.();
        } else {
          document.exitFullscreen?.();
        }
        set({ isFullscreen: !isFullscreen });
      },

      // Theme Actions
      setTheme: (theme) => set({ theme }),
      toggleAutoTheme: () => set((state) => ({ autoTheme: !state.autoTheme })),

      // Command Bar
      toggleCommandBar: () => set((state) => ({
        isCommandBarOpen: !state.isCommandBarOpen,
      })),

      // Casting Actions
      startCasting: () => {
        const { isLineBroken, isCasting } = get();
        if (!isLineBroken && !isCasting) {
          set({ isCasting: true, capyMood: 'fishing' });
          // End casting after animation
          setTimeout(() => {
            get().endCasting();
          }, 2000);
        }
      },

      endCasting: () => set({ isCasting: false, capyMood: 'idle' }),

      // Capybara Emotions
      petCapy: () => {
        set({ capyMood: 'happy', lastInteractionTime: Date.now() });
        setTimeout(() => {
          if (get().capyMood === 'happy') {
            set({ capyMood: 'idle' });
          }
        }, 2000);
      },

      goToSleep: () => set({ capyMood: 'sleeping' }),

      wakeUp: () => {
        set({ capyMood: 'waking', lastInteractionTime: Date.now() });
        setTimeout(() => {
          if (get().capyMood === 'waking') {
            set({ capyMood: 'idle' });
          }
        }, 1000);
      },

      updateInteractionTime: () => set({ lastInteractionTime: Date.now() }),

      addAccessory: (accessory) => set((state) => ({
        accessories: [...state.accessories, accessory],
        equippedAccessory: accessory.id, // Auto-equip new accessory
      })),

      equipAccessory: (id) => set({ equippedAccessory: id }),

      // Sound
      toggleSound: () => set((state) => ({ soundEnabled: !state.soundEnabled })),

      // Focus Fog
      toggleFocusFog: () => set((state) => ({ focusFogEnabled: !state.focusFogEnabled })),

      // Parallax
      setMousePosition: (x, y) => set({ mouseX: x, mouseY: y }),

      // Journal
      addJournalEntry: (entry) => set((state) => ({
        journalEntries: [...state.journalEntries, entry],
      })),

      toggleJournal: () => set((state) => ({ showJournal: !state.showJournal })),

      // Focus History
      recordFocusSession: () => {
        const today = new Date().toISOString().split('T')[0];
        const currentHistory = get().focusHistory;
        const todayCount = currentHistory[today] || 0;
        
        // Calculate ecosystem score based on weekly sessions
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        let weekTotal = 0;
        Object.entries(currentHistory).forEach(([date, count]) => {
          if (new Date(date) >= weekAgo) {
            weekTotal += count;
          }
        });
        // Score: 0-100 based on sessions (target: 28 sessions/week = 4/day)
        const newScore = Math.min(100, Math.round((weekTotal / 28) * 100));

        set({
          focusHistory: { ...currentHistory, [today]: todayCount + 1 },
          ecosystemScore: newScore,
        });
      },

      // Mini Mode
      toggleMiniMode: () => set((state) => ({ isMiniMode: !state.isMiniMode })),

      // Capy Chat
      toggleCapyChat: () => set((state) => ({ showCapyChat: !state.showCapyChat })),

      sendCapyMessage: (message) => {
        const lowerMsg = message.toLowerCase();
        let responseType = 'default';
        
        if (lowerMsg.includes('nản') || lowerMsg.includes('mệt') || lowerMsg.includes('buồn')) {
          responseType = 'tired';
        } else if (lowerMsg.includes('vui') || lowerMsg.includes('yeah') || lowerMsg.includes('tốt')) {
          responseType = 'happy';
        } else if (lowerMsg.includes('focus') || lowerMsg.includes('tập trung')) {
          responseType = 'focus';
        }

        const responses = CAPY_RESPONSES[responseType];
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];

        set({
          capyChatMessage: message,
          lastCapyResponse: randomResponse,
        });

        // Clear after 5 seconds
        setTimeout(() => {
          set({ lastCapyResponse: '' });
        }, 5000);
      },
    }),
    {
      name: 'capyflow-storage',
      partialize: (state) => ({
        fishCaughtCount: state.fishCaughtCount,
        fishCollection: state.fishCollection,
        currentStreak: state.currentStreak,
        theme: state.theme,
        autoTheme: state.autoTheme,
        focusDuration: state.focusDuration,
        breakDuration: state.breakDuration,
        volume: state.volume,
        accessories: state.accessories,
        equippedAccessory: state.equippedAccessory,
        soundEnabled: state.soundEnabled,
        focusFogEnabled: state.focusFogEnabled,
        journalEntries: state.journalEntries,
        focusHistory: state.focusHistory,
        ecosystemScore: state.ecosystemScore,
      }),
    }
  )
);
