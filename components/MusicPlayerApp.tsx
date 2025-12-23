'use client';

import React from 'react';
import { PlayerProvider } from '@/hooks/usePlayer';
import { ThemeProvider } from '@/hooks/useTheme';
import Sidebar from './Sidebar';
import Header from './Header';
import MainContent from './MainContent';
import RightPanel from './RightPanel';
import BottomPlayer from './BottomPlayer';
import MobileNav from './MobileNav';

export default function MusicPlayerApp() {
  return (
    <ThemeProvider>
      <PlayerProvider>
        <div className="min-h-screen bg-background text-text-primary transition-colors duration-300">
        {/* Sidebar - Hidden on mobile and tablet */}
        <div className="hidden lg:block">
          <Sidebar />
        </div>

        {/* Main Content Area */}
        <div className="lg:ml-[280px] xl:mr-[400px]">
          <Header />
          <MainContent />
        </div>

        {/* Right Panel - Hidden on mobile and tablet */}
        <div className="hidden xl:block">
          <RightPanel />
        </div>

        {/* Mobile Navigation - Visible on mobile and tablet */}
        <MobileNav />

        {/* Bottom Player */}
        <BottomPlayer />
        </div>
      </PlayerProvider>
    </ThemeProvider>
  );
}
