'use client';

import React from 'react';
import Image from 'next/image';
import { Music, MoreHorizontal } from 'lucide-react';
import { usePlayer } from '@/hooks/usePlayer';
import { formatTime } from '@/lib/mockData';
import { Song } from '@/lib/types';

interface QueueItemProps {
  song: Song;
  isPlaying: boolean;
  onClick: () => void;
}

function QueueItem({ song, isPlaying, onClick }: QueueItemProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200 hover:bg-panel group ${
        isPlaying ? 'bg-panel' : ''
      }`}
      aria-label={`Play ${song.title} by ${song.artist}`}
    >
      {/* Thumbnail */}
      <div className="relative w-12 h-12 rounded-md overflow-hidden flex-shrink-0">
        <Image
          src={song.coverUrl}
          alt={song.title}
          fill
          className="object-cover"
        />
        {isPlaying && (
          <div className="absolute inset-0 bg-background/50 flex items-center justify-center">
            <div className="flex items-end gap-0.5 h-4">
              <div className="w-1 bg-primary animate-pulse" style={{ height: '60%', animationDelay: '0ms' }} />
              <div className="w-1 bg-primary animate-pulse" style={{ height: '100%', animationDelay: '150ms' }} />
              <div className="w-1 bg-primary animate-pulse" style={{ height: '40%', animationDelay: '300ms' }} />
            </div>
          </div>
        )}
      </div>

      {/* Song Info */}
      <div className="flex-1 min-w-0 text-left">
        <p className={`font-medium truncate ${isPlaying ? 'text-primary' : 'text-text-primary'}`}>
          {song.title}
        </p>
        <p className="text-sm text-secondary truncate">{song.artist}</p>
      </div>

      {/* Duration */}
      <span className="text-sm text-secondary flex-shrink-0">{formatTime(song.duration)}</span>

      {/* More Options */}
      <button
        className="p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity hover:bg-surface"
        onClick={(e) => {
          e.stopPropagation();
        }}
        aria-label="More options"
      >
        <MoreHorizontal className="w-4 h-4 text-secondary" />
      </button>
    </button>
  );
}

export default function RightPanel() {
  const { queue, currentSong, currentIndex, playSong } = usePlayer();

  const upcomingSongs = queue.slice(currentIndex + 1);

  return (
    <aside className="w-[400px] h-full bg-background fixed right-0 top-0 z-40 border-l border-panel flex flex-col pb-[90px] transition-colors duration-300">
      {/* Header */}
      <div className="p-6 border-b border-panel">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Music className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold text-text-primary">Playlist</h2>
          </div>
          <span className="text-sm text-secondary">{queue.length} tracks</span>
        </div>
      </div>

      {/* Current Queue */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {/* Now Playing Section */}
        <div className="p-4">
          <h3 className="text-sm font-semibold text-secondary uppercase tracking-wider mb-3">
            Now Playing
          </h3>
          {currentSong && (
            <QueueItem
              song={currentSong}
              isPlaying={true}
              onClick={() => playSong(currentSong)}
            />
          )}
        </div>

        {/* Upcoming Section */}
        {upcomingSongs.length > 0 && (
          <div className="p-4 pt-0">
            <h3 className="text-sm font-semibold text-secondary uppercase tracking-wider mb-3">
              Upcoming
            </h3>
            <div className="space-y-1">
              {upcomingSongs.map((song) => (
                <QueueItem
                  key={song.id}
                  song={song}
                  isPlaying={false}
                  onClick={() => playSong(song)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Previous songs (if any) */}
        {currentIndex > 0 && (
          <div className="p-4 pt-0">
            <h3 className="text-sm font-semibold text-secondary uppercase tracking-wider mb-3">
              Previously Played
            </h3>
            <div className="space-y-1">
              {queue.slice(0, currentIndex).map((song) => (
                <QueueItem
                  key={song.id}
                  song={song}
                  isPlaying={false}
                  onClick={() => playSong(song)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
