import { useRef, useEffect, useState } from 'react';
import YouTube from 'react-youtube';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, Play, Pause, Music2, AlertCircle, RefreshCw } from 'lucide-react';
import { useStore } from '../store/useStore';
import { MUSIC_MAPPINGS } from '../lib/musicMapper';

export function VinylPlayer() {
  const playerRef = useRef<any>(null);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [needsInteraction, setNeedsInteraction] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  
  const {
    videoId,
    playlistId,
    volume,
    isMuted,
    isPlaying,
    isTabActive,
    musicMood,
    setIsPlaying,
    setVolume,
    toggleMute,
    setVideoId,
  } = useStore();

  // Handle player ready
  const onReady = (event: any) => {
    playerRef.current = event.target;
    event.target.setVolume(volume * 100);
    if (isMuted) {
      event.target.mute();
    }
    setHasError(false);
    setErrorMessage('');
  };

  // Handle state change
  const onStateChange = (event: any) => {
    // 1 = playing, 2 = paused, -1 = unstarted, 0 = ended
    if (event.data === 1) {
      setIsPlaying(true);
      setNeedsInteraction(false);
    } else if (event.data === 2 || event.data === 0) {
      setIsPlaying(false);
    }
  };

  // Handle errors
  const onError = (event: any) => {
    console.error('YouTube Player Error:', event.data);
    setHasError(true);
    
    // Error codes: 2 (invalid param), 5 (HTML5 error), 100 (video not found), 101/150 (embed not allowed)
    switch (event.data) {
      case 100:
        setErrorMessage('Video không tồn tại hoặc đã bị xóa');
        break;
      case 101:
      case 150:
        setErrorMessage('Video này không cho phép nhúng');
        break;
      default:
        setErrorMessage('Không thể phát video này');
    }

    // Try backup video if available
    if (retryCount < 2) {
      const currentMapping = MUSIC_MAPPINGS.find(m => m.videoId === videoId);
      if (currentMapping?.backupVideoIds && currentMapping.backupVideoIds[retryCount]) {
        setTimeout(() => {
          setVideoId(currentMapping.backupVideoIds![retryCount]);
          setRetryCount(prev => prev + 1);
          setHasError(false);
        }, 1000);
      }
    }
  };

  // Reset retry count when videoId changes externally
  useEffect(() => {
    setRetryCount(0);
    setHasError(false);
    setErrorMessage('');
  }, [videoId]);

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
        setNeedsInteraction(false);
      }
    }
  };

  const handleClickToPlay = () => {
    setNeedsInteraction(false);
    if (playerRef.current) {
      playerRef.current.playVideo();
    }
  };

  const handleRetry = () => {
    setHasError(false);
    setErrorMessage('');
    setRetryCount(0);
    // Trigger re-render by resetting
    if (playerRef.current) {
      playerRef.current.loadVideoById(videoId);
    }
  };

  if (!videoId && !playlistId) {
    return (
      <div className="glass p-3 sm:p-4 flex items-center gap-3 sm:gap-4">
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[var(--warm-brown)]/20 flex items-center justify-center">
          <Music2 className="w-5 h-5 sm:w-6 sm:h-6 text-[var(--warm-brown)]/50" />
        </div>
        <p className="text-xs sm:text-sm text-[var(--warm-brown)]/60">
          Nhấn ⌘K hoặc click "Set the mood..."
        </p>
      </div>
    );
  }

  // Get YouTube player options
  const playerOpts: any = {
    height: '0',
    width: '0',
    playerVars: {
      autoplay: 1,
      loop: 1,
      controls: 0,
      disablekb: 1,
      modestbranding: 1,
      rel: 0,
    },
  };

  // Add playlist support
  if (playlistId) {
    playerOpts.playerVars.list = playlistId;
    playerOpts.playerVars.listType = 'playlist';
    playerOpts.playerVars.shuffle = 1;
  } else if (videoId) {
    playerOpts.playerVars.playlist = videoId; // For looping single video
  }

  return (
    <div className="glass p-3 sm:p-4">
      {/* Hidden YouTube player */}
      <div className="hidden">
        <YouTube
          videoId={playlistId ? undefined : videoId || undefined}
          opts={playerOpts}
          onReady={onReady}
          onStateChange={onStateChange}
          onError={onError}
        />
      </div>

      {/* Error State */}
      <AnimatePresence>
        {hasError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-3 p-3 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3"
          >
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
            <p className="text-sm text-red-400 flex-1">{errorMessage}</p>
            <button
              onClick={handleRetry}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
            >
              <RefreshCw className="w-4 h-4 text-red-400" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Click to Play Overlay */}
      <AnimatePresence>
        {needsInteraction && !hasError && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mb-3"
          >
            <motion.button
              className="w-full py-3 rounded-xl bg-[var(--sage-green)] text-white font-medium flex items-center justify-center gap-2 hover:bg-[var(--sage-green)]/90 transition-all cursor-pointer"
              onClick={handleClickToPlay}
              whileTap={{ scale: 0.98 }}
            >
              <Play className="w-5 h-5" fill="currentColor" />
              Click để phát nhạc
            </motion.button>
            <p className="text-xs text-center text-[var(--warm-brown)]/50 mt-2">
              Trình duyệt yêu cầu click để phát audio
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Vinyl UI */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Spinning vinyl */}
        <div className="relative">
          <motion.div
            className={`w-10 h-10 sm:w-14 sm:h-14 rounded-full shadow-lg ${
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
              <div className="w-3.5 h-3.5 sm:w-5 sm:h-5 rounded-full bg-[var(--sage-green)] flex items-center justify-center">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-white/80" />
              </div>
            </div>
          </motion.div>

          {/* Playing indicator */}
          {isPlaying && (
            <motion.div
              className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[var(--sage-green)]"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="text-sm sm:text-base font-medium text-[var(--warm-brown-dark)] truncate">
            {musicMood || 'Now Playing'}
          </p>
          <p className="text-xs sm:text-sm text-[var(--warm-brown)]/60 truncate">
            {playlistId ? 'Playlist' : 'Video'} ∙ {isPlaying ? 'Đang phát' : 'Tạm dừng'}
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Play/Pause */}
          <motion.button
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[var(--sage-green)]/20 flex items-center justify-center text-[var(--sage-green)] hover:bg-[var(--sage-green)]/30 transition-colors cursor-pointer"
            onClick={togglePlay}
            whileTap={{ scale: 0.9 }}
          >
            {isPlaying ? (
              <Pause className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="currentColor" />
            ) : (
              <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4 ml-0.5" fill="currentColor" />
            )}
          </motion.button>

          {/* Volume */}
          <motion.button
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/10 flex items-center justify-center text-[var(--warm-brown)] hover:bg-white/20 transition-colors cursor-pointer"
            onClick={toggleMute}
            whileTap={{ scale: 0.9 }}
          >
            {isMuted ? (
              <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            ) : (
              <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            )}
          </motion.button>
        </div>
      </div>

      {/* Volume slider */}
      <div className="mt-2 sm:mt-3 flex items-center gap-2 sm:gap-3">
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          className="flex-1 h-1.5 sm:h-2 rounded-full appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, var(--sage-green) 0%, var(--sage-green) ${volume * 100}%, rgba(255,255,255,0.2) ${volume * 100}%, rgba(255,255,255,0.2) 100%)`,
          }}
        />
        <span className="text-[10px] sm:text-xs text-[var(--warm-brown)]/60 w-7 sm:w-8">
          {Math.round(volume * 100)}%
        </span>
      </div>
    </div>
  );
}

