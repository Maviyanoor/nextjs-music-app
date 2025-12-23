'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Repeat1,
  Heart,
  Volume2,
  VolumeX,
  Volume1,
} from 'lucide-react';
import { usePlayer } from '@/hooks/usePlayer';
import { formatTime } from '@/lib/mockData';

export default function BottomPlayer() {
  const {
    currentSong,
    isPlaying,
    currentTime,
    volume,
    isShuffle,
    repeatMode,
    togglePlay,
    playNext,
    playPrevious,
    setCurrentTime,
    setVolume,
    toggleShuffle,
    toggleRepeat,
  } = usePlayer();

  const progressRef = useRef<HTMLDivElement>(null);
  const volumeRef = useRef<HTMLDivElement>(null);

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressRef.current || !currentSong) return;
    const rect = progressRef.current.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    setCurrentTime(Math.floor(percent * currentSong.duration));
  };

  const handleVolumeClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!volumeRef.current) return;
    const rect = volumeRef.current.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    setVolume(Math.floor(percent * 100));
  };

  const progress = currentSong ? (currentTime / currentSong.duration) * 100 : 0;

  const VolumeIcon = volume === 0 ? VolumeX : volume < 50 ? Volume1 : Volume2;

  const RepeatIcon = repeatMode === 'one' ? Repeat1 : Repeat;

  if (!currentSong) return null;

  return (
    <footer className="h-[90px] bg-panel fixed bottom-0 left-0 right-0 z-50 border-t border-surface transition-colors duration-300">
      <div className="h-full px-4 flex items-center">
        {/* Left Section - Current Song Info */}
        <div className="flex items-center gap-4 w-[280px]">
          <div className="relative w-14 h-14 rounded overflow-hidden flex-shrink-0">
            <Image
              src={currentSong.coverUrl}
              alt={currentSong.title}
              fill
              className="object-cover"
            />
          </div>
          <div className="min-w-0">
            <p className="font-medium text-text-primary truncate">{currentSong.title}</p>
            <p className="text-sm text-secondary truncate">{currentSong.artist}</p>
          </div>
          <button
            className="p-2 rounded-full hover:bg-surface transition-colors flex-shrink-0"
            aria-label="Add to liked songs"
          >
            <Heart className="w-5 h-5 text-secondary hover:text-text-primary transition-colors" />
          </button>
        </div>

        {/* Center Section - Playback Controls */}
        <div className="flex-1 flex flex-col items-center max-w-[720px] mx-auto">
          {/* Controls */}
          <div className="flex items-center gap-4 mb-2">
            <button
              onClick={toggleShuffle}
              className={`p-2 rounded-full transition-all duration-200 hover:bg-surface ${
                isShuffle ? 'text-accent' : 'text-secondary hover:text-white'
              }`}
              aria-label={isShuffle ? 'Disable shuffle' : 'Enable shuffle'}
            >
              <Shuffle className="w-4 h-4" />
            </button>

            <button
              onClick={playPrevious}
              className="p-2 rounded-full text-secondary hover:text-text-primary transition-colors hover:bg-surface"
              aria-label="Previous song"
            >
              <SkipBack className="w-5 h-5" />
            </button>

            <button
              onClick={togglePlay}
              className="w-10 h-10 rounded-full bg-text-primary hover:scale-105 flex items-center justify-center transition-transform"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 text-background" />
              ) : (
                <Play className="w-5 h-5 text-background ml-0.5" />
              )}
            </button>

            <button
              onClick={playNext}
              className="p-2 rounded-full text-secondary hover:text-text-primary transition-colors hover:bg-surface"
              aria-label="Next song"
            >
              <SkipForward className="w-5 h-5" />
            </button>

            <button
              onClick={toggleRepeat}
              className={`p-2 rounded-full transition-all duration-200 hover:bg-surface ${
                repeatMode !== 'off' ? 'text-accent' : 'text-secondary hover:text-white'
              }`}
              aria-label={`Repeat mode: ${repeatMode}`}
            >
              <RepeatIcon className="w-4 h-4" />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="w-full flex items-center gap-2">
            <span className="text-xs text-secondary w-10 text-right">
              {formatTime(currentTime)}
            </span>
            <div
              ref={progressRef}
              className="flex-1 h-1 bg-surface rounded-full cursor-pointer group"
              onClick={handleProgressClick}
              role="slider"
              aria-label="Song progress"
              aria-valuenow={currentTime}
              aria-valuemin={0}
              aria-valuemax={currentSong.duration}
            >
              <div
                className="h-full bg-text-primary group-hover:bg-primary rounded-full relative transition-colors"
                style={{ width: `${progress}%` }}
              >
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-text-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
            <span className="text-xs text-secondary w-10">
              {formatTime(currentSong.duration)}
            </span>
          </div>
        </div>

        {/* Right Section - Volume Control */}
        <div className="flex items-center justify-end gap-2 w-[280px]">
          <button
            onClick={() => setVolume(volume === 0 ? 50 : 0)}
            className="p-2 rounded-full text-secondary hover:text-text-primary transition-colors"
            aria-label={volume === 0 ? 'Unmute' : 'Mute'}
          >
            <VolumeIcon className="w-5 h-5" />
          </button>
          <div
            ref={volumeRef}
            className="w-24 h-1 bg-surface rounded-full cursor-pointer group"
            onClick={handleVolumeClick}
            role="slider"
            aria-label="Volume"
            aria-valuenow={volume}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className="h-full bg-text-primary group-hover:bg-primary rounded-full relative transition-colors"
              style={{ width: `${volume}%` }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-text-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
