'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Repeat1,
  Volume2,
  VolumeX,
  Volume1,
} from 'lucide-react';
import { usePlayer } from '@/hooks/usePlayer';
import { formatTime } from '@/lib/mockData';

export default function MainContent() {
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

  const [isDraggingProgress, setIsDraggingProgress] = useState(false);
  const progressRef = useRef<HTMLDivElement>(null);
  const volumeRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Simulate playback progress
  useEffect(() => {
    if (isPlaying && currentSong && !isDraggingProgress) {
      intervalRef.current = setInterval(() => {
        setCurrentTime(currentTime + 1);
        if (currentTime >= currentSong.duration) {
          playNext();
        }
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, currentTime, currentSong, isDraggingProgress, setCurrentTime, playNext]);

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
    <main className="flex-1 min-h-screen bg-surface overflow-y-auto pb-[140px] lg:pb-[90px] transition-colors duration-300">
      {/* Content Area */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        {/* Album Artwork */}
        <div className="flex justify-center mb-6 sm:mb-8">
          <div className="relative w-[280px] h-[280px] sm:w-[320px] sm:h-[320px] md:w-[400px] md:h-[400px] rounded-lg overflow-hidden shadow-2xl">
            <Image
              src={currentSong.coverUrl}
              alt={`${currentSong.title} album cover`}
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>

        {/* Song Info */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-text-primary mb-2">{currentSong.title}</h1>
          <p className="text-base sm:text-lg text-secondary mb-4">{currentSong.artist}</p>

          {/* Tags */}
          <div className="flex flex-wrap justify-center gap-2">
            <span className="px-3 py-1 bg-panel rounded-full text-xs sm:text-sm text-secondary">
              {currentSong.album}
            </span>
            <span className="px-3 py-1 bg-panel rounded-full text-xs sm:text-sm text-secondary">
              {currentSong.year}
            </span>
            <span className="px-3 py-1 bg-panel rounded-full text-xs sm:text-sm text-secondary">
              {currentSong.genre}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6 sm:mb-8">
          <div
            ref={progressRef}
            className="h-2 bg-panel rounded-full cursor-pointer group relative"
            onClick={handleProgressClick}
            onMouseDown={() => setIsDraggingProgress(true)}
            onMouseUp={() => setIsDraggingProgress(false)}
            onMouseLeave={() => setIsDraggingProgress(false)}
            role="slider"
            aria-label="Song progress"
            aria-valuenow={currentTime}
            aria-valuemin={0}
            aria-valuemax={currentSong.duration}
          >
            <div
              className="h-full bg-primary rounded-full relative transition-all"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg" />
            </div>
          </div>
          <div className="flex justify-between mt-2 text-xs sm:text-sm text-secondary">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(currentSong.duration)}</span>
          </div>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center justify-center gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
          <button
            onClick={toggleShuffle}
            className={`p-2 sm:p-3 rounded-full transition-all duration-200 hover:bg-panel ${
              isShuffle ? 'text-accent' : 'text-secondary hover:text-white'
            }`}
            aria-label={isShuffle ? 'Disable shuffle' : 'Enable shuffle'}
          >
            <Shuffle className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          <button
            onClick={playPrevious}
            className="p-2 sm:p-3 rounded-full text-secondary hover:text-text-primary transition-all duration-200 hover:bg-panel"
            aria-label="Previous song"
          >
            <SkipBack className="w-6 h-6 sm:w-8 sm:h-8" />
          </button>

          <button
            onClick={togglePlay}
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-primary hover:bg-blue-600 flex items-center justify-center transition-all duration-200 hover:scale-105"
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <Pause className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            ) : (
              <Play className="w-6 h-6 sm:w-8 sm:h-8 text-white ml-1" />
            )}
          </button>

          <button
            onClick={playNext}
            className="p-2 sm:p-3 rounded-full text-secondary hover:text-text-primary transition-all duration-200 hover:bg-panel"
            aria-label="Next song"
          >
            <SkipForward className="w-6 h-6 sm:w-8 sm:h-8" />
          </button>

          <button
            onClick={toggleRepeat}
            className={`p-2 sm:p-3 rounded-full transition-all duration-200 hover:bg-panel ${
              repeatMode !== 'off' ? 'text-accent' : 'text-secondary hover:text-white'
            }`}
            aria-label={`Repeat mode: ${repeatMode}`}
          >
            <RepeatIcon className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* Volume Control - Hidden on mobile */}
        <div className="hidden sm:flex items-center justify-center gap-4">
          <button
            onClick={() => setVolume(volume === 0 ? 50 : 0)}
            className="p-2 rounded-full text-secondary hover:text-text-primary transition-colors"
            aria-label={volume === 0 ? 'Unmute' : 'Mute'}
          >
            <VolumeIcon className="w-6 h-6" />
          </button>
          <div
            ref={volumeRef}
            className="w-32 sm:w-48 h-2 bg-panel rounded-full cursor-pointer group relative"
            onClick={handleVolumeClick}
            role="slider"
            aria-label="Volume"
            aria-valuenow={volume}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className="h-full bg-text-primary rounded-full relative transition-all"
              style={{ width: `${volume}%` }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-text-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg" />
            </div>
          </div>
          <span className="text-sm text-secondary w-12 text-right">{volume}%</span>
        </div>
      </div>
    </main>
  );
}
