import React from 'react';
import { useTranslation } from 'react-i18next';
import { MapPin, Search, Hammer, Ruler, HardHat, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProfessionalFinder() {
  const { t } = useTranslation();
  const [location, setLocation] = React.useState('');
  const [error, setError] = React.useState(false);
  const [selectedService, setSelectedService] = React.useState('Interior-Designers');

  const services = [
    { id: 'Interior-Designers', label: 'Designers', icon: Ruler },
    { id: 'Carpenters', label: 'Carpenters', icon: Hammer },
    { id: 'Civil-Contractors', label: 'Workers', icon: HardHat },
  ];

  const handleSearch = () => {
    if (!location.trim()) {
      setError(true);
      setTimeout(() => setError(false), 2000);
      return;
    }

    const formattedLocation = location.trim().replace(/\s+/g, '-');
    const url = `https://www.justdial.com/${formattedLocation}/${selectedService}`;
    window.open(url, '_blank');
  };

  return (
    <div className="w-full bg-white/5 border border-white/10 rounded-[32px] p-6 mb-12 backdrop-blur-xl relative overflow-hidden group">
      {/* Background Accent */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-orange-500/20 transition-all duration-500" />
      
      <div className="relative z-10 flex flex-col lg:flex-row items-center gap-8">
        <div className="flex-1 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-400/10 rounded-xl">
              <MapPin className="w-5 h-5 text-orange-400" />
            </div>
            <h3 className="text-xl font-black uppercase tracking-tight">Find Professionals Near You</h3>
          </div>
          <p className="text-xs text-white/40 font-medium max-w-md leading-relaxed uppercase tracking-wider">
            Connected with verified architects, carpenters and design experts in your direct vicinity.
          </p>
        </div>

        <div className="w-full lg:w-auto flex flex-col gap-4">
          <div className="flex flex-wrap gap-2">
            {services.map((service) => (
              <button
                key={service.id}
                onClick={() => setSelectedService(service.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                  selectedService === service.id
                    ? 'bg-orange-gradient text-black shadow-lg shadow-orange-500/10'
                    : 'bg-white/5 text-white/40 border border-white/5 hover:bg-white/10'
                }`}
              >
                <service.icon className="w-3 h-3" />
                {service.label}
              </button>
            ))}
          </div>

          <div className="relative flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                value={location}
                onChange={(e) => { setLocation(e.target.value); if(error) setError(false); }}
                placeholder="Enter city or area (e.g. Hyderabad)"
                className={`w-full sm:w-[300px] h-12 md:h-14 bg-black/40 border ${error ? 'border-red-500 ring-2 ring-red-500/20' : 'border-white/10 group-focus-within:border-orange-500/50'} rounded-2xl pl-12 pr-4 text-sm outline-none transition-all placeholder:text-white/20`}
              />
              <MapPin className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${error ? 'text-red-500' : 'text-white/20'}`} />
              
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute -top-10 left-0 bg-red-500 text-white text-[10px] font-black uppercase px-3 py-1 rounded-lg tracking-widest shadow-xl"
                  >
                    Please enter your city
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button
              onClick={handleSearch}
              className="px-8 h-12 md:h-14 bg-white text-black hover:bg-orange-400 font-bold rounded-2xl text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 group/btn active:scale-95"
            >
              Search
              <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
