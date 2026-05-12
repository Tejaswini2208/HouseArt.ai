import React from 'react';
import { Sparkles, X, Send, Bot, User, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import Markdown from 'react-markdown';
import { ai, MODELS } from '../lib/gemini';

export default function FloatingChatbot() {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = React.useState(false);
  const [messages, setMessages] = React.useState<{ role: 'ai' | 'user'; text: string }[]>([
    { role: 'ai', text: t('chatbot_welcome') }
  ]);
  const [input, setInput] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      const response = await ai.models.generateContent({
        model: MODELS.flash,
        contents: [
          { role: 'user', parts: [{ text: userMessage }] }
        ],
        config: {
          systemInstruction: `You are a Senior Interior Architect at HomeArt AI. You are a helpful and professional consultant specializing in Indian Traditional and Modern Indo-Ethnic styles. 
          Respond in clean text or standard Markdown format. 
          STRICT: Do NOT output raw escape sequences like \\n, \\t, or \\". 
          Use your web access to retrieve real-time information regarding interior design trends, local store availability, and current pricing. 
          Cite specific design brands (like FabIndia, Pepperfry, Jaypore) or local Indian decor markets (e.g., Banjara Market in Gurgaon, Crawford Market in Mumbai, or Charminar markets) when providing advice.
          The user is interacting in ${i18n.language === 'te' ? 'Telugu' : 'English'}. 
          Respond in the same language as the user.`,
          tools: [{ googleSearch: {} }]
        }
      });

      let cleanText = response.text || "Sorry, I couldn't process that.";
      // Cleanup any escaped characters that might have leaked
      cleanText = cleanText.replace(/\\n/g, '\n')
                          .replace(/\\"/g, '"')
                          .replace(/\\\//g, '/')
                          .replace(/\\'/g, "'");

      setMessages(prev => [...prev, { role: 'ai', text: cleanText }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'ai', text: 'An error occurred. Please try again.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-28 md:bottom-10 right-6 md:right-10 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="absolute bottom-24 right-0 w-[90vw] md:w-96 h-[550px] bg-bg-deep rounded-[40px] shadow-2xl border border-white/10 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-white/5 border-b border-white/5 p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-orange-gradient rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/20">
                  <Bot className="w-6 h-6 text-black" />
                </div>
                <div>
                  <h3 className="font-black text-sm uppercase tracking-tight">HomeArt AI</h3>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-pulse" />
                    <p className="text-[10px] text-orange-400 font-black uppercase tracking-widest">Senior Architect</p>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors border border-white/10"
              >
                <X className="w-5 h-5 text-white/40" />
              </button>
            </div>

            {/* Messages */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar"
            >
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`relative max-w-[85%] p-4 rounded-3xl text-sm leading-relaxed shadow-xl ${
                    msg.role === 'user' 
                      ? 'bg-orange-gradient text-slate-900 rounded-tr-none' 
                      : 'bg-white text-slate-900 rounded-tl-none border border-orange-200 font-medium'
                  }`}>
                    <div className="font-medium prose prose-sm max-w-none prose-p:my-0 prose-slate">
                      <Markdown>{msg.text}</Markdown>
                    </div>
                    {msg.role === 'ai' && (
                      <div className="absolute -top-2 -left-0 w-4 h-4 bg-white rotate-45 border-l border-t border-orange-200" />
                    )}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white p-4 rounded-3xl rounded-tl-none border border-orange-200 shadow-xl">
                    <Loader2 className="w-4 h-4 animate-spin text-orange-500" />
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className="p-6 bg-white/5 border-t border-white/10 flex gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask your AI designer..."
                className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-sm focus:bg-white/10 outline-none transition-all placeholder-white/40"
              />
              <button 
                type="submit"
                disabled={isLoading}
                className="p-3 bg-orange-gradient text-black rounded-2xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50 shadow-lg shadow-orange-500/20"
              >
                <Send className="w-6 h-6" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col items-end gap-6">
        <div className="flex items-center gap-4 relative group">
          {/* Tooltip */}
          <div className="absolute right-full mr-4 px-3 py-1.5 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-xl">
            Ask your AI Designer
            <div className="absolute top-1/2 -translate-y-1/2 -right-1 w-2 h-2 bg-white rotate-45" />
          </div>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            animate={{ 
              boxShadow: ["0 0 20px rgba(249,115,22,0.3)", "0 0 40px rgba(249,115,22,0.5)", "0 0 20px rgba(249,115,22,0.3)"]
            }}
            transition={{ 
              boxShadow: { duration: 2, repeat: Infinity, ease: "easeInOut" }
            }}
            onClick={() => setIsOpen(!isOpen)}
            className={`w-16 h-16 bg-gradient-to-tr from-orange-400 to-rose-400 text-black rounded-full flex items-center justify-center shadow-2xl transition-all ${
              isOpen ? 'rotate-90' : ''
            }`}
          >
            <AnimatePresence mode="wait">
              {isOpen ? (
                <motion.div
                  key="close"
                  initial={{ opacity: 0, rotate: -90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: 90 }}
                >
                  <X className="w-8 h-8" />
                </motion.div>
              ) : (
                <motion.div
                  key="open"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                >
                  <Sparkles className="w-8 h-8" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>
    </div>
  );
}
