import React from 'react';
import { useTranslation } from 'react-i18next';
import { Upload, Camera, Sparkles, Loader2, X, ShoppingBag } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import Markdown from 'react-markdown';
import { ai, MODELS } from '../lib/gemini';
import { fetchInteriorImages } from '../services/pexelsService';

export default function RoomAnalyzer() {
  const { t, i18n } = useTranslation();
  const [image, setImage] = React.useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = React.useState(false);
  const [result, setResult] = React.useState<string | null>(null);
  const [decorImages, setDecorImages] = React.useState<any[]>([]);

  const onDrop = React.useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result as string);
      setResult(null);
      setDecorImages([]);
    };
    reader.readAsDataURL(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop, 
    accept: {
      'image/jpeg': [],
      'image/png': [],
      'image/webp': []
    },
    multiple: false 
  } as any);

  const analyzeRoom = async () => {
    if (!image) return;
    setIsAnalyzing(true);
    
    try {
      const base64Data = image.split(',')[1];
      const response = await ai.models.generateContent({
        model: MODELS.flash,
        contents: [
          {
            parts: [
              { inlineData: { data: base64Data, mimeType: 'image/jpeg' } },
              { text: `Analyze this room and provide interior design suggestions in clean Markdown format. 
              Suggest a style (favoring Indian Traditional or Indo-Modern if appropriate), color palette, false ceiling ideas, wardrobe styles, and furniture recommendations. 
              Include thoughts on traditional elements like Pooja room integration, ethnic decor, or courtyard-style features if the space allows.
              
              CRITICAL: At the end of your analysis, identify at least 10 specific decor items (e.g., "Modern Brass Floor Lamp", "Jute Geometric Rug", "Terracotta Planter") that would complement this specific space. 
              Format this list exactly as a comma-separated line starting with "Tags: ".
              Example: Tags: Item 1, Item 2, Item 3, ..., Item 10.
              
              Respond in ${i18n.language === 'te' ? 'Telugu' : 'English'}. 
              Avoid strange escape characters. Be creative and modern yet culturally relevant.` }
            ]
          }
        ]
      });

      let text = response.text || 'Analysis failed.';
      
      // Sanitize output: remove literal \n, \", and other common escape artifacts if they appear as text
      text = text.replace(/\\n/g, '\n')
                 .replace(/\\"/g, '"')
                 .replace(/\\\//g, '/')
                 .replace(/\\'/g, "'");

      setResult(text);

      // Extract tags and fetch images from Pexels
      const tagsMatch = text.match(/Tags:\s*(.*)/i);
      if (tagsMatch) {
        const tags = tagsMatch[1].split(',').map(tag => tag.trim()).filter(tag => tag.length > 0).slice(0, 12);
        const decorResults: any[] = [];
        
        // Fetch in parallel for better speed, but still a lot of requests
        const fetchPromises = tags.map(async (tag) => {
          try {
            const pexelsData = await fetchInteriorImages(tag, 1);
            if (pexelsData && pexelsData.length > 0) {
              return {
                tag,
                src: pexelsData[0].src.medium,
                photographer: pexelsData[0].photographer
              };
            }
          } catch (e) {
            console.error(`Failed to fetch image for tag: ${tag}`, e);
          }
          return null;
        });

        const results = await Promise.all(fetchPromises);
        setDecorImages(results.filter(r => r !== null));
      }

    } catch (error) {
      console.error(error);
      setResult('Error analyzing image. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <section className="px-4 md:px-8 py-16 bg-white/5 border border-white/10 rounded-[40px] mx-4 md:mx-8 mb-12 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 blur-[120px] rounded-full -mr-48 -mt-48" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-500/5 blur-[120px] rounded-full -ml-48 -mb-48" />

      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-16 items-center relative z-10">
        <div className="lg:w-1/2 space-y-8 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 bg-orange-500/10 px-4 py-2 rounded-full border border-orange-500/20 shadow-lg shadow-orange-500/5">
            <Sparkles className="w-4 h-4 text-orange-400" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-400">{t('ai_analyzer')}</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black leading-none tracking-tighter">
            Analyze Your <br/> <span className="text-orange-gradient">Room with AI</span>
          </h2>
          <p className="text-white/40 text-lg max-w-lg mx-auto lg:mx-0 font-medium">
            Upload a photo of your empty or furnished room and get personalized design inspirations and matching color palettes.
          </p>
          
          <div className="grid grid-cols-3 gap-4 pt-4">
            <div className="bg-white/5 p-5 rounded-3xl border border-white/5 text-center backdrop-blur-md">
              <p className="font-black text-2xl text-white">100+</p>
              <p className="text-[10px] text-white/30 uppercase tracking-widest font-black mt-1">Ideas</p>
            </div>
            <div className="bg-white/5 p-5 rounded-3xl border border-white/5 text-center backdrop-blur-md">
              <p className="font-black text-2xl text-white">Instant</p>
              <p className="text-[10px] text-white/30 uppercase tracking-widest font-black mt-1">Feedback</p>
            </div>
            <div className="bg-white/5 p-5 rounded-3xl border border-white/5 text-center backdrop-blur-md">
              <p className="font-black text-2xl text-white">Free</p>
              <p className="text-[10px] text-white/30 uppercase tracking-widest font-black mt-1">Analysis</p>
            </div>
          </div>
        </div>

        <div className="lg:w-1/2 w-full">
          {!image ? (
            <div 
              {...getRootProps()} 
              className={`border-2 border-dashed rounded-[40px] p-16 flex flex-col items-center justify-center transition-all cursor-pointer group ${
                isDragActive ? 'border-orange-500 bg-orange-500/5' : 'border-white/10 bg-white/5 hover:border-white/20'
              }`}
            >
              <input {...getInputProps()} />
              <div className="w-20 h-20 bg-orange-gradient rounded-3xl flex items-center justify-center mb-6 shadow-2xl shadow-orange-500/20 group-hover:scale-110 transition-transform">
                <Upload className="w-8 h-8 text-black" />
              </div>
              <p className="text-xl font-black mb-2 uppercase tracking-tight">Click or drag & drop</p>
              <p className="text-white/30 text-xs font-bold tracking-widest uppercase">High Res Images Preferred</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="relative rounded-[40px] overflow-hidden bg-white/5 aspect-video flex items-center justify-center border border-white/10 shadow-2xl">
                <img src={image} alt="Upload" className="max-w-full max-h-full object-contain" />
                <button 
                  onClick={() => { setImage(null); setResult(null); setDecorImages([]); }}
                  className="absolute top-4 right-4 p-3 bg-black/60 backdrop-blur-xl rounded-full hover:bg-black/80 transition-colors border border-white/10"
                >
                  <X className="w-5 h-5 text-red-400" />
                </button>
              </div>

              {!result ? (
                <button 
                  onClick={analyzeRoom}
                  disabled={isAnalyzing}
                  className="w-full py-5 bg-orange-gradient text-black rounded-3xl font-black uppercase tracking-widest text-sm flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-95 shadow-2xl shadow-orange-500/20 disabled:opacity-50"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>{t('analyzing')}</span>
                    </>
                  ) : (
                    <>
                      <Camera className="w-5 h-5" />
                      <span>Start Analysis</span>
                    </>
                  )}
                </button>
              ) : (
                <div className="flex flex-col gap-6">
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-8 bg-white/5 rounded-[40px] border border-white/10 backdrop-blur-xl"
                  >
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/5">
                      <Sparkles className="w-6 h-6 text-orange-400" />
                      <h3 className="font-black text-xl uppercase tracking-tight">AI Vision Report</h3>
                    </div>
                    <div className="max-h-80 overflow-y-auto pr-4 text-sm leading-relaxed text-white/80 no-scrollbar font-medium prose prose-invert prose-sm">
                      <Markdown>
                        {result.split(/Tags:/i)[0]}
                      </Markdown>
                    </div>
                  </motion.div>

                  {decorImages.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="space-y-4"
                    >
                      <div className="flex items-center gap-2 px-2">
                        <ShoppingBag className="w-4 h-4 text-orange-400" />
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60">Recommended Decor</h4>
                      </div>
                      
                      <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2 px-2">
                        {decorImages.map((item, idx) => (
                          <div 
                            key={idx}
                            className="min-w-[140px] md:min-w-[160px] aspect-square rounded-3xl overflow-hidden relative group cursor-pointer border border-white/10"
                          >
                            <img src={item.src} alt={item.tag} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-3">
                              <p className="text-[10px] text-white font-bold truncate">{item.tag}</p>
                              <p className="text-[8px] text-white/40 truncate">via Pexels</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
