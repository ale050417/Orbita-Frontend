import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const { isDark } = useTheme();

  useEffect(() => {
    const toggle = () => setIsVisible(window.scrollY > 500);
    window.addEventListener('scroll', toggle);
    return () => window.removeEventListener('scroll', toggle);
  }, []);

  return (
    <div className={`fixed bottom-6 right-6 z-50 transition-all duration-300 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'}`}>
      <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Volver arriba"
        className={`p-3 rounded-full shadow-xl transition-all duration-300 hover:scale-110 active:scale-95 group border ${
          isDark
            ? 'bg-slate-800/80 border-white/10 text-slate-300 hover:text-blue-400 hover:border-blue-500/50 hover:bg-slate-800 backdrop-blur-md hover:shadow-[0_0_20px_rgba(59,130,246,0.3)]'
            : 'bg-white/90 border-slate-200 text-slate-600 hover:text-blue-600 hover:border-blue-200 hover:bg-white backdrop-blur-md hover:shadow-[0_0_20px_rgba(59,130,246,0.2)]'
        }`}>
        <ArrowUp size={20} className="transition-transform duration-300 group-hover:-translate-y-1" />
      </button>
    </div>
  );
}
