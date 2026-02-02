// Music mood mapping for AI-DJ feature
// Maps user input keywords to YouTube playlist/video IDs

export interface MusicMapping {
  keywords: string[];
  mood: string;
  videoId: string;
  description: string;
}

export const MUSIC_MAPPINGS: MusicMapping[] = [
  {
    keywords: ['coding', 'programming', 'work', 'productive', 'focus', 'concentrate'],
    mood: 'Deep Focus',
    videoId: 'jfKfPfyJRdk', // lofi hip hop radio
    description: 'Lo-fi beats for deep coding sessions',
  },
  {
    keywords: ['deadline', 'urgent', 'fast', 'intense', 'high tempo', 'energy'],
    mood: 'High Energy',
    videoId: 'n61ULEU7CO0', // synthwave / retrowave
    description: 'High-tempo beats for crunch time',
  },
  {
    keywords: ['rain', 'rainy', 'storm', 'thunder', 'cozy'],
    mood: 'Rainy Vibes',
    videoId: 'q76bMs-NwRk', // rain sounds with lofi
    description: 'Cozy rain ambience for rainy days',
  },
  {
    keywords: ['sad', 'melancholy', 'emotional', 'chill', 'slow'],
    mood: 'Melancholic',
    videoId: '4xDzrJKXOOY', // sad lofi
    description: 'Slow, emotional melodies',
  },
  {
    keywords: ['jazz', 'coffee', 'cafe', 'morning', 'smooth'],
    mood: 'Jazz Cafe',
    videoId: 'Dx5qFachd3A', // jazz cafe music
    description: 'Smooth jazz for morning coffee',
  },
  {
    keywords: ['night', 'late', 'midnight', 'dark', 'ambient'],
    mood: 'Midnight Session',
    videoId: 'rUxyKA_-grg', // late night lofi
    description: 'Ambient sounds for late-night sessions',
  },
  {
    keywords: ['happy', 'upbeat', 'cheerful', 'positive', 'morning'],
    mood: 'Good Vibes',
    videoId: '2ccaHpy5Ewo', // upbeat lofi
    description: 'Cheerful tunes for a good mood',
  },
  {
    keywords: ['study', 'reading', 'book', 'learn', 'academic'],
    mood: 'Study Session',
    videoId: '5qap5aO4i9A', // lofi study beats
    description: 'Calm beats for studying and reading',
  },
  {
    keywords: ['nature', 'forest', 'birds', 'peaceful', 'zen'],
    mood: 'Nature Sounds',
    videoId: 'eKFTSSKCzWA', // nature sounds
    description: 'Peaceful nature ambience',
  },
  {
    keywords: ['piano', 'classical', 'elegant', 'soft'],
    mood: 'Piano Dreams',
    videoId: '4XJNeDj5d1U', // piano music
    description: 'Soft piano melodies',
  },
  {
    keywords: ['gaming', 'game', 'mario', 'nintendo', 'retro'],
    mood: 'Gaming Nostalgia',
    videoId: 'UKa2A9sNC_Q', // video game music
    description: 'Retro gaming soundtracks',
  },
  {
    keywords: ['anime', 'japanese', 'japan', 'kawaii'],
    mood: 'Anime Vibes',
    videoId: 'WDXPJWIgX-o', // anime lofi
    description: 'Japanese-inspired lo-fi',
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
