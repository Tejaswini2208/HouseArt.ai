import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Trash2, LayoutGrid, ArrowLeft, Loader2, Info, LogOut, Phone, Mail, Play, Download, Bookmark, Check, X, User } from 'lucide-react';
import { useAuth } from '../lib/AuthContext';
import { useDesign } from '../lib/DesignContext';
import MasonryGrid from './MasonryGrid';
import { PexelsVideo } from '../services/pexelsService';

interface ProfilePageProps {
  onBack: () => void;
}

export default function ProfilePage({ onBack }: ProfilePageProps) {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const { savedInspirations, savedVideos, savedVideoIds, saveVideo, removeVideo, isLoading } = useDesign();
  const [activeTab, setActiveTab] = React.useState<'inspirations' | 'cinematics'>('inspirations');
  const [selectedVideo, setSelectedVideo] = React.useState<PexelsVideo | null>(null);

  if (!user) return null;

  const handleDownload = async (video: PexelsVideo) => {
    const videoUrl = video.video_files[0]?.link;
    if (!videoUrl) return;
    try {
      const response = await fetch(videoUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `homeart-ai-${video.id}.mp4`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      window.open(videoUrl, '_blank');
    }
  };

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
              <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mt-2">Inspirations</p>
            </div>
            <div className="w-px h-12 bg-white/5" />
            <div className="text-center">
              <p className="text-3xl font-black text-white leading-none">{savedVideos.length}</p>
              <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mt-2">Cinematics</p>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="mb-12">
        <div className="flex items-center gap-8 border-b border-white/5">
          <button 
            onClick={() => setActiveTab('inspirations')}
            className={`pb-6 text-xs font-black uppercase tracking-[0.2em] transition-all relative ${
              activeTab === 'inspirations' ? 'text-white' : 'text-white/20 hover:text-white/40'
            }`}
          >
            Inspirations
            {activeTab === 'inspirations' && (
              <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-1 bg-orange-500 rounded-full" />
            )}
          </button>
          <button 
            onClick={() => setActiveTab('cinematics')}
            className={`pb-6 text-xs font-black uppercase tracking-[0.2em] transition-all relative ${
              activeTab === 'cinematics' ? 'text-white' : 'text-white/20 hover:text-white/40'
            }`}
          >
            Cinematics
            {activeTab === 'cinematics' && (
              <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-1 bg-orange-500 rounded-full" />
            )}
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div 
            key="loader"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-96 flex flex-col items-center justify-center gap-4"
          >
            <Loader2 className="w-10 h-10 text-orange-400 animate-spin" />
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20">Accessing your vault...</p>
          </motion.div>
        ) : activeTab === 'inspirations' ? (
          <motion.div
            key="inspirations"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {savedInspirations.length > 0 ? (
              <MasonryGrid images={savedInspirations} editable={true} />
            ) : (
              <EmptyState onBack={onBack} title="No inspirations saved yet" />
            )}
          </motion.div>
        ) : (
          <motion.div
            key="cinematics"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {savedVideos.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedVideos.map((video, index) => (
                  <motion.div
                    key={video.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => setSelectedVideo(video)}
                    className="group relative aspect-[9/16] bg-white/5 rounded-[32px] overflow-hidden cursor-pointer border border-white/10 hover:border-orange-500/50 transition-all"
                  >
                    <img 
                      src={video.image} 
                      alt="" 
                      className="w-full h-full object-cover"
                    />
                    
                    <div className="absolute top-6 right-6 flex flex-col gap-3 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeVideo(video.id);
                        }}
                        className="w-10 h-10 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-all border border-white/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-black">
                          <Play className="w-4 h-4 fill-current" />
                        </div>
                        <span className="text-xs font-black text-white uppercase tracking-widest">{video.user.name}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <EmptyState onBack={onBack} title="No cinematic views saved yet" />
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Video Modal - Reused from VideoGallery */}
      <AnimatePresence>
        {selectedVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-2xl flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg aspect-[9/16] bg-black rounded-[40px] overflow-hidden shadow-2xl border border-white/10"
            >
              <button 
                onClick={() => setSelectedVideo(null)}
                className="absolute top-6 right-6 z-10 w-12 h-12 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-orange-500 hover:text-black transition-all"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="relative w-full h-full">
                <video 
                  src={selectedVideo.video_files[0]?.link} 
                  autoPlay 
                  loop 
                  controls
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-8 pt-20 bg-gradient-to-t from-black via-black/50 to-transparent">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
                      <User className="w-6 h-6 text-orange-400" />
                    </div>
                    <p className="text-lg font-black text-white tracking-tighter">{selectedVideo.user.name}</p>
                  </div>
                  
                  <div className="flex gap-3">
                    <button
                      onClick={() => removeVideo(selectedVideo.id)}
                      className="w-14 h-14 bg-white/5 backdrop-blur-md rounded-2xl flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-all border border-white/10"
                    >
                      <Trash2 className="w-6 h-6" />
                    </button>
                    <button
                      onClick={() => handleDownload(selectedVideo)}
                      className="w-14 h-14 bg-orange-500 rounded-2xl flex items-center justify-center text-black hover:bg-white transition-all"
                    >
                      <Download className="w-6 h-6" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function EmptyState({ onBack, title }: { onBack: () => void, title: string }) {
  return (
    <div className="h-96 flex flex-col items-center justify-center text-white/10 space-y-6">
      <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center border border-white/5">
        <Info className="w-10 h-10" />
      </div>
      <div className="text-center">
        <p className="text-2xl font-black uppercase tracking-tighter">{title}</p>
        <button onClick={onBack} className="mt-4 text-orange-400 font-bold text-xs uppercase tracking-widest hover:underline transition-all">Start exploring →</button>
      </div>
    </div>
  );
}
