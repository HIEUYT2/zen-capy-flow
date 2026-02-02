import { useRef, useEffect } from 'react';
import YouTube from 'react-youtube';
import { motion } from 'framer-motion';
import { Volume2, VolumeX, Play, Pause, Music2 } from 'lucide-react';
import { useStore } from '../store/useStore';

export function VinylPlayer() {
  const playerRef = useRef<any>(null);
  const {
    videoId,
    volume,
    isMuted,
    isPlaying,
    isTabActive,
    musicMood,
    setIsPlaying,
    setVolume,
    toggleMute,
  } = useStore();

  // Handle player ready
  const onReady = (event: any) => {
    playerRef.current = event.target;
    event.target.setVolume(volume * 100);
    if (isMuted) {
      event.target.mute();
    }
  };

  // Handle state change
  const onStateChange = (event: any) => {
    // 1 = playing, 2 = paused
    setIsPlaying(event.data === 1);
  };

  // Volume control based on tab visibility
  useEffect(() => {
    if (playerRef.current) {
      if (!isTabActive) {
        playerRef.current.setVolume(10); // Drop to 10% when tab inactive
      } else {
        playerRef.current.setVolume(volume * 100);
      }
    }
  }, [isTabActive, volume]);

  // Mute control
  useEffect(() => {
    if (playerRef.current) {
      if (isMuted) {
        playerRef.current.mute();
      } else {
        playerRef.current.unMute();
      }
    }
  }, [isMuted]);

  // Volume slider control
  useEffect(() => {
    if (playerRef.current && isTabActive) {
      playerRef.current.setVolume(volume * 100);
    }
  }, [volume, isTabActive]);

  const togglePlay = () => {
    if (playerRef.current) {
      if (isPlaying) {
        playerRef.current.pauseVideo();
      } else {
        playerRef.current.playVideo();
      }
    }
  };

  if (!videoId) {
    return (
      <div className="glass p-4 flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-[var(--warm-brown)]/20 flex items-center justify-center">
          <Music2 className="w-6 h-6 text-[var(--warm-brown)]/50" />
        </div>
        <p className="text-sm text-[var(--warm-brown)]/60">
          Use the command bar to set the mood...
        </p>
      </div>
    );
  }

  return (
    <div className="glass p-4">
      {/* Hidden YouTube player */}
      <div className="hidden">
        <YouTube
          videoId={videoId}
          opts={{
            height: '0',
            width: '0',
            playerVars: {
              autoplay: 1,
              loop: 1,
              playlist: videoId,
            },
          }}
          onReady={onReady}
          onStateChange={onStateChange}
        />
      </div>

      {/* Vinyl UI */}
      <div className="flex items-center gap-4">
        {/* Spinning vinyl */}
        <div className="relative">
          <motion.div
            className={`w-14 h-14 rounded-full shadow-lg ${
              isPlaying ? 'animate-vinyl-spin-slow' : ''
            }`}
            style={{
              background: `
                radial-gradient(circle at 50% 50%, #6B5540 0%, #6B5540 15%, 
                #8B7355 16%, #8B7355 30%, 
                #6B5540 31%, #6B5540 45%, 
                #8B7355 46%, #8B7355 60%, 
                #6B5540 61%, #6B5540 100%)
              `,
            }}
          >
            {/* Center label */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-5 h-5 rounded-full bg-[var(--sage-green)] flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-white/80" />
              </div>
            </div>
          </motion.div>

          {/* Playing indicator */}
          {isPlaying && (
            <motion.div
              className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-[var(--sage-green)]"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="font-medium text-[var(--warm-brown-dark)] truncate">
            {musicMood || 'Now Playing'}
          </p>
          <p className="text-sm text-[var(--warm-brown)]/60 truncate">
            Lo-fi vibes ∙ {isPlaying ? 'Playing' : 'Paused'}
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          {/* Play/Pause */}
          <motion.button
            className="w-10 h-10 rounded-full bg-[var(--sage-green)]/20 flex items-center justify-center text-[var(--sage-green)] hover:bg-[var(--sage-green)]/30 transition-colors cursor-pointer"
            onClick={togglePlay}
            whileTap={{ scale: 0.9 }}
          >
            {isPlaying ? (
              <Pause className="w-4 h-4" fill="currentColor" />
            ) : (
              <Play className="w-4 h-4 ml-0.5" fill="currentColor" />
            )}
          </motion.button>

          {/* Volume */}
          <motion.button
            className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-[var(--warm-brown)] hover:bg-white/20 transition-colors cursor-pointer"
            onClick={toggleMute}
            whileTap={{ scale: 0.9 }}
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </motion.button>
        </div>
      </div>

      {/* Volume slider */}
      <div className="mt-3 flex items-center gap-3">
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          className="flex-1 h-2 rounded-full appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, var(--sage-green) 0%, var(--sage-green) ${volume * 100}%, rgba(255,255,255,0.2) ${volume * 100}%, rgba(255,255,255,0.2) 100%)`,
          }}
        />
        <span className="text-xs text-[var(--warm-brown)]/60 w-8">
          {Math.round(volume * 100)}%
        </span>
      </div>
    </div>
  );
}
