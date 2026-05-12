import React from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Menu, User, Globe, LogOut, X, TrendingUp, Sparkles, Home, Play } from 'lucide-react';
import { LANGUAGES } from '../constants';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../lib/AuthContext';

interface NavbarProps {
  currentView: 'feed' | 'videos' | 'profile';
  onViewChange: (view: 'feed' | 'videos' | 'profile') => void;
  onSearch: (query: string) => void;
}

export default function Navbar({ currentView, onViewChange, onSearch }: NavbarProps) {
  const { t, i18n } = useTranslation();
  const { user, signIn, logout } = useAuth();
  const [isLangOpen, setIsLangOpen] = React.useState(false);
  const [isUserOpen, setIsUserOpen] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState('');
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);

  const trendingSearches = [
    'Modern Kitchen', 'Traditional Indian', 'Small Balcony', 'Kids Bedroom', 'Luxury Living'
  ];

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setIsLangOpen(false);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchValue);
  };

  const handleProfileClick = () => {
    setIsUserOpen(false);
    onViewChange('profile');
  };

  return (
    <nav className="sticky top-0 z-50 bg-black/40 backdrop-blur-xl border-b border-white/10 px-4 py-4 md:px-8">
      {/* Mobile Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-2xl md:hidden flex flex-col"
          >
            <div className="p-4 pt-6">
              <div className="flex items-center gap-4 mb-10">
                <motion.div 
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  className="flex-1 relative"
                >
                  <input
                    autoFocus
                    type="text"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        onSearch(searchValue);
                        setIsSearchOpen(false);
                      }
                    }}
                    placeholder="Search inspiration..."
                    className="w-full h-16 bg-white/5 border border-white/10 rounded-2xl pl-14 pr-4 outline-none text-lg text-white font-bold focus:border-orange-500/50 transition-all shadow-2xl"
                  />
                  <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-orange-400 w-6 h-6" />
                </motion.div>
                <button 
                  onClick={() => setIsSearchOpen(false)}
                  className="text-white/40 font-black uppercase text-[10px] tracking-widest hover:text-white transition-colors"
                >
                  Cancel
                </button>
              </div>

              <div className="space-y-8 px-2">
                <div>
                  <div className="flex items-center gap-2 mb-4 text-white/20">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Trending Now</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {trendingSearches.map((term) => (
                      <button
                        key={term}
                        onClick={() => {
                          setSearchValue(term);
                          onSearch(term);
                          setIsSearchOpen(false);
                        }}
                        className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-bold text-white/60 hover:text-orange-400 hover:border-orange-400/50 transition-all"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-6 bg-orange-gradient rounded-3xl text-black">
                  <div className="flex items-center gap-3 mb-2">
                    <Sparkles className="w-5 h-5" />
                    <span className="font-black uppercase text-[10px] tracking-widest">AI Designer Tip</span>
                  </div>
                  <p className="text-sm font-bold leading-tight">Try searching for materials like "Teak Wood" or "Marble" for more specific results.</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Logo */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-8 h-8 md:w-10 md:h-10 bg-orange-gradient rounded-lg flex items-center justify-center shadow-lg shadow-orange-500/20">
            <span className="text-black font-bold text-lg md:text-xl">H</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tighter hidden lg:block">
            HomeArt AI
            <span className="text-[10px] font-light text-orange-400 uppercase tracking-widest ml-1 bg-white/5 px-1 py-0.5 rounded">PRO</span>
          </h1>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6 px-6 border-l border-white/5 mx-4">
          <button 
            onClick={() => onViewChange('feed')}
            className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] transition-colors ${
              currentView === 'feed' ? 'text-orange-400' : 'text-white/40 hover:text-white'
            }`}
          >
            <Home className="w-4 h-4" />
            Home
          </button>
          <button 
            onClick={() => onViewChange('videos')}
            className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] transition-colors ${
              currentView === 'videos' ? 'text-orange-400' : 'text-white/40 hover:text-white'
            }`}
          >
            <Play className="w-4 h-4 fill-current" />
            Videos
          </button>
        </div>

        {/* Search Bar */}
        <div className="flex-1 md:max-w-lg relative group">
          <form 
            onSubmit={handleSearchSubmit} 
            className="md:block hidden"
          >
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder={t('search_placeholder')}
              className="w-full bg-white/5 border border-white/10 rounded-full py-2.5 px-12 outline-none text-sm text-white/80 placeholder-white/30 focus:bg-white/10 focus:border-white/20 focus:ring-4 focus:ring-orange-500/5 transition-all"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 w-4 h-4 group-focus-within:text-orange-400 transition-colors" />
          </form>

          {/* Mobile Search Trigger */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="md:hidden w-full max-w-[150px] mx-auto bg-white/5 border border-white/10 rounded-full py-2.5 px-10 relative flex items-center"
          >
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 w-3 h-3" />
            <span className="text-xs text-white/20 font-bold uppercase tracking-widest truncate">
              {searchValue || 'Search...'}
            </span>
          </button>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 md:gap-4 shrink-0">
          <div className="relative">
            <button
              onClick={() => setIsLangOpen(!isLangOpen)}
              className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors flex items-center gap-2 text-xs font-medium"
            >
              <Globe className="w-3.5 h-3.5 text-orange-400" />
              <span className="uppercase text-white/70">{i18n.language}</span>
            </button>

            <AnimatePresence>
              {isLangOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-3 w-40 bg-black/90 backdrop-blur-2xl rounded-xl shadow-2xl border border-white/10 overflow-hidden"
                >
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => changeLanguage(lang.code)}
                      className={`w-full text-left px-4 py-3 text-sm hover:bg-white/5 transition-colors ${
                        i18n.language === lang.code ? 'font-bold text-orange-400 bg-orange-400/5' : 'text-white/60'
                      }`}
                    >
                      {lang.name}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <div className="relative">
            {user ? (
              <button 
                onClick={() => setIsUserOpen(!isUserOpen)}
                className="w-10 h-10 rounded-full overflow-hidden border border-white/10 hover:border-orange-400 transition-all shadow-lg bg-white/10 flex items-center justify-center"
              >
                <span className="text-sm font-black text-orange-400">{user.username.charAt(0).toUpperCase()}</span>
              </button>
            ) : (
              <button 
                onClick={() => {}} // User is handled at App level
                className="px-5 py-2 bg-orange-gradient text-black rounded-full text-sm font-bold hover:scale-105 transition-transform shadow-lg shadow-orange-500/10"
              >
                Login
              </button>
            )}

            <AnimatePresence>
              {isUserOpen && user && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-3 w-52 bg-black/90 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/10 overflow-hidden"
                >
                  <div className="p-4 border-b border-white/5">
                    <p className="text-sm font-bold text-white truncate">{user.username}</p>
                    <p className="text-[10px] text-white/40 uppercase tracking-wider truncate">{user.email}</p>
                  </div>
                  <button
                    onClick={handleProfileClick}
                    className="w-full text-left px-4 py-3 text-sm text-white/70 hover:bg-white/5 transition-colors flex items-center gap-2 border-b border-white/5"
                  >
                    <User className="w-4 h-4 text-orange-400" />
                    My Profile
                  </button>
                  <button
                    onClick={logout}
                    className="w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-red-400/5 transition-colors flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <button className="md:hidden p-2 hover:bg-gray-100 rounded-full transition-colors">
            <Menu className="w-6 h-6 text-gray-600" />
          </button>
        </div>
      </div>
    </nav>
  );
}
