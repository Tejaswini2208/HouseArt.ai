import React from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth, LocalUser } from '../lib/AuthContext';

export default function LoginForm() {
  const { signIn } = useAuth();
  const [formData, setFormData] = React.useState<LocalUser>({
    username: '',
    email: '',
    phone: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.username && formData.email && formData.phone) {
      signIn(formData);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-bg-deep flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-orange-500/20 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-rose-500/20 blur-[120px] rounded-full animate-pulse" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-black/40 backdrop-blur-3xl border border-white/10 rounded-[48px] p-8 md:p-12 shadow-2xl relative z-10"
      >
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-orange-gradient rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-2xl shadow-orange-500/20">
            <Sparkles className="w-8 h-8 text-black" />
          </div>
          <h2 className="text-3xl font-black uppercase tracking-tighter italic mb-2">Welcome to HomeArt</h2>
          <p className="text-xs font-bold text-white/20 uppercase tracking-[0.3em]">Enter your details to begin</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-4">Username</label>
            <div className="relative group">
              <input 
                required
                type="text" 
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
                placeholder="Design Enthusiast"
                className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 outline-none text-sm focus:border-orange-500/50 transition-all font-medium"
              />
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-orange-400" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-4">Email Address</label>
            <div className="relative group">
              <input 
                required
                type="email" 
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="hello@designer.com"
                className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 outline-none text-sm focus:border-orange-500/50 transition-all font-medium"
              />
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-orange-400" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-4">Phone Number</label>
            <div className="relative group">
              <input 
                required
                type="tel" 
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                placeholder="+91 98765 43210"
                className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 outline-none text-sm focus:border-orange-500/50 transition-all font-medium"
              />
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-orange-400" />
            </div>
          </div>

          <button 
            type="submit"
            className="w-full h-16 bg-orange-gradient text-black font-black uppercase tracking-widest text-sm rounded-2xl flex items-center justify-center gap-3 shadow-2xl shadow-orange-500/20 hover:scale-[1.02] active:scale-95 transition-all mt-8"
          >
            Enter HomeArt
            <ArrowRight className="w-5 h-5" />
          </button>
        </form>

        <p className="text-[10px] text-center text-white/20 font-medium mt-10 uppercase tracking-widest leading-relaxed">
          The world's first AI-native interior inspiration engine.
        </p>
      </motion.div>
    </div>
  );
}
