// Music mood mapping for AI-DJ feature
// Maps user input keywords to YouTube playlist/video IDs
// Extended with 24+ moods and backup video IDs

export interface MusicMapping {
  keywords: string[];
  mood: string;
  videoId: string;
  backupVideoIds?: string[]; // Fallback videos if primary fails
  description: string;
  emoji?: string;
}

export const MUSIC_MAPPINGS: MusicMapping[] = [
  // === FOCUS & PRODUCTIVITY ===
  {
    keywords: ['coding', 'programming', 'work', 'productive', 'focus', 'concentrate', 'dev', 'developer'],
    mood: 'Deep Focus',
    videoId: 'jfKfPfyJRdk', // lofi hip hop radio - beats to relax/study to
    backupVideoIds: ['DWcJFNfaw9c', '5yx6BWlEVcY'],
    description: 'Lo-fi beats for deep coding sessions',
    emoji: '💻',
  },
  {
    keywords: ['study', 'reading', 'book', 'learn', 'academic', 'homework', 'exam', 'test'],
    mood: 'Study Session',
    videoId: '5qap5aO4i9A', // lofi study beats
    backupVideoIds: ['lTRiuFIWV54', 'BMuknRb7woc'],
    description: 'Calm beats for studying and reading',
    emoji: '📚',
  },
  {
    keywords: ['deadline', 'urgent', 'fast', 'intense', 'high tempo', 'energy', 'pump', 'hype'],
    mood: 'High Energy',
    videoId: 'n61ULEU7CO0', // synthwave / retrowave
    backupVideoIds: ['4xDzrJKXOOY', 'mRN_T6JkH-c'],
    description: 'High-tempo beats for crunch time',
    emoji: '⚡',
  },
  
  // === AMBIENCE & NATURE ===
  {
    keywords: ['rain', 'rainy', 'mưa', 'cozy', 'ấm áp'],
    mood: 'Rainy Vibes',
    videoId: 'q76bMs-NwRk', // rain sounds with lofi
    backupVideoIds: ['mPZkdNFkNps', '8plwv25NYRo'],
    description: 'Cozy rain ambience for rainy days',
    emoji: '🌧️',
  },
  {
    keywords: ['thunder', 'thunderstorm', 'storm', 'sấm', 'bão'],
    mood: 'Thunderstorm',
    videoId: 'mPZkdNFkNps', // thunderstorm sounds
    backupVideoIds: ['nDq6TstdEi8', 'q76bMs-NwRk'],
    description: 'Powerful thunderstorm ambience',
    emoji: '⛈️',
  },
  {
    keywords: ['ocean', 'sea', 'beach', 'waves', 'biển', 'sóng'],
    mood: 'Ocean Waves',
    videoId: 'WHPEKLQID4U', // ocean waves
    backupVideoIds: ['f77SKdyn-Kk', 'V-_O7nl0Ii0'],
    description: 'Calming ocean waves by the beach',
    emoji: '🌊',
  },
  {
    keywords: ['nature', 'forest', 'birds', 'peaceful', 'zen', 'rừng', 'chim'],
    mood: 'Nature Sounds',
    videoId: 'eKFTSSKCzWA', // nature sounds
    backupVideoIds: ['d0tU18Ybcvk', 'xNN7iTA57jM'],
    description: 'Peaceful nature ambience',
    emoji: '🌲',
  },
  {
    keywords: ['fire', 'fireplace', 'campfire', 'lửa', 'warm'],
    mood: 'Cozy Fireplace',
    videoId: 'L_LUpnjgPso', // fireplace crackling
    backupVideoIds: ['UgHKb_7884o', 'RDfjXj5EGqI'],
    description: 'Warm crackling fireplace sounds',
    emoji: '🔥',
  },
  
  // === MUSIC GENRES ===
  {
    keywords: ['jazz', 'coffee', 'cafe', 'quán', 'cà phê', 'smooth'],
    mood: 'Jazz Cafe',
    videoId: 'Dx5qFachd3A', // jazz cafe music
    backupVideoIds: ['fEvM-OUbaKs', 'neV3EPgvZ3g'],
    description: 'Smooth jazz for morning coffee',
    emoji: '☕',
  },
  {
    keywords: ['piano', 'classical', 'elegant', 'soft', 'nhẹ nhàng'],
    mood: 'Piano Dreams',
    videoId: '4XJNeDj5d1U', // piano music
    backupVideoIds: ['HSOtku1j600', 'tV5KR_MXPNY'],
    description: 'Soft piano melodies',
    emoji: '🎹',
  },
  {
    keywords: ['synthwave', 'retrowave', '80s', 'neon', 'cyberpunk', 'retro'],
    mood: 'Synthwave',
    videoId: '4xDzrJKXOOY', // synthwave
    backupVideoIds: ['n61ULEU7CO0', 'BI1iacvVHaY'],
    description: 'Retro 80s vibes with neon lights',
    emoji: '🌆',
  },
  {
    keywords: ['kpop', 'k-pop', 'korean', 'hàn', 'bts', 'blackpink'],
    mood: 'K-pop Study',
    videoId: '2TwLiGVNXkE', // kpop piano/study
    backupVideoIds: ['4tiFr0VXvZI', 'RCmr3S19o0c'],
    description: 'Chill K-pop instrumentals',
    emoji: '🇰🇷',
  },
  {
    keywords: ['vietnam', 'việt', 'viet', 'vietnamese', 'vpop', 'v-pop'],
    mood: 'Vietnamese Lo-fi',
    videoId: 'kgx4WGK0oNU', // vietnamese lofi
    backupVideoIds: ['2TwLiGVNXkE', 'jfKfPfyJRdk'],
    description: 'Vietnamese-inspired chill beats',
    emoji: '🇻🇳',
  },
  {
    keywords: ['anime', 'japanese', 'japan', 'kawaii', 'nhật', 'otaku'],
    mood: 'Anime Vibes',
    videoId: 'WDXPJWIgX-o', // anime lofi
    backupVideoIds: ['7JJfJgyHYwU', 'zhJQk9Trvo4'],
    description: 'Japanese-inspired lo-fi',
    emoji: '🌸',
  },
  {
    keywords: ['gaming', 'game', 'mario', 'nintendo', 'retro', 'pixel'],
    mood: 'Gaming Nostalgia',
    videoId: 'UKa2A9sNC_Q', // video game music
    backupVideoIds: ['jI0BLkDADLc', 'aQkPcPqTq4M'],
    description: 'Retro gaming soundtracks',
    emoji: '🎮',
  },
  {
    keywords: ['chinese', 'china', 'guzheng', 'traditional', 'trung', 'hoa'],
    mood: 'Chinese Traditional',
    videoId: 'z3QdVQ5rVnE', // chinese instrumental
    backupVideoIds: ['j0ug_5TLLo4', 'G6fMr8JH7-o'],
    description: 'Beautiful Chinese traditional music',
    emoji: '🏯',
  },
  
  // === MOODS & TIMES ===
  {
    keywords: ['sad', 'melancholy', 'emotional', 'buồn', 'tâm trạng'],
    mood: 'Melancholic',
    videoId: '4xDzrJKXOOY', // sad lofi
    backupVideoIds: ['bGy9scRheFg', 'BqnG_Ei35JE'],
    description: 'Slow, emotional melodies',
    emoji: '🥺',
  },
  {
    keywords: ['happy', 'upbeat', 'cheerful', 'positive', 'vui', 'tươi'],
    mood: 'Good Vibes',
    videoId: '2ccaHpy5Ewo', // upbeat lofi
    backupVideoIds: ['08SsI_InT14', 'lCOF9LN_Zxs'],
    description: 'Cheerful tunes for a good mood',
    emoji: '😊',
  },
  {
    keywords: ['night', 'late', 'midnight', 'dark', 'đêm', 'khuya'],
    mood: 'Midnight Session',
    videoId: 'rUxyKA_-grg', // late night lofi
    backupVideoIds: ['hHW1oY26kxQ', 'n61ULEU7CO0'],
    description: 'Ambient sounds for late-night sessions',
    emoji: '🌙',
  },
  {
    keywords: ['morning', 'sunrise', 'sáng', 'bình minh', 'wake'],
    mood: 'Morning Sunrise',
    videoId: '1fueZCTYkpA', // morning music
    backupVideoIds: ['Dx5qFachd3A', '2ccaHpy5Ewo'],
    description: 'Gentle tunes to start your day',
    emoji: '🌅',
  },
  {
    keywords: ['chill', 'relax', 'thư giãn', 'nghỉ ngơi', 'calm'],
    mood: 'Chill & Relax',
    videoId: '5qap5aO4i9A', // chill beats
    backupVideoIds: ['lTRiuFIWV54', 'jfKfPfyJRdk'],
    description: 'Ultimate relaxation vibes',
    emoji: '😌',
  },
  {
    keywords: ['spa', 'massage', 'meditation', 'yoga', 'thiền'],
    mood: 'Spa & Meditation',
    videoId: 'lFcSrYw-ARY', // spa music
    backupVideoIds:['ZToicYcHIOU', 'hlWiI4xVXKY'],
    description: 'Tranquil sounds for inner peace',
    emoji: '🧘',
  },
  {
    keywords: ['sleep', 'ngủ', 'insomnia', 'lullaby', 'dream'],
    mood: 'Sleep & Dreams',
    videoId: 'lFcSrYw-ARY', // sleep music
    backupVideoIds: ['1ZYbU82GVz4', 'ZToicYcHIOU'],
    description: 'Drift off to dreamland',
    emoji: '😴',
  },
  {
    keywords: ['white noise', 'focus', 'concentrate', 'tập trung'],
    mood: 'White Noise',
    videoId: 'nMfPqeZjc2c', // white noise
    backupVideoIds: ['wzjWIxXBs_s', 'ArwcHjmsw3A'],
    description: 'Pure white noise for deep focus',
    emoji: '📻',
  },
];

// Fuzzy keyword matcher
export function findBestMatch(input: string): MusicMapping | null {
  const normalizedInput = input.toLowerCase().trim();
  
  if (!normalizedInput) return null;

  // Split input into words for better matching
  const inputWords = normalizedInput.split(/\s+/);

  let bestMatch: MusicMapping | null = null;
  let bestScore = 0;

  for (const mapping of MUSIC_MAPPINGS) {
    let score = 0;

    for (const keyword of mapping.keywords) {
      // Exact match
      if (normalizedInput.includes(keyword)) {
        score += 10;
      }

      // Partial word match
      for (const word of inputWords) {
        if (keyword.includes(word) || word.includes(keyword)) {
          score += 5;
        }
        // Fuzzy match using character overlap
        if (word.length >= 3 && keyword.length >= 3) {
          const overlap = getCharacterOverlap(word, keyword);
          if (overlap > 0.6) {
            score += Math.floor(overlap * 3);
          }
        }
      }
    }

    if (score > bestScore) {
      bestScore = score;
      bestMatch = mapping;
    }
  }

  // Only return if we have a reasonable match
  return bestScore >= 5 ? bestMatch : MUSIC_MAPPINGS[0]; // Default to first (Deep Focus)
}

// Calculate character overlap ratio
function getCharacterOverlap(str1: string, str2: string): number {
  const set1 = new Set(str1.split(''));
  const set2 = new Set(str2.split(''));
  const intersection = [...set1].filter(char => set2.has(char));
  return intersection.length / Math.max(set1.size, set2.size);
}

// Get suggestions based on partial input
export function getSuggestions(input: string): MusicMapping[] {
  if (!input.trim()) {
    // Return some popular suggestions
    return MUSIC_MAPPINGS.slice(0, 4);
  }

  const normalizedInput = input.toLowerCase().trim();
  
  return MUSIC_MAPPINGS.filter(mapping =>
    mapping.keywords.some(keyword => keyword.includes(normalizedInput)) ||
    mapping.mood.toLowerCase().includes(normalizedInput) ||
    mapping.description.toLowerCase().includes(normalizedInput)
  ).slice(0, 5);
}
