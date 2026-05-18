import { useRef, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/router';
import { OnboardingLayout } from '@/components/shared/Layout/OnboardingLayout';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';

const STEP = 276; // card width (256) + gap (20)

/* ─── Mock window wrapper ─── */
function Win({ children }: { children: ReactNode }) {
  return (
    <div className="w-full h-full bg-[#0c0f17] flex flex-col">
      <div className="flex items-center gap-1.5 px-3 py-2.5 border-b border-white/5 shrink-0">
        <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]"/>
        <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]"/>
        <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]"/>
      </div>
      <div className="flex-1 p-3 overflow-hidden">{children}</div>
    </div>
  );
}

/* ─── Preview mocks ─── */
function TiendaPreview() {
  return (
    <Win>
      <div className="flex items-center gap-1.5 mb-2.5">
        <div className="flex-1 h-6 rounded-lg bg-white/5 border border-white/8 px-2 flex items-center">
          <div className="w-12 h-1.5 bg-white/15 rounded"/>
        </div>
        <div className="w-6 h-6 rounded-lg bg-blue-500/20 border border-blue-500/20 flex items-center justify-center">
          <div className="w-2.5 h-2.5 rounded bg-blue-400/60"/>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-1.5">
        {[['Remera', '$4.200'], ['Gorra', '$3.500'], ['Buzo', '$8.900'], ['Pack', '$12.000']].map(([n, p]) => (
          <div key={n} className="bg-white/4 border border-white/7 rounded-xl overflow-hidden">
            <div className="aspect-square bg-blue-500/10 flex items-center justify-center">
              <div className="w-7 h-7 rounded-full bg-blue-500/25 flex items-center justify-center">
                <div className="w-3 h-3 rounded bg-blue-400/50"/>
              </div>
            </div>
            <div className="px-2 py-1.5">
              <p className="text-[9px] font-semibold text-white/75 truncate">{n}</p>
              <p className="text-[10px] font-black text-blue-400">{p}</p>
            </div>
          </div>
        ))}
      </div>
    </Win>
  );
}

function BarberiaPreview() {
  return (
    <Win>
      <div className="flex items-center justify-between mb-2.5">
        <p className="text-[8px] text-white/35 uppercase tracking-widest font-bold">Agenda · Hoy</p>
        <div className="px-2 py-0.5 rounded-full bg-purple-500/15 border border-purple-500/25 text-[8px] font-bold text-purple-400">3 turnos</div>
      </div>
      <div className="space-y-1.5">
        {[
          { t: '10:00', s: 'Corte + Barba', c: 'Carlos M.', done: true },
          { t: '11:30', s: 'Recorte Clásico', c: 'Juan P.', done: false },
          { t: '13:00', s: 'Afeitado Clásico', c: 'Luis R.', done: false },
        ].map(({ t, s, c, done }) => (
          <div key={t} className="flex items-center gap-2 bg-white/4 border border-white/7 rounded-xl px-2.5 py-2">
            <span className="text-[9px] font-black text-purple-400 w-9 shrink-0">{t}</span>
            <div className="flex-1 min-w-0">
              <p className="text-[9px] font-semibold text-white/80 truncate">{s}</p>
              <p className="text-[8px] text-white/30 truncate">{c}</p>
            </div>
            <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${done ? 'bg-emerald-400' : 'bg-purple-400/40'}`}/>
          </div>
        ))}
      </div>
    </Win>
  );
}

function RestaurantePreview() {
  return (
    <Win>
      <div className="flex gap-1.5 mb-2.5">
        {['Entradas', 'Platos', 'Postres'].map((c, i) => (
          <span key={c} className={`px-2.5 py-1 rounded-full text-[8px] font-bold border ${i === 1 ? 'bg-orange-500/20 text-orange-400 border-orange-500/30' : 'bg-white/5 text-white/25 border-white/8'}`}>{c}</span>
        ))}
      </div>
      <div className="space-y-1.5">
        {[['Milanesa napolitana', '$4.500'], ['Tira de asado', '$7.200'], ['Ensalada mixta', '$2.800']].map(([n, p]) => (
          <div key={n} className="flex items-center gap-2.5 bg-white/4 border border-white/7 rounded-xl px-2.5 py-2">
            <div className="w-8 h-8 rounded-lg bg-orange-500/15 shrink-0 flex items-center justify-center">
              <div className="w-3.5 h-3.5 rounded bg-orange-400/40"/>
            </div>
            <p className="flex-1 text-[9px] font-semibold text-white/80 truncate">{n}</p>
            <p className="text-[10px] font-black text-orange-400 shrink-0">{p}</p>
          </div>
        ))}
      </div>
    </Win>
  );
}

function EsteticaPreview() {
  return (
    <Win>
      <p className="text-[8px] text-white/35 uppercase tracking-widest font-bold mb-2.5">Servicios</p>
      <div className="grid grid-cols-2 gap-1.5">
        {[['Limpieza facial', '60 min'], ['Manicura', '45 min'], ['Masaje relax', '90 min'], ['Nail Art', '60 min']].map(([n, dur]) => (
          <div key={n} className="bg-white/4 border border-white/7 rounded-xl p-2">
            <div className="w-7 h-7 rounded-full bg-pink-500/20 flex items-center justify-center mb-2">
              <div className="w-3 h-3 rounded-full bg-pink-400/60"/>
            </div>
            <p className="text-[9px] font-semibold text-white/80 leading-tight">{n}</p>
            <p className="text-[8px] text-pink-400 mt-0.5">{dur}</p>
          </div>
        ))}
      </div>
    </Win>
  );
}

function PetShopPreview() {
  return (
    <Win>
      <div className="flex gap-1.5 mb-2.5">
        {['Perros', 'Gatos', 'Aves'].map((c, i) => (
          <span key={c} className={`px-2.5 py-1 rounded-full text-[8px] font-bold border ${i === 0 ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-white/5 text-white/25 border-white/8'}`}>{c}</span>
        ))}
      </div>
      <div className="space-y-1.5">
        {[['Alimento premium 3kg', '$6.800', '12 u.'], ['Correa reforzada', '$3.200', '8 u.'], ['Juguete masticable', '$1.500', '24 u.']].map(([n, p, stk]) => (
          <div key={n} className="flex items-center gap-2.5 bg-white/4 border border-white/7 rounded-xl px-2.5 py-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/15 shrink-0"/>
            <div className="flex-1 min-w-0">
              <p className="text-[9px] font-semibold text-white/80 truncate">{n}</p>
              <p className="text-[8px] text-white/25">{stk}</p>
            </div>
            <p className="text-[10px] font-black text-emerald-400 shrink-0">{p}</p>
          </div>
        ))}
      </div>
    </Win>
  );
}

function GimnasioPreview() {
  return (
    <Win>
      <div className="flex items-center justify-between mb-2.5">
        <p className="text-[8px] text-white/35 uppercase tracking-widest font-bold">Clases · Hoy</p>
        <div className="px-2 py-0.5 rounded-full bg-red-500/15 border border-red-500/25 text-[8px] font-bold text-red-400">Lunes</div>
      </div>
      <div className="space-y-1.5">
        {[{ t: '07:00', cls: 'Funcional', cap: 8, max: 12 }, { t: '09:00', cls: 'Spinning', cap: 12, max: 12 }, { t: '18:00', cls: 'Yoga Flow', cap: 5, max: 10 }].map(({ t, cls, cap, max }) => (
          <div key={t} className="bg-white/4 border border-white/7 rounded-xl px-2.5 py-2">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[9px] font-black text-red-400 w-9 shrink-0">{t}</span>
              <p className="flex-1 text-[9px] font-semibold text-white/80">{cls}</p>
              <span className="text-[8px] text-white/35">{cap}/{max}</span>
            </div>
            <div className="h-1 bg-white/8 rounded-full ml-11">
              <div className="h-full bg-red-500/60 rounded-full transition-all" style={{ width: `${(cap / max) * 100}%` }}/>
            </div>
          </div>
        ))}
      </div>
    </Win>
  );
}

function AutomotrizPreview() {
  return (
    <Win>
      <div className="flex items-center justify-between mb-2.5">
        <p className="text-[8px] text-white/35 uppercase tracking-widest font-bold">Órdenes activas</p>
        <span className="text-[8px] font-bold text-slate-400">3 hoy</span>
      </div>
      <div className="space-y-1.5">
        {[
          { car: 'Toyota Corolla', svc: 'Cambio de aceite', st: 'En proceso', cls: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
          { car: 'Ford Focus', svc: 'Revisión de frenos', st: 'Pendiente', cls: 'bg-white/8 text-white/35 border-white/10' },
          { car: 'VW Golf', svc: 'Service 10.000 km', st: 'Listo', cls: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
        ].map(({ car, svc, st, cls }) => (
          <div key={car} className="bg-white/4 border border-white/7 rounded-xl px-2.5 py-2">
            <div className="flex items-center justify-between mb-0.5">
              <p className="text-[9px] font-bold text-white/80">{car}</p>
              <span className={`text-[7px] font-bold px-1.5 py-0.5 rounded-full border ${cls}`}>{st}</span>
            </div>
            <p className="text-[8px] text-white/30">{svc}</p>
          </div>
        ))}
      </div>
    </Win>
  );
}

function OtroPreview() {
  return (
    <Win>
      <div className="grid grid-cols-2 gap-1.5 mb-2.5">
        {[['$84.200', 'Ingresos', 'text-indigo-400'], ['142', 'Clientes', 'text-purple-400']].map(([v, l, cls]) => (
          <div key={l} className="bg-white/4 border border-white/7 rounded-xl p-2.5">
            <p className={`text-sm font-black ${cls}`}>{v}</p>
            <p className="text-[8px] text-white/30 mt-0.5">{l}</p>
          </div>
        ))}
      </div>
      <div className="bg-white/4 border border-white/7 rounded-xl p-2.5">
        <div className="flex items-end gap-1 h-14 mb-2">
          {[35, 58, 42, 75, 50, 88, 65].map((h, i) => (
            <div key={i} className="flex-1 rounded-t-sm bg-indigo-500/40" style={{ height: `${h}%` }}/>
          ))}
        </div>
        <p className="text-[8px] text-white/30">Ventas — últimos 7 días</p>
      </div>
    </Win>
  );
}

/* ─── Data ─── */
type ColorKey = 'blue' | 'purple' | 'orange' | 'pink' | 'emerald' | 'red' | 'slate' | 'indigo';

const RUBROS = [
  { id: 'tienda',      label: 'Tienda Online',     desc: 'Vendé productos físicos o digitales sin comisiones',         color: 'blue'    as ColorKey, features: ['Catálogo con fotos', 'Pedidos online', 'Control de stock'],    Preview: TiendaPreview    },
  { id: 'barberia',    label: 'Barbería / Salón',   desc: 'Agenda de turnos y gestión de clientes fidelizados',         color: 'purple'  as ColorKey, features: ['Agenda online', 'Recordatorios automáticos', 'Historial'],     Preview: BarberiaPreview  },
  { id: 'restaurante', label: 'Restaurante',        desc: 'Menú digital, pedidos online y gestión de mesas',            color: 'orange'  as ColorKey, features: ['Menú QR', 'Pedidos a la mesa', 'Delivery propio'],            Preview: RestaurantePreview },
  { id: 'estetica',    label: 'Estética / Spa',     desc: 'Servicios de belleza, turnos y seguimiento de clientas',     color: 'pink'    as ColorKey, features: ['Reservas 24/7', 'Servicios y precios', 'Fichas de clientes'],  Preview: EsteticaPreview  },
  { id: 'petshop',     label: 'Pet Shop',           desc: 'Catálogo de productos y turnos para mascotas',               color: 'emerald' as ColorKey, features: ['Tienda online', 'Turnos de baño/peluquería', 'Stock'],         Preview: PetShopPreview   },
  { id: 'gimnasio',    label: 'Gimnasio / Estudio', desc: 'Clases, membresías y seguimiento de socios',                 color: 'red'     as ColorKey, features: ['Reserva de clases', 'Membresías', 'Control de asistencia'],   Preview: GimnasioPreview  },
  { id: 'automotriz',  label: 'Automotriz',         desc: 'Gestión de taller, órdenes de trabajo y seguimiento',        color: 'slate'   as ColorKey, features: ['Órdenes de trabajo', 'Historial por vehículo', 'Turnos'],      Preview: AutomotrizPreview },
  { id: 'otro',        label: 'Otro rubro',         desc: 'Personalizamos Órbita para adaptarse a tu negocio',          color: 'indigo'  as ColorKey, features: ['Dashboard personalizado', 'Clientes', 'Reportes'],            Preview: OtroPreview      },
];

const C: Record<ColorKey, { border: string; glow: string; chip: string; dot: string; btn: string }> = {
  blue:    { border: 'group-hover:border-blue-500/50',    glow: 'group-hover:shadow-blue-500/10',    chip: 'bg-blue-500/15 text-blue-400 border-blue-500/30',    dot: 'bg-blue-500',    btn: 'bg-blue-600 hover:bg-blue-500 shadow-blue-500/25'    },
  purple:  { border: 'group-hover:border-purple-500/50',  glow: 'group-hover:shadow-purple-500/10',  chip: 'bg-purple-500/15 text-purple-400 border-purple-500/30',  dot: 'bg-purple-500',  btn: 'bg-purple-600 hover:bg-purple-500 shadow-purple-500/25'  },
  orange:  { border: 'group-hover:border-orange-500/50',  glow: 'group-hover:shadow-orange-500/10',  chip: 'bg-orange-500/15 text-orange-400 border-orange-500/30',  dot: 'bg-orange-500',  btn: 'bg-orange-600 hover:bg-orange-500 shadow-orange-500/25'  },
  pink:    { border: 'group-hover:border-pink-500/50',    glow: 'group-hover:shadow-pink-500/10',    chip: 'bg-pink-500/15 text-pink-400 border-pink-500/30',    dot: 'bg-pink-500',    btn: 'bg-pink-600 hover:bg-pink-500 shadow-pink-500/25'    },
  emerald: { border: 'group-hover:border-emerald-500/50', glow: 'group-hover:shadow-emerald-500/10', chip: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30', dot: 'bg-emerald-500', btn: 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/25' },
  red:     { border: 'group-hover:border-red-500/50',     glow: 'group-hover:shadow-red-500/10',     chip: 'bg-red-500/15 text-red-400 border-red-500/30',     dot: 'bg-red-500',     btn: 'bg-red-600 hover:bg-red-500 shadow-red-500/25'     },
  slate:   { border: 'group-hover:border-slate-400/50',   glow: 'group-hover:shadow-slate-400/10',   chip: 'bg-slate-500/15 text-slate-400 border-slate-500/30',   dot: 'bg-slate-400',   btn: 'bg-slate-600 hover:bg-slate-500 shadow-slate-500/25'   },
  indigo:  { border: 'group-hover:border-indigo-500/50',  glow: 'group-hover:shadow-indigo-500/10',  chip: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30',  dot: 'bg-indigo-500',  btn: 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-500/25'  },
};

/* ─── Card ─── */
function RubroCard({ rubro, onSelect }: { rubro: typeof RUBROS[0]; onSelect: (id: string) => void }) {
  const c = C[rubro.color];
  return (
    <button
      onClick={() => onSelect(rubro.id)}
      className={`group snap-center flex-shrink-0 w-64 flex flex-col rounded-2xl border border-white/8 bg-slate-900/70 overflow-hidden text-left transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl ${c.border} ${c.glow} cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500`}
    >
      {/* preview */}
      <div className="relative h-52 overflow-hidden">
        <rubro.Preview />
        {/* chip over preview */}
        <div className={`absolute top-2.5 right-2.5 px-2.5 py-1 rounded-full text-[8px] font-bold border backdrop-blur-sm ${c.chip}`}>
          {rubro.label}
        </div>
      </div>

      {/* info */}
      <div className="flex flex-col flex-1 p-4 border-t border-white/6">
        <p className="text-sm font-black text-white leading-tight mb-1">{rubro.label}</p>
        <p className="text-[11px] text-slate-400 leading-snug mb-3">{rubro.desc}</p>

        {/* features */}
        <ul className="space-y-1.5 mb-4 flex-1">
          {rubro.features.map(f => (
            <li key={f} className="flex items-center gap-2 text-[11px] text-slate-300">
              <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${c.dot}`}/>
              {f}
            </li>
          ))}
        </ul>

        {/* cta */}
        <div className={`flex items-center justify-center gap-1.5 w-full py-2 rounded-xl text-[11px] font-bold text-white shadow-lg transition-all duration-200 opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 ${c.btn}`}>
          Elegir este rubro <ArrowRight size={12}/>
        </div>
      </div>
    </button>
  );
}

/* ─── Arrow button ─── */
function Arrow({ dir, onClick, disabled }: { dir: 'left' | 'right'; onClick: () => void; disabled: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="absolute top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 shadow-xl flex items-center justify-center transition-all duration-200 hover:scale-110 hover:shadow-2xl disabled:opacity-0 disabled:pointer-events-none"
      style={dir === 'left' ? { left: '-20px' } : { right: '-20px' }}
    >
      {dir === 'left'
        ? <ChevronLeft size={16} className="text-slate-600 dark:text-slate-300"/>
        : <ChevronRight size={16} className="text-slate-600 dark:text-slate-300"/>
      }
    </button>
  );
}

/* ─── Main ─── */
export default function SeleccionRubro() {
  const router = useRouter();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft]   = useState(false);
  const [canRight, setCanRight] = useState(true);

  const syncArrows = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 4);
    setCanRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  };

  useEffect(() => { syncArrows(); }, []);

  const scroll = (dir: 'left' | 'right') => {
    scrollRef.current?.scrollBy({ left: dir === 'right' ? STEP : -STEP, behavior: 'smooth' });
  };

  return (
    <OnboardingLayout title="Elegí tu rubro">
      <div className="w-full max-w-5xl">

        {/* header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-widest border bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/25 text-blue-600 dark:text-blue-400 mb-4">
            Paso 1 de 3
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white mb-3">
            ¿A qué se dedica tu negocio?
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-base max-w-md mx-auto">
            Personalizamos Órbita para que se adapte perfectamente a tu rubro.
          </p>
        </div>

        {/* carousel */}
        <div className="relative mx-6">
          <Arrow dir="left"  onClick={() => scroll('left')}  disabled={!canLeft}  />
          <Arrow dir="right" onClick={() => scroll('right')} disabled={!canRight} />

          {/* edge fades */}
          <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-slate-50 dark:from-slate-950 to-transparent z-10 pointer-events-none"/>
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-slate-50 dark:from-slate-950 to-transparent z-10 pointer-events-none"/>

          <div
            ref={scrollRef}
            onScroll={syncArrows}
            style={{ scrollbarWidth: 'none' }}
            className="flex gap-5 overflow-x-auto scroll-smooth snap-x snap-mandatory py-4 px-2"
          >
            {RUBROS.map(r => (
              <RubroCard
                key={r.id}
                rubro={r}
                onSelect={id => router.push(`/onboarding/setup?rubro=${id}`)}
              />
            ))}
          </div>
        </div>

        <p className="text-center text-xs text-slate-400 mt-4">
          Podés cambiar esto después en Configuración.
        </p>
      </div>
    </OnboardingLayout>
  );
}
