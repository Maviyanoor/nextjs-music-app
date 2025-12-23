'use client';

import React from 'react';
import { Home, Search, Library, Music2 } from 'lucide-react';
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
      className={`flex flex-col items-center gap-1 p-2 transition-colors ${
        active ? 'text-text-primary' : 'text-secondary'
      }`}
      aria-label={label}
    >
      {icon}
      <span className="text-xs">{label}</span>
    </button>
  );
}

export default function MobileNav() {
  const { isSearchActive, setSearchActive } = usePlayer();

  const handleSearchClick = () => {
    setSearchActive(true);
  };

  return (
    <nav className="lg:hidden fixed bottom-[90px] left-0 right-0 z-40 bg-background border-t border-panel px-4 py-2 transition-colors duration-300">
      <div className="flex items-center justify-around">
        <NavItem icon={<Home className="w-6 h-6" />} label="Home" active={!isSearchActive} />
        <NavItem icon={<Search className="w-6 h-6" />} label="Search" active={isSearchActive} onClick={handleSearchClick} />
        <NavItem icon={<Library className="w-6 h-6" />} label="Library" />
        <NavItem icon={<Music2 className="w-6 h-6" />} label="Queue" />
      </div>
    </nav>
  );
}
