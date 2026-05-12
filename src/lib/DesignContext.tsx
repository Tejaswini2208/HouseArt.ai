import React from 'react';
import { PexelsImage, PexelsVideo } from '../services/pexelsService';
import { useAuth } from './AuthContext';

interface DesignContextType {
  savedInspirations: PexelsImage[];
  savedVideos: PexelsVideo[];
  savedIds: Set<number>;
  savedVideoIds: Set<number>;
  save: (image: PexelsImage) => Promise<void>;
  remove: (imageId: number) => Promise<void>;
  saveVideo: (video: PexelsVideo) => Promise<void>;
  removeVideo: (videoId: number) => Promise<void>;
  isLoading: boolean;
}

const DesignContext = React.createContext<DesignContextType | null>(null);

export function DesignProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [savedInspirations, setSavedInspirations] = React.useState<PexelsImage[]>([]);
  const [savedVideos, setSavedVideos] = React.useState<PexelsVideo[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);

  // Load from localStorage when user changes
  React.useEffect(() => {
    if (user) {
      const localKey = `houseart_saved_${user.email}`;
      const videoKey = `houseart_saved_videos_${user.email}`;
      
      const local = localStorage.getItem(localKey);
      const videosLocal = localStorage.getItem(videoKey);

      if (local) {
        try { setSavedInspirations(JSON.parse(local)); } catch (e) { setSavedInspirations([]); }
      } else {
        setSavedInspirations([]);
      }

      if (videosLocal) {
        try { setSavedVideos(JSON.parse(videosLocal)); } catch (e) { setSavedVideos([]); }
      } else {
        setSavedVideos([]);
      }
    } else {
      setSavedInspirations([]);
      setSavedVideos([]);
    }
  }, [user]);

  const save = async (image: PexelsImage) => {
    if (!user) return;
    if (savedInspirations.some(img => img.id === image.id)) return;

    const updated = [image, ...savedInspirations];
    setSavedInspirations(updated);
    localStorage.setItem(`houseart_saved_${user.email}`, JSON.stringify(updated));
  };

  const remove = async (imageId: number) => {
    if (!user) return;
    const updated = savedInspirations.filter(img => img.id !== imageId);
    setSavedInspirations(updated);
    localStorage.setItem(`houseart_saved_${user.email}`, JSON.stringify(updated));
  };

  const saveVideo = async (video: PexelsVideo) => {
    if (!user) return;
    if (savedVideos.some(v => v.id === video.id)) return;

    const updated = [video, ...savedVideos];
    setSavedVideos(updated);
    localStorage.setItem(`houseart_saved_videos_${user.email}`, JSON.stringify(updated));
  };

  const removeVideo = async (videoId: number) => {
    if (!user) return;
    const updated = savedVideos.filter(v => v.id !== videoId);
    setSavedVideos(updated);
    localStorage.setItem(`houseart_saved_videos_${user.email}`, JSON.stringify(updated));
  };

  const savedIds = React.useMemo(() => new Set(savedInspirations.map(img => img.id)), [savedInspirations]);
  const savedVideoIds = React.useMemo(() => new Set(savedVideos.map(v => v.id)), [savedVideos]);

  return (
    <DesignContext.Provider value={{ 
      savedInspirations, 
      savedVideos, 
      savedIds, 
      savedVideoIds, 
      save, 
      remove, 
      saveVideo, 
      removeVideo, 
      isLoading 
    }}>
      {children}
    </DesignContext.Provider>
  );
}

export const useDesign = () => {
  const context = React.useContext(DesignContext);
  if (!context) throw new Error('useDesign must be used within a DesignProvider');
  return context;
};
