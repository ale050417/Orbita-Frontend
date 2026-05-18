import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { LayoutCompras } from '@/modules/compras/layout/LayoutCompras';
import { ChevronLeft, Edit, TrendingUp, TrendingDown, Package, ShoppingCart, Eye, Star, BarChart2 } from 'lucide-react';

const fmt = (n: number) => new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(n);

/* ── mock data ── */
const PRODUCT = {
  id: '2', name: 'Shampoo Premium 400ml', sku: 'PRD-002', category: 'Cuidado',
  price: 3200, stock: 24, status: 'active',
  image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&q=80',
};

const PERIODS = ['7 días', '30 días', '90 días', 'Todo'];

const STATS_BY_PERIOD: Record<string, { revenue: number; units: number; views: number; conversion: number; trend: number }> = {
  '7 días':  { revenue: 44800, units: 14, views: 312, conversion: 4.5, trend: 12 },
  '30 días': { revenue: 179200, units: 56, views: 1240, conversion: 4.5, trend: 8  },
  '90 días': { revenue: 521600, units: 163, views: 3840, conversion: 4.2, trend: -3 },
  'Todo':    { revenue: 985600, units: 308, views: 8920, conversion: 3.5, trend: 18 },
};

const CHART_DATA = [4, 7, 5, 8, 6, 9, 14, 11, 8, 12, 10, 7, 9, 14];

const SALES_FEED = [
  { date: 'Hoy 14:22', qty: 2, total: 6400, customer: 'Martina C.' },
  { date: 'Hoy 11:05', qty: 1, total: 3200, customer: 'Lucas R.'   },
  { date: 'Ayer 18:30', qty: 3, total: 9600, customer: 'Sofía P.'  },
  { date: 'Ayer 09:15', qty: 1, total: 3200, customer: 'Diego F.'  },
  { date: '16/05 16:00', qty: 2, total: 6400, customer: 'Valeria M.'},
];

const CHART_MAX = Math.max(...CHART_DATA);

function StatCard({ icon, label, value, sub, positive }: { icon: React.ReactNode; label: string; value: string; sub?: string; positive?: boolean }) {
  return (
    <div className="bg-white dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-white/8 p-5">
      <div className="flex items-start justify-between mb-3">
        <div className="w-9 h-9 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">{icon}</div>
        {sub && (
          <span className={`flex items-center gap-0.5 text-xs font-bold ${positive ? 'text-emerald-500' : 'text-red-500'}`}>
            {positive ? <TrendingUp size={12}/> : <TrendingDown size={12}/>} {sub}
          </span>
        )}
      </div>
      <p className="text-2xl font-black text-slate-900 dark:text-white">{value}</p>
      <p className="text-xs text-slate-400 mt-0.5">{label}</p>
    </div>
  );
}

export default function ProductDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [period, setPeriod] = useState('30 días');
  const stats = STATS_BY_PERIOD[period];

  return (
    <LayoutCompras title="Estadísticas del producto">
      <div className="p-6 max-w-5xl mx-auto space-y-6">

        {/* header */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex items-center gap-2 text-sm">
            <Link href="/tienda/products" className="flex items-center gap-1 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
              <ChevronLeft size={16}/> Productos
            </Link>
            <span className="text-slate-300 dark:text-white/20">/</span>
            <span className="font-semibold text-slate-900 dark:text-white">{PRODUCT.name}</span>
          </div>
          <div className="sm:ml-auto flex items-center gap-2">
            <Link href={`/tienda/products/${id}/variants`}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/6 transition-colors">
              Variantes
            </Link>
            <Link href={`/tienda/products/${id}/edit`}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white transition-colors">
              <Edit size={14}/> Editar
            </Link>
          </div>
        </div>

        {/* product summary */}
        <div className="bg-white dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-white/8 p-5">
          <div className="flex items-center gap-4">
            <img src={PRODUCT.image} alt={PRODUCT.name} className="w-16 h-16 rounded-xl object-cover flex-shrink-0"/>
            <div className="flex-1 min-w-0">
              <h1 className="text-lg font-black text-slate-900 dark:text-white">{PRODUCT.name}</h1>
              <div className="flex flex-wrap items-center gap-3 mt-1">
                <span className="text-sm text-slate-400 font-mono">{PRODUCT.sku}</span>
                <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-100 dark:bg-white/6 text-slate-500 dark:text-slate-300">{PRODUCT.category}</span>
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20">Activo</span>
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-2xl font-black text-slate-900 dark:text-white">{fmt(PRODUCT.price)}</p>
              <p className="text-sm text-slate-400 mt-0.5">Stock: <span className={`font-bold ${PRODUCT.stock < 10 ? 'text-amber-500' : 'text-slate-900 dark:text-white'}`}>{PRODUCT.stock}</span></p>
            </div>
          </div>
        </div>

        {/* period selector */}
        <div className="flex items-center gap-2">
          <BarChart2 size={16} className="text-slate-400"/>
          <span className="text-sm font-semibold text-slate-500 dark:text-slate-400 mr-2">Período:</span>
          {PERIODS.map(p => (
            <button key={p} onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${period === p ? 'bg-blue-600 text-white' : 'bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-white/8 text-slate-600 dark:text-slate-300 hover:border-slate-300 dark:hover:border-white/15'}`}>
              {p}
            </button>
          ))}
        </div>

        {/* KPI grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={<ShoppingCart size={18}/>} label="Ingresos" value={fmt(stats.revenue)} sub={`${stats.trend > 0 ? '+' : ''}${stats.trend}%`} positive={stats.trend > 0}/>
          <StatCard icon={<Package size={18}/>} label="Unidades vendidas" value={stats.units.toString()} sub={`${stats.trend > 0 ? '+' : ''}${stats.trend}%`} positive={stats.trend > 0}/>
          <StatCard icon={<Eye size={18}/>} label="Vistas" value={stats.views.toLocaleString('es-AR')}/>
          <StatCard icon={<Star size={18}/>} label="Tasa de conversión" value={`${stats.conversion}%`}/>
        </div>

        {/* chart */}
        <div className="bg-white dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-white/8 p-5">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-sm font-black text-slate-900 dark:text-white">Ventas diarias (últimos 14 días)</h3>
          </div>
          <div className="flex items-end gap-1.5 h-32">
            {CHART_DATA.map((v, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full rounded-t-lg bg-blue-500 dark:bg-blue-500 opacity-80 hover:opacity-100 transition-opacity" style={{ height: `${(v / CHART_MAX) * 100}%` }}/>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-[10px] text-slate-400">
            <span>Hace 14 días</span><span>Hoy</span>
          </div>
        </div>

        {/* recent sales */}
        <div className="bg-white dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-white/8 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 dark:border-white/8">
            <h3 className="text-sm font-black text-slate-900 dark:text-white">Últimas ventas</h3>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-50 dark:border-white/4">
                <th className="px-5 py-2.5 text-left text-xs font-bold text-slate-400 uppercase">Fecha</th>
                <th className="px-5 py-2.5 text-left text-xs font-bold text-slate-400 uppercase hidden sm:table-cell">Cliente</th>
                <th className="px-5 py-2.5 text-center text-xs font-bold text-slate-400 uppercase">Unidades</th>
                <th className="px-5 py-2.5 text-right text-xs font-bold text-slate-400 uppercase">Total</th>
              </tr>
            </thead>
            <tbody>
              {SALES_FEED.map((s, i) => (
                <tr key={i} className="border-b border-slate-50 dark:border-white/4 last:border-0 hover:bg-slate-50 dark:hover:bg-white/3 transition-colors">
                  <td className="px-5 py-3 text-xs text-slate-400">{s.date}</td>
                  <td className="px-5 py-3 hidden sm:table-cell">
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">{s.customer}</span>
                  </td>
                  <td className="px-5 py-3 text-center">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">{s.qty}</span>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">{fmt(s.total)}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </LayoutCompras>
  );
}
