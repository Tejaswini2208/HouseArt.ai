import React from 'react';
import { Home, User, Compass, Sparkles, Play } from 'lucide-react';
import { motion } from 'framer-motion';

interface BottomNavProps {
  currentView: 'feed' | 'videos' | 'profile';
  onViewChange: (view: 'feed' | 'videos' | 'profile') => void;
}

export default function BottomNav({ currentView, onViewChange }: BottomNavProps) {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-[100] p-4 pb-8">
      <div className="bg-black/60 backdrop-blur-2xl border border-white/10 rounded-[32px] p-2 flex items-center justify-around shadow-2xl">
        <button
          onClick={() => onViewChange('feed')}
          className={`flex flex-col items-center gap-1 p-3 rounded-2xl transition-all ${
            currentView === 'feed' ? 'bg-orange-500 text-black shadow-lg shadow-orange-500/20' : 'text-white/40 hover:text-white'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] font-black uppercase tracking-widest">Home</span>
        </button>

        <button
          onClick={() => onViewChange('videos')}
          className={`flex flex-col items-center gap-1 p-3 rounded-2xl transition-all ${
            currentView === 'videos' ? 'bg-orange-500 text-black shadow-lg shadow-orange-500/20' : 'text-white/40 hover:text-white'
          }`}
        >
          <Play className="w-5 h-5" />
          <span className="text-[10px] font-black uppercase tracking-widest">Videos</span>
        </button>
        
        <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-full flex items-center justify-center text-orange-400">
           <Sparkles className="w-6 h-6 animate-pulse" />
        </div>

        <button
          onClick={() => onViewChange('profile')}
          className={`flex flex-col items-center gap-1 p-3 rounded-2xl transition-all ${
            currentView === 'profile' ? 'bg-orange-500 text-black shadow-lg shadow-orange-500/20' : 'text-white/40 hover:text-white'
          }`}
        >
          <User className="w-5 h-5" />
          <span className="text-[10px] font-black uppercase tracking-widest">Vault</span>
        </button>
      </div>
    </div>
  );
}
