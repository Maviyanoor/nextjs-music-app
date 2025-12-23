'use client';

import React, { createContext, useContext, useState, useCallback, useRef, useEffect, ReactNode } from 'react';
import { Song, PlayerState } from '@/lib/types';
import { mockSongs } from '@/lib/mockData';

interface SearchState {
  searchQuery: string;
  searchResults: Song[];
  isSearchActive: boolean;
}

interface PlayerContextType extends PlayerState, SearchState {
  playSong: (song: Song) => void;
  togglePlay: () => void;
  playNext: () => void;
  playPrevious: () => void;
  setCurrentTime: (time: number) => void;
  setVolume: (volume: number) => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  setQueue: (songs: Song[]) => void;
  setSearchQuery: (query: string) => void;
  setSearchActive: (active: boolean) => void;
  clearSearch: () => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PlayerState>({
    currentSong: mockSongs[0],
    isPlaying: false,
    currentTime: 0,
    volume: 75,
    isShuffle: false,
    repeatMode: 'off',
    queue: mockSongs,
    currentIndex: 0,
  });

  const [searchState, setSearchState] = useState<SearchState>({
    searchQuery: '',
    searchResults: [],
    isSearchActive: false,
  });

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio element and event listeners on mount
  useEffect(() => {
    const audio = new Audio();
    audioRef.current = audio;
    audio.volume = state.volume / 100;

    const handleTimeUpdate = () => {
      setState((prev) => ({
        ...prev,
        currentTime: Math.floor(audio.currentTime),
      }));
    };

    const handleEnded = () => {
      setState((prev) => {
        if (prev.repeatMode === 'one') {
          audio.currentTime = 0;
          audio.play().catch(console.error);
          return { ...prev, currentTime: 0 };
        }

        let nextIndex = prev.currentIndex + 1;
        if (nextIndex >= prev.queue.length) {
          if (prev.repeatMode === 'all') {
            nextIndex = 0;
          } else {
            return { ...prev, isPlaying: false, currentTime: 0 };
          }
        }

        return {
          ...prev,
          currentIndex: nextIndex,
          currentSong: prev.queue[nextIndex],
          currentTime: 0,
        };
      });
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.pause();
      audioRef.current = null;
    };
  }, []);

  // Update audio source when currentSong changes
  useEffect(() => {
    if (audioRef.current && state.currentSong) {
      audioRef.current.src = state.currentSong.audioUrl;
      audioRef.current.load();
      if (state.isPlaying) {
        audioRef.current.play().catch(console.error);
      }
    }
  }, [state.currentSong]);

  // Handle play/pause
  useEffect(() => {
    if (audioRef.current) {
      if (state.isPlaying) {
        audioRef.current.play().catch(console.error);
      } else {
        audioRef.current.pause();
      }
    }
  }, [state.isPlaying]);

  // Update volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = state.volume / 100;
    }
  }, [state.volume]);

  const playSong = useCallback((song: Song) => {
    const index = state.queue.findIndex((s) => s.id === song.id);
    setState((prev) => ({
      ...prev,
      currentSong: song,
      currentIndex: index >= 0 ? index : prev.currentIndex,
      isPlaying: true,
      currentTime: 0,
    }));
  }, [state.queue]);

  const togglePlay = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isPlaying: !prev.isPlaying,
    }));
  }, []);

  const playNext = useCallback(() => {
    setState((prev) => {
      let nextIndex = prev.currentIndex + 1;
      if (nextIndex >= prev.queue.length) {
        nextIndex = prev.repeatMode === 'all' ? 0 : prev.currentIndex;
      }
      return {
        ...prev,
        currentIndex: nextIndex,
        currentSong: prev.queue[nextIndex],
        currentTime: 0,
      };
    });
  }, []);

  const playPrevious = useCallback(() => {
    setState((prev) => {
      let prevIndex = prev.currentIndex - 1;
      if (prevIndex < 0) {
        prevIndex = prev.repeatMode === 'all' ? prev.queue.length - 1 : 0;
      }
      return {
        ...prev,
        currentIndex: prevIndex,
        currentSong: prev.queue[prevIndex],
        currentTime: 0,
      };
    });
  }, []);

  const setCurrentTime = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
    setState((prev) => ({
      ...prev,
      currentTime: time,
    }));
  }, []);

  const setVolume = useCallback((volume: number) => {
    setState((prev) => ({
      ...prev,
      volume: Math.max(0, Math.min(100, volume)),
    }));
  }, []);

  const toggleShuffle = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isShuffle: !prev.isShuffle,
    }));
  }, []);

  const toggleRepeat = useCallback(() => {
    setState((prev) => {
      const modes: ('off' | 'all' | 'one')[] = ['off', 'all', 'one'];
      const currentModeIndex = modes.indexOf(prev.repeatMode);
      const nextMode = modes[(currentModeIndex + 1) % modes.length];
      return {
        ...prev,
        repeatMode: nextMode,
      };
    });
  }, []);

  const setQueue = useCallback((songs: Song[]) => {
    setState((prev) => ({
      ...prev,
      queue: songs,
    }));
  }, []);

  const setSearchQuery = useCallback((query: string) => {
    const trimmedQuery = query.toLowerCase().trim();

    if (trimmedQuery === '') {
      setSearchState({
        searchQuery: query,
        searchResults: [],
        isSearchActive: query.length > 0,
      });
      return;
    }

    const results = mockSongs.filter(
      (song) =>
        song.title.toLowerCase().includes(trimmedQuery) ||
        song.artist.toLowerCase().includes(trimmedQuery) ||
        song.album.toLowerCase().includes(trimmedQuery)
    );

    setSearchState({
      searchQuery: query,
      searchResults: results,
      isSearchActive: true,
    });
  }, []);

  const setSearchActive = useCallback((active: boolean) => {
    setSearchState((prev) => ({
      ...prev,
      isSearchActive: active,
    }));
  }, []);

  const clearSearch = useCallback(() => {
    setSearchState({
      searchQuery: '',
      searchResults: [],
      isSearchActive: false,
    });
  }, []);

  const value: PlayerContextType = {
    ...state,
    ...searchState,
    playSong,
    togglePlay,
    playNext,
    playPrevious,
    setCurrentTime,
    setVolume,
    toggleShuffle,
    toggleRepeat,
    setQueue,
    setSearchQuery,
    setSearchActive,
    clearSearch,
  };

  return (
    <PlayerContext.Provider value={value}>
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const context = useContext(PlayerContext);
  if (context === undefined) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
}
