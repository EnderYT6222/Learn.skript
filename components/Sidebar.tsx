import React from 'react';
import { Home, Award, User, ShoppingBag, Dumbbell, Book, Settings as SettingsIcon, Code2 } from 'lucide-react';
import { Logo } from './Logo';
import { UserState } from '../types';
import { TRANSLATIONS } from '../translations';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userState: UserState;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, userState }) => {
  const t = TRANSLATIONS[userState.language];

  const navItems = [
    { id: 'learn', label: t['nav.curriculum'], icon: <Home size={22} /> },
    { id: 'practice', label: t['nav.practice'], icon: <Dumbbell size={22} /> },
    { id: 'sandground', label: t['nav.sandground'], icon: <Code2 size={22} /> },
    { id: 'docs', label: t['nav.wiki'], icon: <Book size={22} /> },
    { id: 'shop', label: t['nav.shop'], icon: <ShoppingBag size={22} /> },
    { id: 'leaderboard', label: t['nav.leaderboard'], icon: <Award size={22} /> },
    { id: 'profile', label: t['nav.profile'], icon: <User size={22} /> },
    { id: 'settings', label: t['nav.settings'], icon: <SettingsIcon size={22} /> },
  ];

  return (
    <div className="hidden md:flex flex-col w-64 h-screen border-r border-gray-800 bg-brand-dark fixed left-0 top-0 z-30">
      <div className="p-6 pb-2">
        <Logo className="scale-100 origin-left" />
      </div>
      
      <nav className="flex-1 space-y-1 px-3 py-6 overflow-y-auto">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group font-bold tracking-wide text-sm ${
              activeTab === item.id
                ? 'bg-brand-purple/15 text-brand-purple border border-brand-purple/20'
                : 'text-brand-muted hover:bg-gray-800 hover:text-white'
            }`}
          >
            <span className={`transition-transform duration-300 ${activeTab === item.id ? 'scale-110' : 'group-hover:scale-110'}`}>
                {item.icon}
            </span>
            {item.label}
          </button>
        ))}
      </nav>
      
      {/* Community Message */}
      <div className="p-4">
        <div className="p-4 rounded-xl border border-gray-800 bg-black/20 text-brand-muted text-[10px] text-center">
            <p className="font-serif italic mb-1">"To iterate is human, to recurse divine."</p>
            <p className="font-bold text-brand-purple">v2.1.0-sandground</p>
        </div>
      </div>
    </div>
  );
};
