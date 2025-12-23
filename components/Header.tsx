'use client';

import React, { useRef, useEffect } from 'react';
import { Search, Bell, Moon, Sun, ChevronLeft, ChevronRight, Play, X } from 'lucide-react';
import { usePlayer } from '@/hooks/usePlayer';
import { useTheme } from '@/hooks/useTheme';
import { formatTime } from '@/lib/mockData';

export default function Header() {
  const { isDark, toggleTheme } = useTheme();
  const {
    searchQuery,
    searchResults,
    isSearchActive,
    setSearchQuery,
    clearSearch,
    playSong,
  } = usePlayer();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Close search results when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        if (searchQuery === '') {
          clearSearch();
        }
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [searchQuery, clearSearch]);

  // Focus search input when search is activated (from sidebar/mobile nav)
  useEffect(() => {
    if (isSearchActive && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchActive]);

  const handleSongClick = (song: typeof searchResults[0]) => {
    playSong(song);
    clearSearch();
  };

  return (
    <header className="h-16 bg-background/50 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between px-6 border-b border-panel transition-colors duration-300">
      {/* Navigation Arrows */}
      <div className="flex items-center gap-2">
        <button
          className="w-8 h-8 rounded-full bg-background/60 flex items-center justify-center hover:bg-panel transition-colors"
          aria-label="Go back"
        >
          <ChevronLeft className="w-5 h-5 text-text-primary" />
        </button>
        <button
          className="w-8 h-8 rounded-full bg-background/60 flex items-center justify-center hover:bg-panel transition-colors"
          aria-label="Go forward"
        >
          <ChevronRight className="w-5 h-5 text-text-primary" />
        </button>
      </div>

      {/* Search Bar */}
      <div className="flex-1 max-w-md mx-8" ref={searchContainerRef}>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary" />
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search songs, artists, or albums..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 bg-panel rounded-full pl-12 pr-10 text-text-primary placeholder-secondary focus:outline-none focus:ring-2 focus:ring-primary transition-all"
            aria-label="Search"
          />
          {searchQuery && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-secondary/20 flex items-center justify-center hover:bg-secondary/40 transition-colors"
              aria-label="Clear search"
            >
              <X className="w-4 h-4 text-secondary" />
            </button>
          )}

          {/* Search Results Dropdown */}
          {isSearchActive && searchQuery.trim() !== '' && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-surface rounded-lg shadow-xl border border-panel max-h-80 overflow-y-auto z-50">
              {searchResults.length > 0 ? (
                <div className="py-2">
                  <div className="px-4 py-2 text-xs text-secondary uppercase tracking-wider">
                    Songs
                  </div>
                  {searchResults.map((song) => (
                    <button
                      key={song.id}
                      onClick={() => handleSongClick(song)}
                      className="w-full px-4 py-2 flex items-center gap-3 hover:bg-panel transition-colors group"
                    >
                      <img
                        src={song.coverUrl}
                        alt={song.title}
                        className="w-10 h-10 rounded object-cover"
                      />
                      <div className="flex-1 text-left min-w-0">
                        <div className="text-text-primary text-sm truncate">{song.title}</div>
                        <div className="text-secondary text-xs truncate">
                          {song.artist} • {song.album}
                        </div>
                      </div>
                      <div className="text-secondary text-xs">
                        {formatTime(song.duration)}
                      </div>
                      <Play className="w-4 h-4 text-text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  ))}
                </div>
              ) : (
                <div className="px-4 py-8 text-center text-secondary">
                  No results found for &quot;{searchQuery}&quot;
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-3">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="w-10 h-10 rounded-full bg-panel flex items-center justify-center hover:bg-surface transition-colors"
          aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDark ? (
            <Sun className="w-5 h-5 text-secondary" />
          ) : (
            <Moon className="w-5 h-5 text-secondary" />
          )}
        </button>

        {/* Notifications */}
        <button
          className="w-10 h-10 rounded-full bg-panel flex items-center justify-center hover:bg-surface transition-colors relative"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5 text-secondary" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-accent rounded-full" />
        </button>

        {/* User Avatar */}
        <button
          className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center font-semibold text-white hover:opacity-90 transition-opacity"
          aria-label="User profile"
        >
          U
        </button>
      </div>
    </header>
  );
}
