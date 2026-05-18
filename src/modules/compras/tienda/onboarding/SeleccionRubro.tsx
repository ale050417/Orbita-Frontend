import { useRouter } from 'next/router';
import { OnboardingLayout } from '@/components/shared/Layout/OnboardingLayout';

/* Mini UI mock previews for each rubro */
function PreviewTienda() {
  return (
    <div className="w-full h-full bg-slate-900 p-3 flex flex-col gap-2">
      <div className="flex gap-1.5 mb-1">
        <div className="w-2 h-2 rounded-full bg-red-400/70"/>
        <div className="w-2 h-2 rounded-full bg-yellow-400/70"/>
        <div className="w-2 h-2 rounded-full bg-green-400/70"/>
      </div>
      <div className="grid grid-cols-2 gap-1.5 flex-1">
        {[['Remera', '$4.200'], ['Gorra', '$3.500'], ['Buzo', '$8.900'], ['Pack', '$12.000']].map(([n, p]) => (
          <div key={n} className="bg-slate-800 rounded-lg p-1.5 flex flex-col justify-between">
            <div className="w-full aspect-square bg-slate-700 rounded-md mb-1"/>
            <p className="text-[9px] font-semibold text-slate-200 leading-tight">{n}</p>
            <p className="text-[9px] font-bold text-blue-400">{p}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function PreviewBarberia() {
  return (
    <div className="w-full h-full bg-slate-900 p-3 flex flex-col gap-2">
      <div className="flex gap-1.5 mb-1">
        <div className="w-2 h-2 rounded-full bg-red-400/70"/>
        <div className="w-2 h-2 rounded-full bg-yellow-400/70"/>
        <div className="w-2 h-2 rounded-full bg-green-400/70"/>
      </div>
      <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Agenda — Hoy</div>
      <div className="flex flex-col gap-1.5 flex-1">
        {[['10:00', 'Corte + Barba', 'Carlos M.'], ['11:30', 'Recorte Clásico', 'Juan P.'], ['13:00', 'Afeitado', 'Luis R.']].map(([t, s, c]) => (
          <div key={t} className="flex items-center gap-2 bg-slate-800 rounded-lg px-2 py-1.5">
            <span className="text-[8px] font-bold text-blue-400 w-8 shrink-0">{t}</span>
            <div className="flex-1 min-w-0">
              <p className="text-[9px] font-semibold text-slate-200 truncate">{s}</p>
              <p className="text-[8px] text-slate-500 truncate">{c}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PreviewRestaurante() {
  return (
    <div className="w-full h-full bg-slate-900 p-3 flex flex-col gap-2">
      <div className="flex gap-1.5 mb-1">
        <div className="w-2 h-2 rounded-full bg-red-400/70"/>
        <div className="w-2 h-2 rounded-full bg-yellow-400/70"/>
        <div className="w-2 h-2 rounded-full bg-green-400/70"/>
      </div>
      <div className="flex gap-1.5 mb-1">
        {['Entradas', 'Principales', 'Postres'].map((c, i) => (
          <span key={c} className={`text-[8px] font-bold px-1.5 py-0.5 rounded-full ${i === 1 ? 'bg-orange-500/20 text-orange-400' : 'text-slate-500'}`}>{c}</span>
        ))}
      </div>
      <div className="flex flex-col gap-1.5 flex-1">
        {[['Milanesa napolitana', '$4.500'], ['Tira de asado', '$7.200'], ['Ensalada mixta', '$2.800']].map(([n, p]) => (
          <div key={n} className="flex items-center justify-between bg-slate-800 rounded-lg px-2 py-1.5">
            <div className="flex items-center gap-1.5">
              <div className="w-5 h-5 rounded bg-slate-700"/>
              <p className="text-[9px] font-semibold text-slate-200">{n}</p>
            </div>
            <p className="text-[9px] font-bold text-orange-400">{p}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function PreviewEstetica() {
  return (
    <div className="w-full h-full bg-slate-900 p-3 flex flex-col gap-2">
      <div className="flex gap-1.5 mb-1">
        <div className="w-2 h-2 rounded-full bg-red-400/70"/>
        <div className="w-2 h-2 rounded-full bg-yellow-400/70"/>
        <div className="w-2 h-2 rounded-full bg-green-400/70"/>
      </div>
      <div className="grid grid-cols-2 gap-1.5 flex-1">
        {['Limpieza facial', 'Manicura', 'Masaje', 'Nail Art'].map((n) => (
          <div key={n} className="bg-slate-800 rounded-lg p-2 flex flex-col gap-1">
            <div className="w-6 h-6 rounded-full bg-pink-500/20 flex items-center justify-center">
              <div className="w-2.5 h-2.5 rounded-full bg-pink-400/60"/>
            </div>
            <p className="text-[9px] font-semibold text-slate-200 leading-tight">{n}</p>
            <div className="h-1 w-8 rounded-full bg-pink-500/30"/>
          </div>
        ))}
      </div>
    </div>
  );
}

function PreviewPetShop() {
  return (
    <div className="w-full h-full bg-slate-900 p-3 flex flex-col gap-2">
      <div className="flex gap-1.5 mb-1">
        <div className="w-2 h-2 rounded-full bg-red-400/70"/>
        <div className="w-2 h-2 rounded-full bg-yellow-400/70"/>
        <div className="w-2 h-2 rounded-full bg-green-400/70"/>
      </div>
      <div className="flex gap-1.5 mb-1">
        {['Perros', 'Gatos', 'Acuario'].map((c, i) => (
          <span key={c} className={`text-[8px] font-bold px-1.5 py-0.5 rounded-full ${i === 0 ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-500'}`}>{c}</span>
        ))}
      </div>
      <div className="flex flex-col gap-1.5 flex-1">
        {[['Alimento premium 3kg', '$6.800'], ['Correa reforzada', '$3.200'], ['Juguete masticable', '$1.500']].map(([n, p]) => (
          <div key={n} className="flex items-center justify-between bg-slate-800 rounded-lg px-2 py-1.5">
            <div className="flex items-center gap-1.5">
              <div className="w-5 h-5 rounded bg-emerald-500/20"/>
              <p className="text-[9px] font-semibold text-slate-200">{n}</p>
            </div>
            <p className="text-[9px] font-bold text-emerald-400">{p}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function PreviewGimnasio() {
  return (
    <div className="w-full h-full bg-slate-900 p-3 flex flex-col gap-2">
      <div className="flex gap-1.5 mb-1">
        <div className="w-2 h-2 rounded-full bg-red-400/70"/>
        <div className="w-2 h-2 rounded-full bg-yellow-400/70"/>
        <div className="w-2 h-2 rounded-full bg-green-400/70"/>
      </div>
      <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Clases de hoy</div>
      <div className="flex flex-col gap-1.5 flex-1">
        {[['07:00', 'Funcional', '8/12'], ['09:00', 'Spinning', '12/12'], ['18:00', 'Yoga', '5/10']].map(([t, cls, cap]) => (
          <div key={t} className="flex items-center gap-2 bg-slate-800 rounded-lg px-2 py-1.5">
            <span className="text-[8px] font-bold text-red-400 w-8 shrink-0">{t}</span>
            <p className="text-[9px] font-semibold text-slate-200 flex-1">{cls}</p>
            <span className="text-[8px] text-slate-500">{cap}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function PreviewAutomotriz() {
  return (
    <div className="w-full h-full bg-slate-900 p-3 flex flex-col gap-2">
      <div className="flex gap-1.5 mb-1">
        <div className="w-2 h-2 rounded-full bg-red-400/70"/>
        <div className="w-2 h-2 rounded-full bg-yellow-400/70"/>
        <div className="w-2 h-2 rounded-full bg-green-400/70"/>
      </div>
      <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Órdenes activas</div>
      <div className="flex flex-col gap-1.5 flex-1">
        {[['Toyota Corolla', 'Cambio aceite', 'En proceso'], ['Ford Focus', 'Frenos', 'Pendiente'], ['VW Golf', 'Service', 'Listo']].map(([car, svc, st]) => (
          <div key={car} className="bg-slate-800 rounded-lg px-2 py-1.5">
            <div className="flex items-center justify-between">
              <p className="text-[9px] font-bold text-slate-200">{car}</p>
              <span className={`text-[7px] font-bold px-1.5 py-0.5 rounded-full ${st === 'Listo' ? 'bg-emerald-500/20 text-emerald-400' : st === 'En proceso' ? 'bg-blue-500/20 text-blue-400' : 'bg-slate-700 text-slate-400'}`}>{st}</span>
            </div>
            <p className="text-[8px] text-slate-500">{svc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function PreviewOtro() {
  return (
    <div className="w-full h-full bg-slate-900 p-3 flex flex-col gap-2">
      <div className="flex gap-1.5 mb-1">
        <div className="w-2 h-2 rounded-full bg-red-400/70"/>
        <div className="w-2 h-2 rounded-full bg-yellow-400/70"/>
        <div className="w-2 h-2 rounded-full bg-green-400/70"/>
      </div>
      <div className="grid grid-cols-2 gap-1.5 mb-1">
        {[['$84.200', 'Ingresos', 'blue'], ['142', 'Clientes', 'purple']].map(([v, l, c]) => (
          <div key={l} className="bg-slate-800 rounded-lg p-2">
            <p className={`text-[11px] font-black ${c === 'blue' ? 'text-blue-400' : 'text-purple-400'}`}>{v}</p>
            <p className="text-[8px] text-slate-500">{l}</p>
          </div>
        ))}
      </div>
      <div className="flex-1 bg-slate-800 rounded-lg p-2 flex flex-col justify-end gap-1">
        <div className="flex items-end gap-1 h-10">
          {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
            <div key={i} className="flex-1 bg-slate-600 rounded-sm" style={{ height: `${h}%` }}/>
          ))}
        </div>
        <p className="text-[8px] text-slate-500">Ventas últimos 7 días</p>
      </div>
    </div>
  );
}

const RUBROS = [
  { id: 'tienda',       label: 'Tienda Online',    desc: 'Vendé productos',          color: 'blue',    Preview: PreviewTienda      },
  { id: 'barberia',     label: 'Barbería / Salón',  desc: 'Turnos y servicios',       color: 'purple',  Preview: PreviewBarberia    },
  { id: 'restaurante',  label: 'Restaurante',       desc: 'Menú y pedidos online',    color: 'orange',  Preview: PreviewRestaurante },
  { id: 'estetica',     label: 'Estética / Spa',    desc: 'Belleza y bienestar',      color: 'pink',    Preview: PreviewEstetica    },
  { id: 'petshop',      label: 'Pet Shop',          desc: 'Mascotas y productos',     color: 'emerald', Preview: PreviewPetShop     },
  { id: 'gimnasio',     label: 'Gimnasio / Estudio',desc: 'Clases y membresías',      color: 'red',     Preview: PreviewGimnasio   },
  { id: 'automotriz',   label: 'Automotriz',        desc: 'Taller y seguimiento',     color: 'slate',   Preview: PreviewAutomotriz  },
  { id: 'otro',         label: 'Otro rubro',        desc: 'Personalizado para vos',   color: 'slate',   Preview: PreviewOtro        },
];

const ACCENT: Record<string, string> = {
  blue:    'group-hover:border-blue-500/60 group-hover:shadow-blue-500/10',
  purple:  'group-hover:border-purple-500/60 group-hover:shadow-purple-500/10',
  orange:  'group-hover:border-orange-500/60 group-hover:shadow-orange-500/10',
  pink:    'group-hover:border-pink-500/60 group-hover:shadow-pink-500/10',
  emerald: 'group-hover:border-emerald-500/60 group-hover:shadow-emerald-500/10',
  red:     'group-hover:border-red-500/60 group-hover:shadow-red-500/10',
  slate:   'group-hover:border-slate-400/60 group-hover:shadow-slate-500/10',
};

const CHIP: Record<string, string> = {
  blue:    'bg-blue-500/15 text-blue-400 border-blue-500/25',
  purple:  'bg-purple-500/15 text-purple-400 border-purple-500/25',
  orange:  'bg-orange-500/15 text-orange-400 border-orange-500/25',
  pink:    'bg-pink-500/15 text-pink-400 border-pink-500/25',
  emerald: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25',
  red:     'bg-red-500/15 text-red-400 border-red-500/25',
  slate:   'bg-slate-500/15 text-slate-400 border-slate-500/25',
};

export default function SeleccionRubro() {
  const router = useRouter();

  return (
    <OnboardingLayout title="Elegí tu rubro">
      <div className="w-full max-w-4xl">
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

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {RUBROS.map((r) => (
            <button
              key={r.id}
              onClick={() => router.push(`/onboarding/setup?rubro=${r.id}`)}
              className={`group relative flex flex-col rounded-2xl border border-white/8 bg-slate-900/60 overflow-hidden text-left transition-all duration-200 hover:-translate-y-1 hover:shadow-xl ${ACCENT[r.color]} cursor-pointer`}
            >
              {/* preview area */}
              <div className="relative w-full aspect-[4/3] overflow-hidden">
                <r.Preview />
                {/* rubro chip over preview */}
                <span className={`absolute top-2 left-2 text-[9px] font-bold px-2 py-0.5 rounded-full border ${CHIP[r.color]}`}>
                  {r.label}
                </span>
              </div>

              {/* footer */}
              <div className="px-3 py-2.5 border-t border-white/6">
                <p className="text-xs font-bold text-white leading-tight">{r.label}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">{r.desc}</p>
              </div>

              {/* selection indicator */}
              <div className="absolute top-2 right-2 w-3.5 h-3.5 rounded-full border-2 border-white/20 group-hover:border-white/60 transition-colors" />
            </button>
          ))}
        </div>

        <p className="text-center text-xs text-slate-400 mt-6">
          Podés cambiar esto después en Configuración.
        </p>
      </div>
    </OnboardingLayout>
  );
}
