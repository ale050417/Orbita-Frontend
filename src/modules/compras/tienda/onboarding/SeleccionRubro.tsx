import { useRouter } from 'next/router';
import { OnboardingLayout } from '@/components/shared/Layout/OnboardingLayout';

const RUBROS = [
  { id: 'tienda',      label: 'Tienda Online',  desc: 'Vendé productos físicos o digitales',       icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>,        color: 'blue'   },
  { id: 'barberia',   label: 'Barbería / Salón', desc: 'Turnos, servicios y clientes fidelizados', icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M6 3a3 3 0 0 1 6 0v10"/><path d="m6 3 6 10"/><path d="M6 13a3 3 0 0 0 6 0"/><path d="m14 3 4 8"/><path d="m14 3-1.5 4"/><path d="M14 11a3 3 0 0 0 4 0"/></svg>,                                                  color: 'purple' },
  { id: 'restaurante',label: 'Restaurante',      desc: 'Mesas, pedidos online y menú digital',     icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21a1 1 0 0 0 1-1v-5.35c0-.457.316-.844.727-1.041C20.544 12.573 22 10.461 22 8a1 1 0 0 0-1-1h-8a1 1 0 0 0-1 1c0 2.461 1.456 4.573 3.273 5.609.41.197.727.584.727 1.041V20a1 1 0 0 0 1 1z"/><path d="M10.585 15H7a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1 1 1 0 0 0 0-2z"/><path d="M4 2v6"/><path d="M6 2v6"/><path d="M5 8v13"/></svg>,                                              color: 'orange' },
  { id: 'estetica',   label: 'Estética / Spa',   desc: 'Servicios de belleza y bienestar',         icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="M8 9.05v-.1"/><path d="M16 9.05v-.1"/><path d="M12 14a4 4 0 0 0 4-4"/><path d="M8 14a4 4 0 0 1 4-4"/></svg>,                                                                                                          color: 'pink'   },
  { id: 'petshop',    label: 'Pet Shop',          desc: 'Productos y turnos para mascotas',         icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M11.25 16.25h1.5L12 17z"/><path d="M16 14v.5"/><path d="M4.42 11.247A13.152 13.152 0 0 0 4 14.556C4 18.728 7.582 21 12 21s8-2.272 8-6.444c0-1.061-.162-2.2-.493-3.309m-9.243-6.177C10.785 4.533 11.382 4 12 4t1.215.533m-4.948.44C6.4 4.94 5 5.2 5 7c0 1.7 1.8 3.5 3.5 3.5h7c1.7 0 3.5-1.8 3.5-3.5 0-1.8-1.4-2.06-3.267-2.027"/></svg>,     color: 'emerald'},
  { id: 'gimnasio',   label: 'Gimnasio / Estudio',desc: 'Clases, membresías y seguimiento',        icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14.4 14.4 9.6 9.6"/><path d="M18.657 21.485a2 2 0 1 1-2.829-2.828l-1.767 1.768a2 2 0 1 1-2.829-2.829l6.364-6.364a2 2 0 1 1 2.829 2.829l-1.768 1.767a2 2 0 1 1 2.828 2.829z"/><path d="m2.686 16.849 2.829-2.829"/><path d="M3.929 12.293 7.757 8.464"/><path d="m14.5 9.5 2-2"/></svg>,                           color: 'red'    },
  { id: 'automotriz', label: 'Automotriz',        desc: 'Turnos de taller y seguimiento de autos', icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M19 17H5"/><path d="M19 9H5"/><path d="M3 17a2 2 0 1 0 4 0 2 2 0 0 0-4 0z"/><path d="M17 17a2 2 0 1 0 4 0 2 2 0 0 0-4 0z"/><path d="M3 9a2 2 0 1 0 4 0 2 2 0 0 0-4 0z"/><path d="M17 9a2 2 0 1 0 4 0 2 2 0 0 0-4 0z"/></svg>,                                     color: 'slate'  },
  { id: 'otro',       label: 'Otro rubro',        desc: 'Personalizado para tu negocio',           icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4"/><path d="M12 16h.01"/></svg>,                                                                                                                                                               color: 'slate'  },
] as const;

const COLOR_MAP: Record<string, { pill: string; card: string; icon: string }> = {
  blue:    { pill: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',    card: 'hover:border-blue-400/50 hover:bg-blue-500/5',   icon: 'text-blue-500'   },
  purple:  { pill: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20', card: 'hover:border-purple-400/50 hover:bg-purple-500/5', icon: 'text-purple-500' },
  orange:  { pill: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20', card: 'hover:border-orange-400/50 hover:bg-orange-500/5', icon: 'text-orange-500' },
  pink:    { pill: 'bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20',    card: 'hover:border-pink-400/50 hover:bg-pink-500/5',   icon: 'text-pink-500'   },
  emerald: { pill: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20', card: 'hover:border-emerald-400/50 hover:bg-emerald-500/5', icon: 'text-emerald-500'},
  red:     { pill: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20',        card: 'hover:border-red-400/50 hover:bg-red-500/5',     icon: 'text-red-500'    },
  slate:   { pill: 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20', card: 'hover:border-slate-400/50 hover:bg-slate-500/5', icon: 'text-slate-500'  },
};

export default function SeleccionRubro() {
  const router = useRouter();

  const handleSelect = (id: string) => {
    router.push(`/onboarding/tienda/setup?rubro=${id}`);
  };

  return (
    <OnboardingLayout title="Elegí tu rubro">
      <div className="w-full max-w-3xl">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-widest border bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/25 text-blue-600 dark:text-blue-400 mb-4">
            Paso 1 de 3
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white mb-3">
            ¿A qué se dedica tu negocio?
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-base max-w-md mx-auto">
            Vamos a personalizar Órbita para que se adapte perfectamente a tu rubro.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {RUBROS.map((r) => {
            const c = COLOR_MAP[r.color];
            return (
              <button
                key={r.id}
                onClick={() => handleSelect(r.id)}
                className={`group relative flex flex-col items-center gap-3 p-5 rounded-2xl border border-slate-200 dark:border-white/8 bg-white dark:bg-slate-900/40 text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/5 ${c.card} cursor-pointer`}
              >
                <div className={`w-14 h-14 rounded-2xl border flex items-center justify-center ${c.pill}`}>
                  <span className={c.icon}>{r.icon}</span>
                </div>
                <div className="text-center">
                  <p className="text-sm font-bold text-slate-900 dark:text-white leading-tight">{r.label}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">{r.desc}</p>
                </div>
                <div className="absolute top-3 right-3 w-4 h-4 rounded-full border-2 border-slate-200 dark:border-white/15 group-hover:border-blue-500 transition-colors" />
              </button>
            );
          })}
        </div>

        <p className="text-center text-xs text-slate-400 mt-6">
          Podés cambiar esto después en Configuración.
        </p>
      </div>
    </OnboardingLayout>
  );
}
