import React from 'react';
import * as Icons from 'lucide-react';
import { CATEGORIES } from '../constants';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

interface CategoryBarProps {
  selectedCategory: string;
  onSelect: (id: string) => void;
}

export default function CategoryBar({ selectedCategory, onSelect }: CategoryBarProps) {
  const { i18n } = useTranslation();

  return (
    <div className="sticky top-[73px] z-40 bg-black/40 backdrop-blur-xl border-b border-white/5 overflow-hidden">
      <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-black/40 to-transparent z-10 pointer-events-none md:hidden" />
      <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-black/40 to-transparent z-10 pointer-events-none md:hidden" />
      <div className="overflow-x-auto no-scrollbar py-4 px-4 md:px-8">
        <div className="max-w-7xl mx-auto flex items-center gap-2">
        {CATEGORIES.map((cat) => {
          const IconComponent = (Icons as any)[cat.icon];
          const isSelected = selectedCategory === cat.id;
          
          return (
            <motion.button
              key={cat.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSelect(cat.id)}
              className={`flex items-center gap-2 px-5 py-2 rounded-full whitespace-nowrap text-xs font-bold transition-all border ${
                isSelected 
                  ? 'bg-orange-500 text-black border-orange-500 shadow-[0_0_20px_rgba(249,115,22,0.3)]' 
                  : 'bg-white/5 text-white/60 border-white/5 hover:bg-white/10 hover:text-white/80'
              }`}
            >
              {IconComponent && <IconComponent className={`w-3.5 h-3.5 ${isSelected ? 'text-black' : 'text-orange-400'}`} />}
              <span>{i18n.language === 'te' ? cat.labelTe : cat.labelEn}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  </div>
  );
}
