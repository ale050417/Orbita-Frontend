import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { OnboardingLayout } from '@/components/shared/Layout/OnboardingLayout';
import { Check, Copy, ExternalLink, ArrowRight, LayoutDashboard, Package } from 'lucide-react';

export default function TiendaSuccess() {
  const router = useRouter();
  const { slug = 'mi-negocio' } = router.query as { slug?: string };
  const publicUrl = `orbita.site/${slug}`;

  const [copied, setCopied] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => { setTimeout(() => setVisible(true), 50); }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(`https://${publicUrl}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <OnboardingLayout title="¡Tu espacio está listo!">
      <div className={`w-full max-w-lg transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>

        {/* success icon */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="relative mb-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-2xl shadow-blue-500/30">
              <Check size={42} strokeWidth={3} className="text-white"/>
            </div>
            <div className="absolute -inset-3 rounded-full border border-blue-500/20 animate-ping"/>
            <div className="absolute -inset-6 rounded-full border border-blue-500/10"/>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white mb-2">
            ¡Tu espacio está listo!
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-base max-w-sm">
            Ya podés compartir tu tienda, cargar productos y empezar a vender.
          </p>
        </div>

        {/* public link card */}
        <div className="bg-white dark:bg-slate-900/50 rounded-3xl border border-slate-200 dark:border-white/8 p-6 shadow-sm mb-5">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">Tu link público</p>
          <div className="flex items-center gap-2">
            <div className="flex-1 flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-white/8 min-w-0">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-blue-500 flex-shrink-0"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
              <span className="text-sm font-semibold text-slate-900 dark:text-white truncate">{publicUrl}</span>
            </div>
            <button type="button" onClick={handleCopy}
              className={`flex items-center gap-1.5 px-3 py-3 rounded-xl text-xs font-bold transition-all flex-shrink-0 ${copied ? 'bg-emerald-500 text-white' : 'bg-slate-100 dark:bg-white/8 text-slate-600 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-500/10 hover:text-blue-600 dark:hover:text-blue-400'}`}>
              {copied ? <Check size={14} strokeWidth={3}/> : <Copy size={14}/>}
              {copied ? 'Copiado' : 'Copiar'}
            </button>
            <a href={`https://${publicUrl}`} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-3 rounded-xl text-xs font-bold bg-slate-100 dark:bg-white/8 text-slate-600 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-500/10 hover:text-blue-600 dark:hover:text-blue-400 transition-all flex-shrink-0">
              <ExternalLink size={14}/>
            </a>
          </div>
        </div>

        {/* next steps */}
        <div className="bg-white dark:bg-slate-900/50 rounded-3xl border border-slate-200 dark:border-white/8 p-6 shadow-sm mb-6">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Próximos pasos sugeridos</p>
          <div className="space-y-3">
            {[
              { icon: <Package size={16}/>, label: 'Agregá más productos', desc: 'Completá tu catálogo', href: '/tienda/products/new', color: 'text-blue-500 bg-blue-500/10' },
              { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>, label: 'Personalizá tu tienda', desc: 'Colores, banner y descripción', href: '/admin/settings/tienda', color: 'text-purple-500 bg-purple-500/10' },
              { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>, label: 'Compartí tu link', desc: 'WhatsApp, Instagram y más', href: '#', color: 'text-emerald-500 bg-emerald-500/10' },
            ].map(s => (
              <Link key={s.label} href={s.href}
                className="flex items-center gap-3 p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-white/4 transition-colors group">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${s.color}`}>{s.icon}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-900 dark:text-white">{s.label}</p>
                  <p className="text-xs text-slate-400">{s.desc}</p>
                </div>
                <ArrowRight size={14} className="text-slate-300 dark:text-white/20 group-hover:text-blue-500 transition-colors flex-shrink-0"/>
              </Link>
            ))}
          </div>
        </div>

        {/* primary CTA */}
        <Link href="/admin"
          className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm transition-all shadow-lg shadow-blue-500/20 hover:-translate-y-0.5">
          <LayoutDashboard size={16}/>
          Ir a mi panel de control
          <ArrowRight size={16}/>
        </Link>
      </div>
    </OnboardingLayout>
  );
}
