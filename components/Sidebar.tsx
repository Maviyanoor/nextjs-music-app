'use client';

import React from 'react';
import { Home, Search, Library, Plus, Heart, Music2 } from 'lucide-react';
import { mockPlaylists } from '@/lib/mockData';
import { usePlayer } from '@/hooks/usePlayer';

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

function NavItem({ icon, label, active = false, onClick }: NavItemProps) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-4 w-full px-4 py-3 rounded-lg transition-all duration-200 hover:bg-panel group ${
        active ? 'text-text-primary' : 'text-secondary'
      }`}
      aria-label={label}
    >
      <span className={`transition-colors ${active ? 'text-text-primary' : 'text-secondary group-hover:text-text-primary'}`}>
        {icon}
      </span>
      <span className={`font-medium transition-colors ${active ? 'text-text-primary' : 'text-secondary group-hover:text-text-primary'}`}>
        {label}
      </span>
    </button>
  );
}

export default function Sidebar() {
  const { isSearchActive, setSearchActive } = usePlayer();

  const handleSearchClick = () => {
    setSearchActive(true);
  };

  return (
    <aside className="w-[280px] h-full bg-background flex flex-col fixed left-0 top-0 z-40 border-r border-panel transition-colors duration-300">
      {/* Logo */}
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
          <Music2 className="w-6 h-6 text-white" />
        </div>
        <span className="text-xl font-bold text-text-primary">HarmonyStream</span>
      </div>

      {/* Main Navigation */}
      <nav className="px-2 space-y-1">
        <NavItem icon={<Home className="w-6 h-6" />} label="Home" active={!isSearchActive} />
        <NavItem icon={<Search className="w-6 h-6" />} label="Search" active={isSearchActive} onClick={handleSearchClick} />
        <NavItem icon={<Library className="w-6 h-6" />} label="Your Library" />
      </nav>

      {/* Divider */}
      <div className="mx-4 my-4 border-t border-panel" />

      {/* Playlist Actions */}
      <div className="px-2 space-y-1">
        <button
          className="flex items-center gap-4 w-full px-4 py-3 rounded-lg transition-all duration-200 hover:bg-panel group"
          aria-label="Create Playlist"
        >
          <div className="w-6 h-6 rounded bg-secondary flex items-center justify-center group-hover:bg-text-primary transition-colors">
            <Plus className="w-4 h-4 text-background" />
          </div>
          <span className="font-medium text-secondary group-hover:text-text-primary transition-colors">
            Create Playlist
          </span>
        </button>

        <button
          className="flex items-center gap-4 w-full px-4 py-3 rounded-lg transition-all duration-200 hover:bg-panel group"
          aria-label="Liked Songs"
        >
          <div className="w-6 h-6 rounded bg-gradient-to-br from-purple-700 to-blue-300 flex items-center justify-center">
            <Heart className="w-4 h-4 text-white fill-white" />
          </div>
          <span className="font-medium text-secondary group-hover:text-text-primary transition-colors">
            Liked Songs
          </span>
        </button>
      </div>

      {/* Divider */}
      <div className="mx-4 my-4 border-t border-panel" />

      {/* Playlists */}
      <div className="flex-1 overflow-y-auto px-2 pb-4 scrollbar-thin">
        <div className="space-y-1">
          {mockPlaylists.slice(1).map((playlist) => (
            <button
              key={playlist.id}
              className="w-full px-4 py-2 text-left text-secondary hover:text-text-primary transition-colors rounded-lg hover:bg-panel truncate"
              aria-label={`Play ${playlist.name}`}
            >
              {playlist.name}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}
