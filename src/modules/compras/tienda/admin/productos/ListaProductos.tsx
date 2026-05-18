import { useState } from 'react';
import Link from 'next/link';
import { LayoutCompras } from '@/modules/compras/layout/LayoutCompras';
import { Search, Plus, LayoutGrid, List, Edit, Trash2, Eye, Upload, Tag, ChevronDown, Package } from 'lucide-react';

interface Product {
  id: string; name: string; sku: string; category: string; price: number;
  stock: number; status: 'active' | 'draft' | 'out_of_stock'; image: string;
  variants: number; sales: number;
}

const PRODUCTS: Product[] = [
  { id: '1', name: 'Corte de pelo clásico',  sku: 'SRV-001', category: 'Servicios',  price: 2500, stock: 99, status: 'active',       image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=80&q=70', variants: 0, sales: 143 },
  { id: '2', name: 'Shampoo Premium 400ml',  sku: 'PRD-002', category: 'Cuidado',    price: 3200, stock: 24, status: 'active',       image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=80&q=70', variants: 2, sales: 88  },
  { id: '3', name: 'Cera Modeladora',        sku: 'PRD-003', category: 'Cuidado',    price: 1800, stock: 0,  status: 'out_of_stock', image: 'https://images.unsplash.com/photo-1614975059251-992f11792b9f?w=80&q=70', variants: 3, sales: 55  },
  { id: '4', name: 'Corte + Barba',          sku: 'SRV-004', category: 'Servicios',  price: 3800, stock: 99, status: 'active',       image: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=80&q=70', variants: 0, sales: 201 },
  { id: '5', name: 'Gorra Snapback',         sku: 'ACC-005', category: 'Accesorios', price: 4500, stock: 12, status: 'active',       image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=80&q=70', variants: 4, sales: 32  },
  { id: '6', name: 'Pack Cuidado Básico',    sku: 'PKG-006', category: 'Packs',      price: 7900, stock: 8,  status: 'draft',        image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=80&q=70', variants: 0, sales: 0   },
];

const STATUS_LABEL: Record<Product['status'], { label: string; cls: string }> = {
  active:       { label: 'Activo',    cls: 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20' },
  draft:        { label: 'Borrador',  cls: 'bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/20' },
  out_of_stock: { label: 'Sin stock', cls: 'bg-red-100 dark:bg-red-500/10 text-red-700 dark:text-red-400 border-red-200 dark:border-red-500/20' },
};

const fmt = (n: number) => new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(n);

export default function ListaProductos() {
  const [view, setView] = useState<'grid' | 'list'>('list');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Todas');
  const [status, setStatus] = useState('Todos');
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const categories = ['Todas', ...Array.from(new Set(PRODUCTS.map(p => p.category)))];
  const statuses = ['Todos', 'Activo', 'Borrador', 'Sin stock'];

  const filtered = PRODUCTS.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === 'Todas' || p.category === category;
    const matchStatus = status === 'Todos' || STATUS_LABEL[p.status].label === status;
    return matchSearch && matchCat && matchStatus;
  });

  const toggleSelect = (id: string) => setSelected(s => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const toggleAll = () => setSelected(s => s.size === filtered.length ? new Set() : new Set(filtered.map(p => p.id)));

  return (
    <LayoutCompras title="Productos">
      <div className="p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div>
            <h1 className="text-xl font-black text-slate-900 dark:text-white">Productos</h1>
            <p className="text-sm text-slate-400 mt-0.5">{PRODUCTS.length} productos en total</p>
          </div>
          <div className="flex items-center gap-2 sm:ml-auto">
            <Link href="/tienda/products/import" className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/6 transition-colors">
              <Upload size={14}/> Importar
            </Link>
            <Link href="/tienda/categories" className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/6 transition-colors">
              <Tag size={14}/> Categorías
            </Link>
            <Link href="/tienda/products/new" className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white transition-colors shadow-sm shadow-blue-500/20">
              <Plus size={14}/> Nuevo producto
            </Link>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar por nombre o SKU…"
              className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/50 text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"/>
          </div>
          <div className="flex items-center gap-2">
            {[{label: 'Categoría', val: category, set: setCategory, opts: categories}, {label: 'Estado', val: status, set: setStatus, opts: statuses}].map(f => (
              <div key={f.label} className="relative">
                <select value={f.val} onChange={e => f.set(e.target.value)}
                  className="appearance-none pl-3 pr-8 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/50 text-slate-700 dark:text-slate-200 outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer">
                  {f.opts.map(o => <option key={o}>{o}</option>)}
                </select>
                <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"/>
              </div>
            ))}
            <div className="flex items-center gap-1 bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 rounded-xl p-1">
              {(['list', 'grid'] as const).map(v => (
                <button key={v} onClick={() => setView(v)} className={`p-1.5 rounded-lg transition-colors ${view === v ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}>
                  {v === 'list' ? <List size={14}/> : <LayoutGrid size={14}/>}
                </button>
              ))}
            </div>
          </div>
        </div>

        {selected.size > 0 && (
          <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20">
            <span className="text-xs font-bold text-blue-700 dark:text-blue-300">{selected.size} seleccionados</span>
            <div className="flex-1"/>
            <button className="text-xs font-semibold text-red-500 hover:text-red-600 flex items-center gap-1"><Trash2 size={12}/> Eliminar</button>
          </div>
        )}

        {view === 'list' && (
          <div className="bg-white dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-white/8 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 dark:border-white/8">
                  <th className="px-4 py-3 text-left w-10">
                    <input type="checkbox" checked={selected.size === filtered.length && filtered.length > 0} onChange={toggleAll} className="rounded border-slate-300 dark:border-white/20 accent-blue-600"/>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-400">Producto</th>
                  <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-400 hidden md:table-cell">SKU</th>
                  <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-400 hidden sm:table-cell">Categoría</th>
                  <th className="px-4 py-3 text-right text-xs font-bold uppercase tracking-wide text-slate-400">Precio</th>
                  <th className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wide text-slate-400 hidden md:table-cell">Stock</th>
                  <th className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wide text-slate-400">Estado</th>
                  <th className="px-4 py-3 w-10"/>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p, i) => (
                  <tr key={p.id} className={`border-b border-slate-50 dark:border-white/4 hover:bg-slate-50 dark:hover:bg-white/3 transition-colors ${i === filtered.length - 1 ? 'border-0' : ''}`}>
                    <td className="px-4 py-3">
                      <input type="checkbox" checked={selected.has(p.id)} onChange={() => toggleSelect(p.id)} className="rounded border-slate-300 dark:border-white/20 accent-blue-600"/>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img src={p.image} alt={p.name} className="w-10 h-10 rounded-xl object-cover flex-shrink-0 bg-slate-100"/>
                        <div>
                          <p className="font-semibold text-slate-900 dark:text-white leading-tight">{p.name}</p>
                          {p.variants > 0 && <p className="text-xs text-slate-400 mt-0.5">{p.variants} variantes</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell text-slate-400 font-mono text-xs">{p.sku}</td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-100 dark:bg-white/6 text-slate-500 dark:text-slate-300">{p.category}</span>
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-slate-900 dark:text-white">{fmt(p.price)}</td>
                    <td className="px-4 py-3 text-center hidden md:table-cell">
                      <span className={`font-semibold ${p.stock === 0 ? 'text-red-500' : p.stock < 10 ? 'text-amber-500' : 'text-slate-600 dark:text-slate-300'}`}>{p.stock === 99 ? '∞' : p.stock}</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold border ${STATUS_LABEL[p.status].cls}`}>{STATUS_LABEL[p.status].label}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 justify-end">
                        <Link href={`/tienda/products/${p.id}`} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-white/8 text-slate-400 hover:text-blue-600"><Eye size={14}/></Link>
                        <Link href={`/tienda/products/${p.id}/edit`} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-white/8 text-slate-400 hover:text-blue-600"><Edit size={14}/></Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="py-16 text-center text-slate-400">
                <Package size={40} className="mx-auto mb-3 opacity-30"/>
                <p className="text-sm font-semibold">Sin resultados</p>
              </div>
            )}
          </div>
        )}

        {view === 'grid' && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filtered.map(p => (
              <div key={p.id} className="bg-white dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-white/8 overflow-hidden hover:border-blue-300 dark:hover:border-blue-500/30 hover:-translate-y-0.5 transition-all group">
                <div className="relative">
                  <img src={p.image} alt={p.name} className="w-full aspect-square object-cover"/>
                  <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Link href={`/tienda/products/${p.id}/edit`} className="w-7 h-7 rounded-lg bg-white/90 dark:bg-slate-800/90 flex items-center justify-center shadow-sm hover:bg-blue-50 dark:hover:bg-blue-500/20 hover:text-blue-600 text-slate-500 transition-colors"><Edit size={12}/></Link>
                  </div>
                  <span className={`absolute bottom-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-bold border ${STATUS_LABEL[p.status].cls}`}>{STATUS_LABEL[p.status].label}</span>
                </div>
                <div className="p-3">
                  <p className="text-xs font-bold text-slate-900 dark:text-white leading-tight line-clamp-2">{p.name}</p>
                  <p className="text-xs font-black text-blue-600 dark:text-blue-400 mt-1">{fmt(p.price)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </LayoutCompras>
  );
}

