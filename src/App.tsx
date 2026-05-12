import React from 'react';
import { useTranslation } from 'react-i18next';
import Navbar from './components/Navbar';
import CategoryBar from './components/CategoryBar';
import MasonryGrid from './components/MasonryGrid';
import ProfilePage from './components/ProfilePage';
import ProfessionalFinder from './components/ProfessionalFinder';
import BottomNav from './components/BottomNav';
import LoginForm from './components/LoginForm';
import VideoGallery from './components/VideoGallery';
import { fetchInteriorImages, fetchTrendingImages, PexelsImage } from './services/pexelsService';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, TrendingUp, Info, Loader2 } from 'lucide-react';
import { CEILING_DESIGNS } from './constants';
import { useAuth } from './lib/AuthContext';

export default function App() {
  const { t } = useTranslation();
  const { user, loading } = useAuth();
  const [view, setView] = React.useState<'feed' | 'videos' | 'profile'>('feed');
  const [images, setImages] = React.useState<PexelsImage[]>([]);
  const [selectedCategory, setSelectedCategory] = React.useState('indian-traditional');
  const [isLoading, setIsLoading] = React.useState(true);
  const [isLoadingMore, setIsLoadingMore] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [page, setPage] = React.useState(1);
  const [hasMore, setHasMore] = React.useState(true);

  const loaderRef = React.useRef<HTMLDivElement>(null);

  const loadImages = async (query: string, pageNum = 1, append = false) => {
    if (pageNum === 1) setIsLoading(true);
    else setIsLoadingMore(true);

    let data: PexelsImage[] = [];

    // If it's the first page of the 'ceilings' category and not a search, prepend mock designs
    if (query === 'ceilings' && pageNum === 1 && !searchQuery) {
      data = [...(CEILING_DESIGNS as PexelsImage[])];
      const pexelsData = await fetchInteriorImages(query, pageNum);
      data = [...data, ...pexelsData];
    } else {
      data = await fetchInteriorImages(query, pageNum);
    }
    
    if (data.length === 0) {
      setHasMore(false);
    } else {
      setImages(prev => {
        if (!append) return data;
        const existingIds = new Set(prev.map(img => img.id));
        const uniqueNewData = data.filter(img => !existingIds.has(img.id));
        return [...prev, ...uniqueNewData];
      });
      setHasMore(data.length >= 20);
    }
    
    setIsLoading(false);
    setIsLoadingMore(false);
  };

  React.useEffect(() => {
    if (!user) return;
    setPage(1);
    setHasMore(true);
    loadImages(selectedCategory, 1, false);
  }, [selectedCategory, user]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setPage(1);
    setHasMore(true);
    
    if (view === 'feed') {
      if (query) {
        loadImages(query, 1, false);
      } else {
        loadImages(selectedCategory, 1, false);
      }
    }
    // VideoGallery reacts to searchQuery change via useEffect
  };

  React.useEffect(() => {
    if (!user) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoading && !isLoadingMore && hasMore) {
          const nextPage = page + 1;
          setPage(nextPage);
          loadImages(searchQuery || selectedCategory, nextPage, true);
        }
      },
      { threshold: 1.0 }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => observer.disconnect();
  }, [isLoading, isLoadingMore, hasMore, page, searchQuery, selectedCategory]);

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-deep flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-orange-400 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <LoginForm />;
  }

  return (
    <div className="min-h-screen bg-bg-deep font-sans selection:bg-orange-500 selection:text-black">
      <Navbar 
        currentView={view}
        onViewChange={setView}
        onSearch={handleSearch} 
      />
      
      <main className="pb-32 md:pb-20">
        <AnimatePresence mode="wait">
          {view === 'feed' ? (
            <motion.div
              key="feed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <CategoryBar 
                selectedCategory={selectedCategory} 
                onSelect={(id) => { setSelectedCategory(id); setSearchQuery(''); }} 
              />
              {/* Content Section */}
              <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="px-4 md:px-8 pt-12 md:pt-16 pb-12">
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-6 md:space-y-8"
                  >
                    <div className="flex items-center gap-3 text-orange-400 text-[10px] font-black uppercase tracking-[0.3em]">
                      <TrendingUp className="w-5 h-5" />
                      <span>{searchQuery ? `Searching "${searchQuery}"` : 'Global Trending'}</span>
                    </div>
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                      <h2 className="text-3xl sm:text-5xl md:text-8xl font-black tracking-tighter leading-[0.9] max-w-3xl">
                        {searchQuery ? `Personalized ${searchQuery}` : `Modern ${selectedCategory.split('-').join(' ')}`} 
                        <span className="text-white/20 block md:inline md:ml-4">Inspiration</span>
                      </h2>
                      
                      <div className="flex items-center gap-6 bg-white/5 border border-white/10 p-3 rounded-[24px] backdrop-blur-xl">
                        <div className="flex -space-x-4">
                          {[1,2,3,4,5].map(i => (
                            <div key={i} className="w-10 h-10 rounded-full border-2 border-bg-deep bg-white/10 overflow-hidden shadow-2xl">
                              <img src={`https://i.pravatar.cc/100?img=${i+20}`} alt="User" />
                            </div>
                          ))}
                        </div>
                        <div className="flex flex-col">
                          <p className="text-[10px] font-black text-white uppercase tracking-widest">Community</p>
                          <p className="text-xs font-medium text-white/40">
                            12k+ Active Designers
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>

                <div className="px-4 md:px-8">
                  <ProfessionalFinder />
                </div>

                {/* Grid or Loader */}
                <div className="mt-8">
                  {isLoading ? (
                    <div className="min-h-[500px] flex items-center justify-center">
                      <div className="relative">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                          className="w-16 h-16 border-2 border-white/5 border-t-orange-500 rounded-full"
                        />
                        <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 text-orange-400 animate-pulse" />
                      </div>
                    </div>
                  ) : images.length > 0 ? (
                    <>
                      <MasonryGrid images={images} />
                      {hasMore && (
                        <div ref={loaderRef} className="py-12 flex justify-center">
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                            className="w-8 h-8 border-2 border-white/10 border-t-orange-500 rounded-full"
                          />
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="min-h-[400px] flex flex-col items-center justify-center text-white/20 space-y-6">
                      <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center border border-white/5">
                        <Info className="w-10 h-10" />
                      </div>
                      <p className="text-2xl font-black uppercase tracking-tighter">{t('no_results')}</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ) : view === 'videos' ? (
            <motion.div
              key="videos"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <VideoGallery 
                selectedCategory={selectedCategory}
                onCategorySelect={(id) => { setSelectedCategory(id); setSearchQuery(''); }}
                searchQuery={searchQuery}
              />
            </motion.div>
          ) : (
            <motion.div
              key="profile"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <ProfilePage onBack={() => setView('feed')} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <BottomNav currentView={view} onViewChange={(v) => setView(v)} />

      {/* Footer */}
      <footer className="border-t border-white/5 py-24 px-4 md:px-8 bg-black/40 backdrop-blur-3xl">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-16">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-gradient rounded-xl flex items-center justify-center shadow-2xl shadow-orange-500/20">
                <span className="text-black font-black text-xl italic font-serif">H</span>
              </div>
              <span className="font-black text-2xl tracking-tighter">HomeArt <span className="text-orange-400 text-xs">AI</span></span>
            </div>
            <p className="text-white/30 max-w-sm text-sm leading-relaxed font-medium">
              HomeArt is the world's first AI-native interior inspiration engine, 
              connecting visionaries with the perfect design elements for their sanctuary.
            </p>
            <div className="flex gap-4">
              {['Twitter', 'Instagram', 'Dribbble'].map(social => (
                <a key={social} href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 hover:text-orange-400 transition-all">
                   <span className="hidden">{social}</span>
                   <div className="w-4 h-4 bg-white/20 rounded-sm" />
                </a>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-16">
            <div>
              <h4 className="font-black text-[10px] mb-8 uppercase tracking-[0.3em] text-white/20">Experience</h4>
              <ul className="space-y-4 text-xs font-bold text-white/50 tracking-wider">
                <li><a href="#" className="hover:text-orange-400 transition-colors uppercase">Visionary Feed</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-black text-[10px] mb-8 uppercase tracking-[0.3em] text-white/20">Ecosystem</h4>
              <ul className="space-y-4 text-xs font-bold text-white/50 tracking-wider">
                <li><a href="#" className="hover:text-orange-400 transition-colors uppercase">Partnerships</a></li>
                <li><a href="#" className="hover:text-orange-400 transition-colors uppercase">API Access</a></li>
                <li><a href="#" className="hover:text-orange-400 transition-colors uppercase">Designers Portal</a></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto mt-24 pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
          <p className="text-[10px] text-white/20 font-black uppercase tracking-[0.3em]">© 2026 HomeArt Engine. Built with Gemini.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <div className="px-4 py-1.5 bg-white/5 border border-white/10 text-orange-400 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg">
              Gemini 3-Flash Pro
            </div>
            <div className="px-4 py-1.5 bg-white/5 border border-white/10 text-white/40 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">
              Global Presence
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
