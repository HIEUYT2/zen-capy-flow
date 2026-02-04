// YouTube URL utilities for extracting video and playlist IDs
// Supports various YouTube URL formats including playlists

export interface YouTubeParseResult {
  type: 'video' | 'playlist' | 'invalid';
  videoId?: string;
  playlistId?: string;
}

/**
 * Extract YouTube video ID from various URL formats
 * Supports:
 * - https://www.youtube.com/watch?v=VIDEO_ID
 * - https://youtu.be/VIDEO_ID
 * - https://www.youtube.com/embed/VIDEO_ID
 * - https://www.youtube.com/v/VIDEO_ID
 * - https://www.youtube.com/shorts/VIDEO_ID
 */
export function extractYouTubeVideoId(url: string): string | null {
  if (!url) return null;
  
  const patterns = [
    // Standard watch URL
    /(?:youtube\.com\/watch\?v=|youtube\.com\/watch\?.+&v=)([^&\s]+)/,
    // Short URL
    /youtu\.be\/([^?\s]+)/,
    // Embed URL
    /youtube\.com\/embed\/([^?\s]+)/,
    // Old embed URL
    /youtube\.com\/v\/([^?\s]+)/,
    // Shorts URL
    /youtube\.com\/shorts\/([^?\s]+)/,
    // Just the video ID (11 characters)
    /^([a-zA-Z0-9_-]{11})$/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
}

/**
 * Extract YouTube playlist ID from URL
 * Supports:
 * - https://www.youtube.com/playlist?list=PLAYLIST_ID
 * - https://www.youtube.com/watch?v=VIDEO_ID&list=PLAYLIST_ID
 */
export function extractYouTubePlaylistId(url: string): string | null {
  if (!url) return null;

  const patterns = [
    // Playlist URL
    /[?&]list=([^&\s]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      // Filter out special playlists like "RD" (radio) that start with special chars
      const playlistId = match[1];
      if (playlistId.length > 10) {
        return playlistId;
      }
    }
  }

  return null;
}

/**
 * Parse a YouTube URL and determine its type
 * Returns video ID, playlist ID, or both depending on URL type
 */
export function parseYouTubeUrl(url: string): YouTubeParseResult {
  if (!url || typeof url !== 'string') {
    return { type: 'invalid' };
  }

  const trimmedUrl = url.trim();
  
  // Check if it's a YouTube URL or just a video ID
  const isYouTubeUrl = /youtube\.com|youtu\.be/i.test(trimmedUrl);
  const isJustId = /^[a-zA-Z0-9_-]{11}$/.test(trimmedUrl);

  if (!isYouTubeUrl && !isJustId) {
    return { type: 'invalid' };
  }

  const videoId = extractYouTubeVideoId(trimmedUrl);
  const playlistId = extractYouTubePlaylistId(trimmedUrl);

  if (playlistId && !videoId) {
    // Pure playlist URL
    return {
      type: 'playlist',
      playlistId,
    };
  }

  if (playlistId && videoId) {
    // Video from a playlist
    return {
      type: 'playlist',
      videoId,
      playlistId,
    };
  }

  if (videoId) {
    return {
      type: 'video',
      videoId,
    };
  }

  return { type: 'invalid' };
}

/**
 * Check if input looks like a YouTube URL
 */
export function isYouTubeUrl(input: string): boolean {
  if (!input) return false;
  const trimmed = input.trim();
  return /youtube\.com|youtu\.be/i.test(trimmed) || /^[a-zA-Z0-9_-]{11}$/.test(trimmed);
}

/**
 * Validate if a string is a valid YouTube video ID format
 */
export function isValidYouTubeId(id: string): boolean {
  if (!id) return false;
  // YouTube video IDs are 11 characters, alphanumeric with - and _
  return /^[a-zA-Z0-9_-]{11}$/.test(id);
}

/**
 * Get a random video from a playlist by constructing the embed URL
 * Note: For full playlist support, we use YouTube's playlist parameter
 */
export function getPlaylistEmbedParams(playlistId: string, shuffle: boolean = true): {
  playlist: string;
  loop: number;
  shuffle: number;
} {
  return {
    playlist: playlistId,
    loop: 1,
    shuffle: shuffle ? 1 : 0,
  };
}
