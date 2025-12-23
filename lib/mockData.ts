import { Song, Playlist } from './types';

export const mockSongs: Song[] = [
  {
    id: '1',
    title: 'Finding Her',
    artist: 'Unknown Artist',
    album: 'Summer Collection',
    year: 2025,
    genre: 'Chill',
    duration: 207, // 3:27
    coverUrl: '/images/Finding Her.JPG',
    audioUrl: '/audio/Finding Her.mp3',
  },
  {
    id: '2',
    title: 'FOR-A-REASON',
    artist: 'Unknown Artist',
    album: 'Summer Collection',
    year: 2025,
    genre: 'Chill',
    duration: 188, // 3:08
    coverUrl: '/images/FOR-A-REASON.JPG',
    audioUrl: '/audio/FOR-A-REASON.mp3',
  },
  {
    id: '3',
    title: 'Jo Tum Mere Ho',
    artist: 'Unknown Artist',
    album: 'Summer Collection',
    year: 2025,
    genre: 'Chill',
    duration: 257, // 4:17
    coverUrl: '/images/Jo Tum Mere Ho.jpg',
    audioUrl: '/audio/Jo Tum Mere Ho.mp3',
  },
  {
    id: '4',
    title: 'REGARDLESS',
    artist: 'Unknown Artist',
    album: 'Summer Collection',
    year: 2025,
    genre: 'Chill',
    duration: 224, // 3:44
    coverUrl: '/images/REGARDLESS.JPG',
    audioUrl: '/audio/REGARDLESS.mp3',
  },
  {
    id: '5',
    title: 'STFU',
    artist: 'Unknown Artist',
    album: 'Summer Collection',
    year: 2025,
    genre: 'Chill',
    duration: 174, // 2:54
    coverUrl: '/images/STFU.jpg',
    audioUrl: '/audio/STFU.mp3',
  },
];

export const mockPlaylists: Playlist[] = [
  {
    id: 'p1',
    name: 'Liked Songs',
    songCount: 127,
  },
  {
    id: 'p2',
    name: 'Summer Vibes',
    songCount: 45,
  },
  {
    id: 'p3',
    name: 'Chill Beats',
    songCount: 32,
  },
  {
    id: 'p4',
    name: 'Late Night Drive',
    songCount: 28,
  },
  {
    id: 'p5',
    name: 'Focus Flow',
    songCount: 56,
  },
  {
    id: 'p6',
    name: 'Workout Energy',
    songCount: 41,
  },
];

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}
