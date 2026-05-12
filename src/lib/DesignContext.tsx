import React from 'react';
import { PexelsImage } from '../services/pexelsService';
import { useAuth } from './AuthContext';

interface DesignContextType {
  savedInspirations: PexelsImage[];
  savedIds: Set<number>;
  save: (image: PexelsImage) => Promise<void>;
  remove: (imageId: number) => Promise<void>;
  isLoading: boolean;
}

const DesignContext = React.createContext<DesignContextType | null>(null);

export function DesignProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [savedInspirations, setSavedInspirations] = React.useState<PexelsImage[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);

  // Load from localStorage when user changes
  React.useEffect(() => {
    if (user) {
      const localKey = `houseart_saved_${user.email}`;
      const local = localStorage.getItem(localKey);
      if (local) {
        try {
          setSavedInspirations(JSON.parse(local));
        } catch (e) {
          console.error('Failed to parse local storage', e);
          setSavedInspirations([]);
        }
      } else {
        setSavedInspirations([]);
      }
    } else {
      setSavedInspirations([]);
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

  const savedIds = React.useMemo(() => new Set(savedInspirations.map(img => img.id)), [savedInspirations]);

  return (
    <DesignContext.Provider value={{ savedInspirations, savedIds, save, remove, isLoading }}>
      {children}
    </DesignContext.Provider>
  );
}

export const useDesign = () => {
  const context = React.useContext(DesignContext);
  if (!context) throw new Error('useDesign must be used within a DesignProvider');
  return context;
};
