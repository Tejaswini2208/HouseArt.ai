import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Loader2, Info, X, User, Download, Bookmark, Check, Plus } from 'lucide-react';
import CategoryBar from './CategoryBar';
import { fetchInteriorVideos, PexelsVideo, PexelsImage } from '../services/pexelsService';

import { useDesign } from '../lib/DesignContext';

interface VideoGalleryProps {
  selectedCategory: string;
  onCategorySelect: (id: string) => void;
  searchQuery?: string;
}

export default function VideoGallery({ selectedCategory, onCategorySelect, searchQuery }: VideoGalleryProps) {
  const { savedVideoIds, saveVideo, removeVideo } = useDesign();
  const [videos, setVideos] = React.useState<PexelsVideo[]>([]);
  const [fallbackImages, setFallbackImages] = React.useState<PexelsImage[]>([]);
  const [isFallback, setIsFallback] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isMoreLoading, setIsMoreLoading] = React.useState(false);
  const [page, setPage] = React.useState(1);
  const [selectedVideo, setSelectedVideo] = React.useState<PexelsVideo | null>(null);

  React.useEffect(() => {
    const loadVideos = async () => {
      setIsLoading(true);
      setIsFallback(false);
      setFallbackImages([]);
      setVideos([]);
      setPage(1);
      
      const query = searchQuery || selectedCategory;
      const result = await fetchInteriorVideos(query, 1);
      
      if (result.isFallback && result.images) {
        setIsFallback(true);
        setFallbackImages(result.images);
      } else if (result.videos.length === 0) {
        // Absolute fallback: load default popular designs
        setIsFallback(true);
        const defaultResult = await fetchInteriorVideos('luxury modern interior design', 1);
        setVideos(defaultResult.videos);
      } else {
        setVideos(result.videos);
      }
      
      setIsLoading(false);
    };
    loadVideos();
  }, [selectedCategory, searchQuery]);

  const loadMore = async () => {
    if (isMoreLoading || isFallback) return;
    setIsMoreLoading(true);
    const nextPage = page + 1;
    const query = searchQuery || selectedCategory;
    const result = await fetchInteriorVideos(query, nextPage);
    if (!result.isFallback) {
      setVideos(prev => [...prev, ...result.videos]);
      setPage(nextPage);
    }
    setIsMoreLoading(false);
  };

  const handleSave = (e: React.MouseEvent, video: PexelsVideo) => {
    e.stopPropagation();
    if (savedVideoIds.has(video.id)) {
      removeVideo(video.id);
    } else {
      saveVideo(video);
    }
  };

  const handleDownload = async (e: React.MouseEvent, video: PexelsVideo) => {
    e.stopPropagation();
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
      console.error("Download failed:", error);
      // Fallback to opening in new tab
      window.open(videoUrl, '_blank');
    }
  };

  return (
    <div className="min-h-screen">
      <CategoryBar 
        selectedCategory={selectedCategory} 
        onSelect={onCategorySelect} 
      />

      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-12 md:pt-16">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6 md:space-y-8 mb-12"
        >
          <div className="flex items-center gap-3 text-orange-400 text-[10px] font-black uppercase tracking-[0.3em]">
            <Play className="w-5 h-5 fill-current" />
            <span>Cinematic Inspiration</span>
          </div>
          <h2 className="text-3xl sm:text-5xl md:text-8xl font-black tracking-tighter leading-[0.9] max-w-3xl">
            {searchQuery ? `Search: ${searchQuery}` : selectedCategory.split('-').join(' ')} 
            <span className="text-white/20 block md:inline md:ml-4">In Motion</span>
          </h2>
        </motion.div>

        {isLoading ? (
          <div className="min-h-[400px] flex items-center justify-center">
            <Loader2 className="w-12 h-12 text-orange-400 animate-spin" />
          </div>
        ) : (videos.length > 0 || fallbackImages.length > 0) ? (
          <>
            {isFallback && (
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="mb-8 p-4 bg-orange-500/10 border border-orange-500/20 rounded-2xl flex items-center gap-4 max-w-2xl"
              >
                <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-black shadow-lg shadow-orange-500/20">
                  <Info className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-orange-400 uppercase tracking-widest leading-none mb-1">Feedback</p>
                  <p className="text-sm font-bold text-white/80">No videos found for this specific style, showing inspired designs instead.</p>
                </div>
              </motion.div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.map((video, index) => (
                <motion.div
                  key={`${video.id}-${index}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index % 10 * 0.1 }}
                  onClick={() => setSelectedVideo(video)}
                  className="group relative aspect-[9/16] bg-white/5 rounded-[32px] overflow-hidden cursor-pointer border border-white/10 hover:border-orange-500/50 transition-all"
                >
                  <img 
                    src={video.image} 
                    alt="" 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  
                  <div className="absolute top-6 left-6 z-10">
                    <span className="bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full text-[8px] font-black text-orange-400 uppercase tracking-widest border border-white/10">
                      Motion
                    </span>
                  </div>

                  {/* Actions Overlay */}
                  <div className="absolute top-6 right-6 flex flex-col gap-3 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    <button
                      onClick={(e) => handleSave(e, video)}
                      className="w-10 h-10 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-orange-500 hover:text-black transition-all border border-white/10"
                    >
                      {savedVideoIds.has(video.id) ? <Check className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={(e) => handleDownload(e, video)}
                      className="w-10 h-10 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-orange-500 hover:text-black transition-all border border-white/10"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Watermark UI */}
                  <div className="absolute bottom-20 right-6 text-[8px] font-black text-white/30 uppercase tracking-[0.2em] pointer-events-none select-none">
                    HomeArt AI
                  </div>

                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-black">
                        <Play className="w-4 h-4 fill-current" />
                      </div>
                      <span className="text-xs font-black text-white uppercase tracking-widest">{video.user.name}</span>
                    </div>
                  </div>
                </motion.div>
              ))}

              {fallbackImages.map((image, index) => (
                <motion.div
                  key={`${image.id}-${index}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: (videos.length + index) % 10 * 0.1 }}
                  className="group relative aspect-[9/16] bg-white/5 rounded-[32px] overflow-hidden border border-white/10 hover:border-orange-500/50 transition-all pointer-events-none"
                >
                  <img 
                    src={image.src.large2x} 
                    alt="" 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  
                  <div className="absolute top-6 left-6 z-10">
                    <span className="bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full text-[8px] font-black text-white/40 uppercase tracking-widest border border-white/10">
                      Stills
                    </span>
                  </div>

                  <div className="absolute bottom-20 right-6 text-[8px] font-black text-white/30 uppercase tracking-[0.2em] pointer-events-none select-none">
                    HomeArt AI
                  </div>

                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xs font-black text-white/60 uppercase tracking-widest">{image.photographer}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {videos.length > 0 && !isFallback && (
              <div className="py-20 flex justify-center">
                <button
                  onClick={loadMore}
                  disabled={isMoreLoading}
                  className="group flex items-center gap-4 bg-white/5 hover:bg-orange-500 border border-white/10 hover:border-orange-500 px-8 py-4 rounded-full transition-all disabled:opacity-50"
                >
                  {isMoreLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin text-orange-400 group-hover:text-black" />
                  ) : (
                    <Plus className="w-5 h-5 text-orange-400 group-hover:text-black" />
                  )}
                  <span className="text-xs font-black uppercase tracking-[0.2em] text-white group-hover:text-black">Load More Cinematic Views</span>
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="min-h-[400px] flex flex-col items-center justify-center text-white/20 space-y-6">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center border border-white/5">
              <Info className="w-10 h-10" />
            </div>
            <p className="text-2xl font-black uppercase tracking-tighter">No videos found</p>
          </div>
        )}
      </div>

      {/* Video Modal */}
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
                {/* Visual Watermark */}
                <div className="absolute bottom-32 right-8 text-[10px] font-black text-white/20 uppercase tracking-[0.4em] pointer-events-none select-none z-10">
                  HomeArt AI
                </div>
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-8 pt-20 bg-gradient-to-t from-black via-black/50 to-transparent">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
                      <User className="w-6 h-6 text-orange-400" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-orange-400 uppercase tracking-widest leading-none mb-1">Creator</p>
                      <p className="text-lg font-black text-white tracking-tighter">{selectedVideo.user.name}</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <button
                      onClick={(e) => handleSave(e, selectedVideo)}
                      className="w-14 h-14 bg-white/5 backdrop-blur-md rounded-2xl flex items-center justify-center text-white hover:bg-orange-500 hover:text-black transition-all border border-white/10"
                    >
                      {savedVideoIds.has(selectedVideo.id) ? <Check className="w-6 h-6" /> : <Bookmark className="w-6 h-6" />}
                    </button>
                    <button
                      onClick={(e) => handleDownload(e, selectedVideo)}
                      className="w-14 h-14 bg-orange-500 rounded-2xl flex items-center justify-center text-black hover:bg-white transition-all shadow-xl shadow-orange-500/20"
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
