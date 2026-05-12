import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Heart, Trash2, LayoutGrid, ArrowLeft, Loader2, Info, LogOut, Phone, Mail } from 'lucide-react';
import { useAuth } from '../lib/AuthContext';
import { useDesign } from '../lib/DesignContext';
import MasonryGrid from './MasonryGrid';

interface ProfilePageProps {
  onBack: () => void;
}

export default function ProfilePage({ onBack }: ProfilePageProps) {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const { savedInspirations, isLoading } = useDesign();

  React.useEffect(() => {
    console.log('Saved Items:', savedInspirations);
  }, [savedInspirations]);

  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-16">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-16"
      >
        <div className="flex items-center justify-between mb-8">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-white/40 hover:text-orange-400 transition-colors uppercase text-[10px] font-black tracking-widest"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to feed
          </button>
          
          <button 
            onClick={logout}
            className="flex items-center gap-2 text-red-500/60 hover:text-red-500 transition-colors uppercase text-[10px] font-black tracking-widest"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-12">
          <div className="space-y-6">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 rounded-[40px] bg-orange-gradient shadow-2xl shadow-orange-500/20 flex items-center justify-center border-4 border-white/5">
                <span className="text-4xl font-black text-black">{user.username.charAt(0).toUpperCase()}</span>
              </div>
              <div className="space-y-1">
                <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase leading-none">{user.username}</h2>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse" />
                  <p className="text-white/40 font-bold text-[10px] uppercase tracking-widest">Active Visionary</p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 rounded-2xl">
                <Mail className="w-3 h-3 text-orange-400" />
                <span className="text-[10px] font-bold text-white/60 uppercase tracking-widest">{user.email}</span>
              </div>
              <div className="flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 rounded-2xl">
                <Phone className="w-3 h-3 text-orange-400" />
                <span className="text-[10px] font-bold text-white/60 uppercase tracking-widest">{user.phone}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-12 bg-white/5 border border-white/10 p-6 rounded-[32px] backdrop-blur-xl">
            <div className="text-center">
              <p className="text-3xl font-black text-orange-400 leading-none">{savedInspirations.length}</p>
              <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mt-2">Saved Ideas</p>
            </div>
            <div className="w-px h-12 bg-white/5" />
            <div className="text-center">
              <p className="text-3xl font-black text-white leading-none">04</p>
              <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mt-2">Collections</p>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <LayoutGrid className="w-6 h-6 text-orange-400" />
          <h3 className="text-2xl font-black uppercase tracking-tight">My Saved Inspirations</h3>
        </div>
        <div className="h-px flex-1 mx-8 bg-white/5 hidden md:block" />
      </div>

      {isLoading ? (
        <div className="h-96 flex flex-col items-center justify-center gap-4">
          <Loader2 className="w-10 h-10 text-orange-400 animate-spin" />
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20">Accessing your vault...</p>
        </div>
      ) : savedInspirations.length > 0 ? (
        <div className="relative">
          <MasonryGrid images={savedInspirations} editable={true} />
        </div>
      ) : (
        <div className="h-96 flex flex-col items-center justify-center text-white/10 space-y-6">
          <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center border border-white/5">
            <Info className="w-10 h-10" />
          </div>
          <div className="text-center">
            <p className="text-2xl font-black uppercase tracking-tighter">Your vault is empty</p>
            <button onClick={onBack} className="mt-4 text-orange-400 font-bold text-xs uppercase tracking-widest hover:underline transition-all">Start exploring →</button>
          </div>
        </div>
      )}
    </div>
  );
}
