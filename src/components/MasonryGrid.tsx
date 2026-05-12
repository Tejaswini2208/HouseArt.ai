import React from 'react';
import Masonry from 'react-masonry-css';
import { useTranslation } from 'react-i18next';
import { Heart, Download, ExternalLink, Maximize2, Loader2, Sparkles, ArrowRight, Trash2 } from 'lucide-react';
import { PexelsImage, fetchInteriorImages } from '../services/pexelsService';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../lib/AuthContext';
import { useDesign } from '../lib/DesignContext';

interface MasonryGridProps {
  images: PexelsImage[];
  editable?: boolean;
}

export default function MasonryGrid({ images, editable = false }: MasonryGridProps) {
  const { t } = useTranslation();
  const { user, signIn } = useAuth();
  const { savedIds, save, remove } = useDesign();
  const [selectedImage, setSelectedImage] = React.useState<PexelsImage | null>(null);
  const [displayImages, setDisplayImages] = React.useState<PexelsImage[]>(images);

  React.useEffect(() => {
    setDisplayImages(images);
  }, [images]);
  const [similarImages, setSimilarImages] = React.useState<PexelsImage[]>([]);
  const [isFetchingSimilar, setIsFetchingSimilar] = React.useState(false);
  const [similarPage, setSimilarPage] = React.useState(1);
  const [hasMoreSimilar, setHasMoreSimilar] = React.useState(true);
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const loadingRef = React.useRef<HTMLDivElement>(null);

  const rotateKeywords = (base: string, page: number) => {
    const rotations = [
      base,
      'Luxury Indian Interior',
      'Indo-Modern Decor',
      'Contemporary Indian Architecture',
      'Ethnic Indian Designs'
    ];
    // Rotate every 2 pages (approx 40-60 images since per_page is 30 in service now)
    const index = Math.floor((page - 1) / 2) % rotations.length;
    return rotations[index];
  };

  React.useEffect(() => {
    if (selectedImage) {
      setSimilarImages([]);
      setSimilarPage(1);
      setHasMoreSimilar(true);
      loadSimilarImages(selectedImage.alt || selectedImage.tag || 'interior', 1, true);
      if (scrollRef.current) {
        scrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  }, [selectedImage]);

  const loadSimilarImages = async (query: string, page: number, isNew: boolean = false) => {
    if (isFetchingSimilar) return;
    setIsFetchingSimilar(true);
    try {
      const rotatedQuery = rotateKeywords(query, page);
      const images = await fetchInteriorImages(rotatedQuery, page);
      
      if (images.length === 0) {
        setHasMoreSimilar(false);
      } else {
        const filtered = images.filter(img => img.id !== selectedImage?.id);
        setSimilarImages(prev => isNew ? filtered : [...prev, ...filtered]);
      }
    } catch (error) {
      console.error(error);
      setHasMoreSimilar(false);
    } finally {
      setIsFetchingSimilar(false);
    }
  };

  // Infinite scroll observer
  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isFetchingSimilar && hasMoreSimilar && selectedImage) {
          const nextPage = similarPage + 1;
          setSimilarPage(nextPage);
          loadSimilarImages(selectedImage.alt || selectedImage.tag || 'interior', nextPage);
        }
      },
      { threshold: 0.1 }
    );

    if (loadingRef.current) {
      observer.observe(loadingRef.current);
    }

    return () => observer.disconnect();
  }, [selectedImage, similarPage, isFetchingSimilar, hasMoreSimilar]);

  const handleSave = async (e: React.MouseEvent, image: PexelsImage) => {
    e.stopPropagation();
    if (!user) return;
    await save(image);
  };

  const handleRemove = async (e: React.MouseEvent, imageId: number) => {
    e.stopPropagation();
    if (!user) return;
    await remove(imageId);
  };

  const handleDownload = async (e: React.MouseEvent, image: PexelsImage) => {
    e.stopPropagation();
    try {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = image.src?.original || '';

      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });

      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');

      if (!ctx) return;

      // Draw original image
      ctx.drawImage(img, 0, 0);

      // Setup watermark
      const padding = canvas.width * 0.05;
      const fontSize = Math.max(canvas.width / 40, 24);
      ctx.font = `900 ${fontSize}px "Inter", sans-serif`;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.textAlign = 'right';
      ctx.textBaseline = 'bottom';

      // Draw watermark text
      ctx.fillText('HouseArt AI', canvas.width - padding, canvas.height - padding);

      // Trigger download
      const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
      const link = document.createElement('a');
      link.download = `HouseArt_AI_Inspiration_${image.id}.jpg`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  const breakpointColumnsObj = {
    default: 4,
    1100: 3,
    700: 2,
  };

  return (
    <div className="px-4 md:px-8 py-6">
      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="flex -ml-4 w-auto"
        columnClassName="pl-4 bg-clip-padding"
      >
        {displayImages.map((image, idx) => (
          <motion.div
            key={image.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="mb-4 relative group cursor-pointer rounded-2xl overflow-hidden bg-white/5 ring-1 ring-white/10"
            onClick={() => setSelectedImage(image)}
          >
            <img
              src={image.src?.large}
              alt={image.alt}
              className="w-full h-auto object-cover transform transition-transform duration-700 group-hover:scale-110"
              loading="lazy"
            />
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-between z-20">
              <div className="flex justify-between items-start gap-2">
                {image.tag && (
                  <div className="px-2 py-1 bg-orange-500 text-black text-[9px] font-black uppercase tracking-widest rounded-lg shadow-xl animate-in fade-in slide-in-from-top-1">
                    {image.tag}
                  </div>
                )}
                <div className="flex gap-2">
                  {editable ? (
                    <button 
                      onClick={(e) => handleRemove(e, image.id)}
                      className="p-2 rounded-full bg-red-500 text-white shadow-lg shadow-red-500/20 transition-all hover:scale-110 active:scale-95"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  ) : (
                    <button 
                      onClick={(e) => handleSave(e, image)}
                      className={`p-2 rounded-full transition-all hover:scale-110 active:scale-95 ${
                        savedIds.has(image.id) 
                          ? 'bg-orange-500 text-black shadow-lg shadow-orange-500/20' 
                          : 'bg-white/10 backdrop-blur-md text-white border border-white/10'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${savedIds.has(image.id) ? 'fill-current' : ''}`} />
                    </button>
                  )}
                </div>
              </div>
              
              <div>
                <p className="text-orange-400 text-[10px] font-bold uppercase tracking-widest mb-1">Inspiration</p>
                <div className="flex items-center justify-between">
                  <p className="text-white text-sm font-bold truncate pr-2">
                    {image.photographer}
                  </p>
                  <div className="flex gap-2">
                    <div className="p-2 bg-white/10 backdrop-blur-md rounded-full text-white/70 border border-white/5">
                      <Maximize2 className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </Masonry>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-sm flex items-end md:items-center justify-center p-0 md:p-8"
          >
            <motion.div
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-6xl w-full h-[90vh] md:h-[95vh] bg-bg-deep rounded-t-[32px] md:rounded-[32px] overflow-hidden shadow-2xl border-t md:border border-white/10 flex flex-col"
            >
              <div ref={scrollRef} className="flex-1 overflow-y-auto no-scrollbar">
                {/* Main Content */}
                <div className="flex flex-col md:flex-row min-h-full">
                  <div className="md:w-2/3 bg-black flex items-center justify-center overflow-hidden border-r border-white/10 relative group">
                    <img 
                      src={selectedImage.src?.original} 
                      alt={selectedImage.alt}
                      className="max-w-full max-h-[70vh] md:max-h-full object-contain"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                      <p className="text-white/60 text-xs font-bold uppercase tracking-[0.2em]">High Resolution Master</p>
                    </div>
                  </div>
                  
                  <div className="md:w-1/3 p-8 md:p-12 flex flex-col justify-between bg-bg-deep text-white border-b md:border-b-0 border-white/10">
                    <div>
                      <div className="flex items-center justify-between mb-6">
                        <div className="inline-block px-3 py-1 bg-orange-400/10 text-orange-400 text-[10px] font-black uppercase tracking-widest rounded-full">
                          Exclusive Idea
                        </div>
                        <button 
                          onClick={() => setSelectedImage(null)}
                          className="p-2 hover:bg-white/5 rounded-full transition-colors"
                        >
                          <Maximize2 className="w-5 h-5 text-white/40 rotate-45" />
                        </button>
                      </div>

                      <h2 className="text-2xl md:text-4xl font-black mb-4 tracking-tight leading-none uppercase">{selectedImage.alt || t('explore')}</h2>
                      <div className="flex items-center gap-2 mb-8">
                        <div className="w-2 h-2 bg-orange-400 rounded-full" />
                        <p className="text-white/40 font-bold text-[10px] uppercase tracking-widest">Captured by {selectedImage.photographer}</p>
                      </div>
                      
                      <div className="space-y-4">
                        <button 
                          onClick={(e) => handleSave(e, selectedImage)}
                          className={`w-full h-14 md:h-16 rounded-[24px] font-black flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-95 text-sm ${
                            savedIds.has(selectedImage.id) 
                              ? 'bg-orange-gradient text-black shadow-[0_0_40px_rgba(249,115,22,0.4)]' 
                              : 'bg-white text-black hover:bg-gray-100'
                          }`}
                        >
                          <span className="uppercase tracking-[0.2em]">{savedIds.has(selectedImage.id) ? t('saved') : t('save')}</span>
                          <Heart className={`w-5 h-5 ${savedIds.has(selectedImage.id) ? 'fill-current' : ''}`} />
                        </button>

                        <button 
                          onClick={(e) => handleDownload(e, selectedImage)}
                          className="w-full h-14 md:h-16 border border-white/10 rounded-[24px] font-black flex items-center justify-center gap-3 hover:bg-white/5 transition-all text-sm uppercase tracking-[0.2em] text-white/80"
                        >
                          <span>{t('download')}</span>
                          <Download className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="pt-12 md:pt-0">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-14 h-14 rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
                          <img src={`https://i.pravatar.cc/100?u=${selectedImage.photographer}`} alt={selectedImage.photographer} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="text-sm font-black uppercase tracking-tight">{selectedImage.photographer}</p>
                          <p className="text-[10px] text-orange-400 font-black uppercase tracking-widest">Senior Contributor</p>
                        </div>
                      </div>
                      <p className="text-xs text-white/30 leading-relaxed font-medium">
                        This curated interior vision represents professional-grade architecture and design. 
                        Specs: {selectedImage.width}x{selectedImage.height}px • Ultra HD
                      </p>
                    </div>
                  </div>
                </div>

                {/* Similar Inspirations */}
                <div className="p-8 md:p-12 border-t border-white/10 bg-black/20">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                      <Sparkles className="w-6 h-6 text-orange-400" />
                      <h3 className="text-2xl font-black uppercase tracking-tight">Similar Inspirations</h3>
                    </div>
                    <div className="h-px flex-1 mx-8 bg-white/5 md:block hidden" />
                    <p className="text-[10px] font-black uppercase tracking-widest text-white/30">Discovery Feed</p>
                  </div>

                  {similarImages.length === 0 && isFetchingSimilar ? (
                    <div className="h-64 flex flex-col items-center justify-center gap-4">
                      <Loader2 className="w-8 h-8 text-orange-400 animate-spin" />
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Curating matching visions...</p>
                    </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                        {similarImages.map((img, idx) => (
                          <motion.div
                            key={`${img.id}-${idx}`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: (idx % 24) * 0.05 }}
                            onClick={() => setSelectedImage(img)}
                            className="group cursor-pointer space-y-3"
                          >
                            <div className="aspect-[4/5] rounded-[24px] overflow-hidden border border-white/10 bg-white/5 relative">
                              <img 
                                src={img.src?.large} 
                                alt={img.alt} 
                                loading="lazy"
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                              />
                              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <div className="p-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
                                  <ArrowRight className="w-5 h-5 text-white" />
                                </div>
                              </div>
                            </div>
                            <div>
                              <p className="text-[10px] font-black uppercase tracking-widest text-orange-400/60 truncate">{img.alt || 'Interior Insight'}</p>
                              <p className="text-[8px] font-bold text-white/20 uppercase tracking-widest">via Pexels</p>
                            </div>
                          </motion.div>
                        ))}
                      </div>

                      {/* Infinite Scroll Loading Indicator */}
                      <div ref={loadingRef} className="py-12 flex flex-col items-center justify-center gap-4">
                        {hasMoreSimilar ? (
                          <>
                            <Loader2 className="w-6 h-6 text-orange-400 animate-spin" />
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20">Sourcing more ideas...</p>
                          </>
                        ) : (
                          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/10">You've reached the end of this curation</p>
                        )}
                      </div>
                    </>
                  )}
                  
                  <div className="mt-12 pt-8 border-t border-white/5 flex justify-center">
                    <p className="text-[10px] font-bold text-white/10 uppercase tracking-[.5em]">Keep Exploring • AI Curated</p>
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
