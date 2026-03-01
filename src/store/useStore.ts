import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ==================== TYPES ====================

export type ViewType = 'dashboard' | 'focus' | 'stats' | 'settings';
export type Theme = 'sunny' | 'rainy' | 'night';
export type SessionType = 'focus' | 'break';
export type CapyMood = 'idle' | 'sleeping' | 'happy' | 'fishing' | 'waking' | 'annoyed';
export type TaskPriority = 'high' | 'medium' | 'low';

export interface Fish {
  id: string;
  name: string;
  rarity: string;
  emoji: string;
  caughtAt: Date;
  timeOfDay?: string;
  glowing?: boolean;
}

export interface Accessory {
  id: string;
  name: string;
  emoji: string;
  unlockedAt: Date;
}

export interface JournalEntry {
  id: string;
  date: string;
  quote: string;
  scene: string;
  fishCaught: string;
  duration: number;
}

export interface FloatingNote {
  id: string;
  text: string;
  createdAt: Date;
  shown: boolean;
}

export interface Task {
  id: string;
  title: string;
  subject: string;
  priority: TaskPriority;
  completed: boolean;
  completedAt?: string;
  dueDate?: string;
  createdAt: string;
}

export interface QuickNote {
  id: string;
  text: string;
  isChecklist: boolean;
  checked: boolean;
  createdAt: string;
}

export interface ToastItem {
  id: string;
  message: string;
  emoji?: string;
  duration?: number;
}

// ==================== DATA ====================

export const MORNING_FISH = [
  { name: 'Zen Carp', rarity: 'common', emoji: '🐠', timeOfDay: 'morning' },
  { name: 'Sunset Bass', rarity: 'common', emoji: '🌅', timeOfDay: 'morning' },
  { name: 'Lucky Catfish', rarity: 'common', emoji: '🍀', timeOfDay: 'morning' },
  { name: 'Dream Guppy', rarity: 'common', emoji: '💭', timeOfDay: 'morning' },
  { name: 'Rainbow Trout', rarity: 'rare', emoji: '🌈', timeOfDay: 'morning' },
];

export const NIGHT_FISH = [
  { name: 'Moonfish', rarity: 'legendary', emoji: '🌙', timeOfDay: 'night', glowing: true },
  { name: 'Starfish Spirit', rarity: 'rare', emoji: '⭐', timeOfDay: 'night', glowing: true },
  { name: 'Crystal Salmon', rarity: 'rare', emoji: '💎', timeOfDay: 'night', glowing: true },
  { name: 'Firefly Minnow', rarity: 'common', emoji: '✨', timeOfDay: 'night', glowing: true },
  { name: 'Biolumi Jellyfish', rarity: 'legendary', emoji: '🪼', timeOfDay: 'night', glowing: true },
];

export const RAINY_FISH = [
  { name: 'Storm Koi', rarity: 'legendary', emoji: '⚡', timeOfDay: 'rainy' },
  { name: 'Rain Spirit', rarity: 'rare', emoji: '🌧️', timeOfDay: 'rainy' },
  { name: 'Thunder Bass', rarity: 'legendary', emoji: '⛈️', timeOfDay: 'rainy' },
  { name: 'Misty Pike', rarity: 'rare', emoji: '🌫️', timeOfDay: 'rainy' },
  { name: 'Cloud Carp', rarity: 'common', emoji: '☁️', timeOfDay: 'rainy' },
];

export const FISH_TYPES = [...MORNING_FISH, ...NIGHT_FISH, ...RAINY_FISH];

export const CAPY_FISHING_QUOTES = [
  "Chậm rãi như Capybara, vững chắc như dòng nước 🦫",
  "Mỗi con cá là một khoảnh khắc bình yên ✨",
  "Kiên nhẫn không phải là chờ đợi, mà là biết tận hưởng 🌸",
  "Hơi thở sâu, tâm an yên, cá tự đến 🐟",
  "Không vội vàng, không lo lắng - đó là triết lý Capybara 🍃",
  "Thành công đến với ai biết thư giãn đúng lúc 🌿",
  "Nước chảy đá mòn, kiên trì ắt thành công 💧",
  "Hôm nay ta nghỉ ngơi, ngày mai ta chinh phục 🌅",
  "Cá không chạy đi đâu, bạn cũng vậy - hãy ở lại với hiện tại 🧘",
  "Mỗi phút tập trung là một viên ngọc quý 💎",
];

export const ACCESSORY_REWARDS = [
  { streak: 1, id: 'sunglasses', name: 'Cool Sunglasses', emoji: '🕶️' },
  { streak: 3, id: 'flower', name: 'Pretty Flower', emoji: '🌸' },
  { streak: 5, id: 'orange', name: 'Orange Hat', emoji: '🍊' },
  { streak: 10, id: 'crown', name: 'Royal Crown', emoji: '👑' },
  { streak: 25, id: 'sparkle', name: 'Sparkle Aura', emoji: '⭐' },
];

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

export const SCENE_EMOJIS = ['🌅', '🌄', '🏞️', '🌊', '🌺', '🌸', '🍃', '🌿'];

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

// ==================== STORE INTERFACE ====================

interface CapyFlowState {
  // Navigation
  currentView: ViewType;
  setCurrentView: (view: ViewType) => void;

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
  playlistId: string | null;
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

  // Mouse position
  mouseX: number;
  mouseY: number;

  // Journal
  journalEntries: JournalEntry[];
  showJournal: boolean;

  // Focus Heatmap
  focusHistory: Record<string, number>;
  ecosystemScore: number;

  // Mini Mode
  isMiniMode: boolean;

  // Capy Chat
  showCapyChat: boolean;
  capyChatMessage: string;
  lastCapyResponse: string;

  // Floating Notes
  floatingNotes: FloatingNote[];
  showFloatingNotesInput: boolean;
  lastFishQuote: string;

  // Tap Interactions
  tapCount: number;
  lastTapTime: number;

  // ===== NEW STATE =====

  // Tasks
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'completed' | 'createdAt'>) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;

  // Quick Notes
  quickNotes: QuickNote[];
  addNote: (note: { text: string; isChecklist: boolean }) => void;
  toggleNoteCheck: (id: string) => void;
  deleteNote: (id: string) => void;

  // Toasts
  toasts: ToastItem[];
  addToast: (toast: Omit<ToastItem, 'id'>) => void;
  removeToast: (id: string) => void;

  // Daily Goal
  dailyGoal: number;
  setDailyGoal: (goal: number) => void;

  // Notifications
  notificationsEnabled: boolean;
  toggleNotifications: () => void;

  // Daily Review
  showDailyReview: boolean;
  setShowDailyReview: (show: boolean) => void;
  dismissDailyReview: () => void;

  // ===== ACTIONS =====

  // Timer Actions
  startTimer: () => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  resetTimer: () => void;
  tick: () => void;
  completeSession: () => void;
  setSessionType: (type: SessionType) => void;
  setFocusDuration: (minutes: number) => void;
  setBreakDuration: (minutes: number) => void;

  // Music Actions
  setMusicMood: (mood: string) => void;
  setVideoId: (id: string | null) => void;
  setPlaylistId: (id: string | null) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  setIsPlaying: (playing: boolean) => void;

  // Fish Actions
  catchFish: () => Fish;
  closeFishModal: () => void;

  // Tab Actions
  setTabActive: (active: boolean) => void;
  incrementTabAwayTime: () => void;
  resetTabAwayTime: () => void;
  breakLine: () => void;
  repairLine: () => void;
  toggleFullscreen: () => void;

  // Theme Actions
  setTheme: (theme: Theme) => void;
  toggleAutoTheme: () => void;
  toggleCommandBar: () => void;

  // Casting
  startCasting: () => void;
  endCasting: () => void;

  // Capybara
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

  // Floating Notes
  addFloatingNote: (text: string) => void;
  toggleFloatingNotesInput: () => void;
  markNotesAsShown: () => void;
  getUnshownNotes: () => FloatingNote[];

  // Tap
  handleCapyTap: () => void;
  handleCapyLongPress: () => void;
}

// ==================== STORE IMPLEMENTATION ====================

export const useStore = create<CapyFlowState>()(
  persist(
    (set, get) => ({
      // ===== Navigation =====
      currentView: 'dashboard',
      setCurrentView: (view) => set({ currentView: view }),

      // ===== Timer =====
      isActive: false,
      isPaused: false,
      timeRemaining: 25 * 60,
      sessionType: 'focus',
      focusDuration: 25,
      breakDuration: 5,

      // ===== Music =====
      musicMood: '',
      videoId: null,
      playlistId: null,
      volume: 0.7,
      isMuted: false,
      isPlaying: false,

      // ===== Fish =====
      fishCaughtCount: 0,
      fishCollection: [],
      currentStreak: 0,
      showFishModal: false,
      lastCaughtFish: null,

      // ===== Tab =====
      isTabActive: true,
      isFullscreen: false,
      tabAwayTime: 0,
      isLineBroken: false,

      // ===== Theme =====
      theme: 'sunny',
      autoTheme: true,

      // ===== Casting =====
      isCasting: false,

      // ===== Capybara =====
      capyMood: 'idle',
      lastInteractionTime: Date.now(),
      accessories: [],
      equippedAccessory: null,

      // ===== Sound =====
      soundEnabled: true,

      // ===== Focus Fog =====
      focusFogEnabled: true,

      // ===== Command Bar =====
      isCommandBarOpen: false,

      // ===== Mouse =====
      mouseX: 0.5,
      mouseY: 0.5,

      // ===== Journal =====
      journalEntries: [],
      showJournal: false,

      // ===== Focus History =====
      focusHistory: {},
      ecosystemScore: 50,

      // ===== Mini Mode =====
      isMiniMode: false,

      // ===== Capy Chat =====
      showCapyChat: false,
      capyChatMessage: '',
      lastCapyResponse: '',

      // ===== Floating Notes =====
      floatingNotes: [],
      showFloatingNotesInput: false,
      lastFishQuote: '',

      // ===== Tap =====
      tapCount: 0,
      lastTapTime: 0,

      // ===== NEW: Tasks =====
      tasks: [],
      addTask: (taskData) => set((state) => ({
        tasks: [
          ...state.tasks,
          {
            id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
            ...taskData,
            completed: false,
            createdAt: new Date().toISOString(),
          },
        ],
      })),
      toggleTask: (id) => set((state) => ({
        tasks: state.tasks.map((t) =>
          t.id === id
            ? {
                ...t,
                completed: !t.completed,
                completedAt: !t.completed ? new Date().toISOString() : undefined,
              }
            : t
        ),
      })),
      deleteTask: (id) => set((state) => ({
        tasks: state.tasks.filter((t) => t.id !== id),
      })),

      // ===== NEW: Quick Notes =====
      quickNotes: [],
      addNote: (noteData) => set((state) => ({
        quickNotes: [
          {
            id: `note-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
            ...noteData,
            checked: false,
            createdAt: new Date().toISOString(),
          },
          ...state.quickNotes,
        ],
      })),
      toggleNoteCheck: (id) => set((state) => ({
        quickNotes: state.quickNotes.map((n) =>
          n.id === id ? { ...n, checked: !n.checked } : n
        ),
      })),
      deleteNote: (id) => set((state) => ({
        quickNotes: state.quickNotes.filter((n) => n.id !== id),
      })),

      // ===== NEW: Toasts =====
      toasts: [],
      addToast: (toast) => set((state) => ({
        toasts: [...state.toasts, { ...toast, id: `toast-${Date.now()}` }],
      })),
      removeToast: (id) => set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id),
      })),

      // ===== NEW: Daily Goal =====
      dailyGoal: 4,
      setDailyGoal: (goal) => set({ dailyGoal: goal }),

      // ===== NEW: Notifications =====
      notificationsEnabled: true,
      toggleNotifications: () => set((state) => ({ notificationsEnabled: !state.notificationsEnabled })),

      // ===== NEW: Daily Review =====
      showDailyReview: false,
      setShowDailyReview: (show) => set({ showDailyReview: show }),
      dismissDailyReview: () => set({ showDailyReview: false }),

      // ===== TIMER ACTIONS =====
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
        const { sessionType, focusDuration, breakDuration, currentStreak, notificationsEnabled } = get();
        if (sessionType === 'focus') {
          const fish = get().catchFish();
          const newStreak = currentStreak + 1;

          // Check for accessory rewards
          const rewardToUnlock = ACCESSORY_REWARDS.find(
            (r) => r.streak === newStreak && !get().accessories.some((a) => a.id === r.id)
          );

          if (rewardToUnlock) {
            get().addAccessory({
              id: rewardToUnlock.id,
              name: rewardToUnlock.name,
              emoji: rewardToUnlock.emoji,
              unlockedAt: new Date(),
            });
            get().addToast({
              message: `Mở khóa ${rewardToUnlock.name}!`,
              emoji: rewardToUnlock.emoji,
              duration: 4000,
            });
          }

          // Add journal entry
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

          // Record focus session
          get().recordFocusSession();

          // Session-complete toast
          get().addToast({
            message: `Hoàn thành ${focusDuration} phút tập trung! Câu được ${fish.emoji} ${fish.name}`,
            emoji: '🎣',
            duration: 4000,
          });

          // Browser notification
          if (notificationsEnabled && 'Notification' in window && Notification.permission === 'granted') {
            new Notification('CapyFlow 🦫', {
              body: `Hoàn thành phiên ${focusDuration} phút! Nghỉ ngơi thôi 🎉`,
              icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><text y="24" font-size="24">🦫</text></svg>',
            });
          }

          set({
            isActive: false,
            sessionType: 'break',
            timeRemaining: breakDuration * 60,
            showFishModal: true,
            lastCaughtFish: fish,
          });
        } else {
          // Break completed
          if (notificationsEnabled && 'Notification' in window && Notification.permission === 'granted') {
            new Notification('CapyFlow 🦫', {
              body: 'Hết giờ nghỉ! Quay lại tập trung nào 💪',
            });
          }
          get().addToast({
            message: 'Hết giờ nghỉ! Sẵn sàng tập trung lại? 💪',
            emoji: '⏰',
            duration: 4000,
          });
          set({
            isActive: false,
            sessionType: 'focus',
            timeRemaining: get().focusDuration * 60,
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

      // ===== MUSIC ACTIONS =====
      setMusicMood: (mood) => set({ musicMood: mood }),
      setVideoId: (id) => set({ videoId: id }),
      setPlaylistId: (id) => set({ playlistId: id }),
      setVolume: (volume) => set({ volume: Math.max(0, Math.min(1, volume)) }),
      toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),
      setIsPlaying: (playing) => set({ isPlaying: playing }),

      // ===== FISH ACTIONS =====
      catchFish: () => {
        const { theme } = get();
        let fishPool;
        if (theme === 'night') fishPool = NIGHT_FISH;
        else if (theme === 'rainy') fishPool = RAINY_FISH;
        else fishPool = MORNING_FISH;

        const randomFish = fishPool[Math.floor(Math.random() * fishPool.length)];
        const newFish: Fish = {
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          ...randomFish,
          caughtAt: new Date(),
        };

        const randomQuote = CAPY_FISHING_QUOTES[Math.floor(Math.random() * CAPY_FISHING_QUOTES.length)];

        set((state) => ({
          fishCaughtCount: state.fishCaughtCount + 1,
          fishCollection: [...state.fishCollection, newFish],
          currentStreak: state.currentStreak + 1,
          lastCaughtFish: newFish,
          lastFishQuote: randomQuote,
        }));

        return newFish;
      },

      closeFishModal: () => set({ showFishModal: false, lastCaughtFish: null }),

      // ===== TAB ACTIONS =====
      setTabActive: (active) => set({ isTabActive: active }),
      incrementTabAwayTime: () => set((state) => ({ tabAwayTime: state.tabAwayTime + 1 })),
      resetTabAwayTime: () => set({ tabAwayTime: 0 }),
      breakLine: () => set({ isLineBroken: true, currentStreak: 0 }),
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

      // ===== THEME ACTIONS =====
      setTheme: (theme) => set({ theme }),
      toggleAutoTheme: () => set((state) => ({ autoTheme: !state.autoTheme })),
      toggleCommandBar: () => set((state) => ({ isCommandBarOpen: !state.isCommandBarOpen })),

      // ===== CASTING =====
      startCasting: () => {
        const { isLineBroken, isCasting } = get();
        if (!isLineBroken && !isCasting) {
          set({ isCasting: true, capyMood: 'fishing' });
          setTimeout(() => get().endCasting(), 2000);
        }
      },
      endCasting: () => set({ isCasting: false, capyMood: 'idle' }),

      // ===== CAPYBARA =====
      petCapy: () => {
        set({ capyMood: 'happy', lastInteractionTime: Date.now() });
        setTimeout(() => {
          if (get().capyMood === 'happy') set({ capyMood: 'idle' });
        }, 2000);
      },
      goToSleep: () => set({ capyMood: 'sleeping' }),
      wakeUp: () => {
        set({ capyMood: 'waking', lastInteractionTime: Date.now() });
        setTimeout(() => {
          if (get().capyMood === 'waking') set({ capyMood: 'idle' });
        }, 1000);
      },
      updateInteractionTime: () => set({ lastInteractionTime: Date.now() }),
      addAccessory: (accessory) => set((state) => ({
        accessories: [...state.accessories, accessory],
        equippedAccessory: accessory.id,
      })),
      equipAccessory: (id) => set({ equippedAccessory: id }),

      // ===== SOUND =====
      toggleSound: () => set((state) => ({ soundEnabled: !state.soundEnabled })),

      // ===== FOCUS FOG =====
      toggleFocusFog: () => set((state) => ({ focusFogEnabled: !state.focusFogEnabled })),

      // ===== PARALLAX =====
      setMousePosition: (x, y) => set({ mouseX: x, mouseY: y }),

      // ===== JOURNAL =====
      addJournalEntry: (entry) => set((state) => ({
        journalEntries: [...state.journalEntries, entry],
      })),
      toggleJournal: () => set((state) => ({ showJournal: !state.showJournal })),

      // ===== FOCUS HISTORY =====
      recordFocusSession: () => {
        const today = new Date().toISOString().split('T')[0];
        const currentHistory = get().focusHistory;
        const todayCount = currentHistory[today] || 0;

        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        let weekTotal = 0;
        Object.entries(currentHistory).forEach(([date, count]) => {
          if (new Date(date) >= weekAgo) weekTotal += count;
        });
        const newScore = Math.min(100, Math.round((weekTotal / 28) * 100));

        set({
          focusHistory: { ...currentHistory, [today]: todayCount + 1 },
          ecosystemScore: newScore,
        });
      },

      // ===== MINI MODE =====
      toggleMiniMode: () => set((state) => ({ isMiniMode: !state.isMiniMode })),

      // ===== CAPY CHAT =====
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
        set({ capyChatMessage: message, lastCapyResponse: randomResponse });
        setTimeout(() => set({ lastCapyResponse: '' }), 5000);
      },

      // ===== FLOATING NOTES =====
      addFloatingNote: (text) => set((state) => ({
        floatingNotes: [
          ...state.floatingNotes,
          { id: `note-${Date.now()}`, text, createdAt: new Date(), shown: false },
        ],
        showFloatingNotesInput: false,
      })),
      toggleFloatingNotesInput: () => set((state) => ({
        showFloatingNotesInput: !state.showFloatingNotesInput,
      })),
      markNotesAsShown: () => set((state) => ({
        floatingNotes: state.floatingNotes.map((note) => ({ ...note, shown: true })),
      })),
      getUnshownNotes: () => get().floatingNotes.filter((note) => !note.shown),

      // ===== TAP =====
      handleCapyTap: () => {
        const now = Date.now();
        const { lastTapTime, tapCount } = get();
        if (now - lastTapTime < 1000) {
          const newCount = tapCount + 1;
          if (newCount >= 3) {
            set({ capyMood: 'annoyed', tapCount: 0, lastTapTime: now });
            setTimeout(() => {
              if (get().capyMood === 'annoyed') set({ capyMood: 'idle' });
            }, 2000);
          } else {
            set({ tapCount: newCount, lastTapTime: now });
          }
        } else {
          set({ capyMood: 'happy', tapCount: 1, lastTapTime: now });
          setTimeout(() => {
            if (get().capyMood === 'happy') set({ capyMood: 'idle' });
          }, 800);
        }
      },
      handleCapyLongPress: () => {
        set({ capyMood: 'sleeping' });
        setTimeout(() => {
          if (get().capyMood === 'sleeping') {
            set({ capyMood: 'waking' });
            setTimeout(() => {
              if (get().capyMood === 'waking') set({ capyMood: 'idle' });
            }, 1000);
          }
        }, 3000);
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
        // NEW persisted fields
        tasks: state.tasks,
        quickNotes: state.quickNotes,
        dailyGoal: state.dailyGoal,
        notificationsEnabled: state.notificationsEnabled,
      }),
    }
  )
);
