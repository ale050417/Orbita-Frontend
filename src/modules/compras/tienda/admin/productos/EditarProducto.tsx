import { useState, useRef, ChangeEvent } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { LayoutCompras } from '@/modules/compras/layout/LayoutCompras';
import { ChevronLeft, Upload, X, Plus, Check, Trash2, GripVertical, Clock } from 'lucide-react';

const inputCls = 'w-full px-3 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/40 text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all';

function Field({ label, children, required }: { label: string; children: React.ReactNode; required?: boolean }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-bold text-slate-600 dark:text-slate-300">
        {label}{required && <span className="text-blue-500 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}

function Card({ title, children, action }: { title: string; children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div className="bg-white dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-white/8 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-black text-slate-900 dark:text-white">{title}</h3>
        {action}
      </div>
      {children}
    </div>
  );
}

/* mock existing product data */
const MOCK = {
  name: 'Shampoo Premium 400ml', sku: 'PRD-002', description: 'Shampoo profesional para todo tipo de cabello. Fórmula con aceite de argán.', price: '3200', comparePrice: '4000', cost: '1500', category: 'Cuidado', status: 'active' as const,
  taxable: true, trackStock: true, stock: '24', lowStockAlert: '5',
  slug: 'shampoo-premium-400ml', metaTitle: '', metaDesc: '',
};

const MOCK_IMAGES = ['https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=200&q=70', 'https://images.unsplash.com/photo-1614975059251-992f11792b9f?w=200&q=70'];

const PRICE_HISTORY = [
  { date: '01/04/2025', price: 2800, note: 'Precio inicial' },
  { date: '15/04/2025', price: 3000, note: 'Actualización por inflación' },
  { date: '02/05/2025', price: 3200, note: 'Ajuste mensual' },
];

const CATEGORIES = ['Servicios', 'Cuidado', 'Accesorios', 'Packs', 'Otros'];

export default function EditProduct() {
  const router = useRouter();
  const { id } = router.query;
  const imgRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState(MOCK);
  const [images, setImages] = useState(MOCK_IMAGES);
  const [tags, setTags] = useState(['cabello', 'cuidado', 'premium']);
  const [tagInput, setTagInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const handleAddImage = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    files.forEach(f => {
      const reader = new FileReader();
      reader.onload = ev => setImages(imgs => [...imgs, ev.target?.result as string]);
      reader.readAsDataURL(f);
    });
  };

  const addTag = () => {
    const t = tagInput.trim();
    if (t && !tags.includes(t)) setTags(ts => [...ts, t]);
    setTagInput('');
  };

  const handleSave = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 800));
    router.push('/tienda/products');
  };

  return (
    <LayoutCompras title="Editar producto">
      <div className="p-6 max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 text-sm">
            <Link href="/tienda/products" className="flex items-center gap-1 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
              <ChevronLeft size={16}/> Productos
            </Link>
            <span className="text-slate-300 dark:text-white/20">/</span>
            <span className="font-semibold text-slate-900 dark:text-white truncate max-w-[180px]">{form.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <Link href={`/tienda/products/${id}/variants`}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/6 transition-colors">
              Gestionar variantes
            </Link>
            <button onClick={() => router.push(`/tienda/products/${id}`)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/6 transition-colors">
              Ver estadísticas
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-5">

            <Card title="Información básica">
              <div className="space-y-4">
                <Field label="Nombre del producto" required>
                  <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    className={inputCls}/>
                </Field>
                <Field label="Descripción">
                  <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                    rows={4} className={`${inputCls} resize-none`}/>
                </Field>
              </div>
            </Card>

            {/* drag & drop photo reorder */}
            <Card title="Imágenes" action={
              <button onClick={() => imgRef.current?.click()} className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
                <Plus size={12}/> Agregar
              </button>
            }>
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                {images.map((img, i) => (
                  <div key={i} className="relative aspect-square rounded-xl overflow-hidden group border border-slate-200 dark:border-white/10">
                    <img src={img} alt="" className="w-full h-full object-cover"/>
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100">
                      <button className="w-6 h-6 rounded-lg bg-white/90 flex items-center justify-center"><GripVertical size={12} className="text-slate-500"/></button>
                      <button onClick={() => setImages(imgs => imgs.filter((_, j) => j !== i))} className="w-6 h-6 rounded-lg bg-white/90 flex items-center justify-center"><X size={12} className="text-red-500"/></button>
                    </div>
                    {i === 0 && <span className="absolute bottom-1 left-1 text-[9px] font-bold bg-blue-600 text-white px-1.5 py-0.5 rounded">Principal</span>}
                  </div>
                ))}
                <button onClick={() => imgRef.current?.click()}
                  className="aspect-square rounded-xl border-2 border-dashed border-slate-200 dark:border-white/15 flex flex-col items-center justify-center gap-1 text-slate-400 hover:text-blue-500 hover:border-blue-400 transition-colors">
                  <Upload size={18}/><span className="text-[10px] font-semibold">Agregar</span>
                </button>
              </div>
              <input ref={imgRef} type="file" multiple accept="image/*" className="hidden" onChange={handleAddImage}/>
            </Card>

            {/* pricing + history */}
            <Card title="Precios" action={
              <button onClick={() => setShowHistory(h => !h)} className="flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                <Clock size={12}/> Historial
              </button>
            }>
              {showHistory && (
                <div className="mb-4 p-3 rounded-xl bg-slate-50 dark:bg-white/4 border border-slate-100 dark:border-white/8 space-y-2">
                  {PRICE_HISTORY.map((h, i) => (
                    <div key={i} className="flex items-center gap-3 text-xs">
                      <span className="text-slate-400 w-20 flex-shrink-0">{h.date}</span>
                      <span className="font-bold text-slate-900 dark:text-white">${h.price.toLocaleString('es-AR')}</span>
                      <span className="text-slate-400 truncate">{h.note}</span>
                    </div>
                  ))}
                </div>
              )}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <Field label="Precio (ARS)" required>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400 font-semibold">$</span>
                    <input value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} type="number" className={`${inputCls} pl-7`}/>
                  </div>
                </Field>
                <Field label="Precio anterior">
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400 font-semibold">$</span>
                    <input value={form.comparePrice} onChange={e => setForm(f => ({ ...f, comparePrice: e.target.value }))} type="number" className={`${inputCls} pl-7`}/>
                  </div>
                </Field>
                <Field label="Costo">
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400 font-semibold">$</span>
                    <input value={form.cost} onChange={e => setForm(f => ({ ...f, cost: e.target.value }))} type="number" className={`${inputCls} pl-7`}/>
                  </div>
                </Field>
              </div>
            </Card>

            <Card title="Inventario">
              <div className="grid grid-cols-2 gap-4">
                <Field label="SKU">
                  <input value={form.sku} onChange={e => setForm(f => ({ ...f, sku: e.target.value }))} className={inputCls}/>
                </Field>
                <label className="flex items-center gap-3 pt-6 cursor-pointer">
                  <input type="checkbox" checked={form.trackStock} onChange={e => setForm(f => ({ ...f, trackStock: e.target.checked }))} className="rounded accent-blue-600"/>
                  <span className="text-sm text-slate-600 dark:text-slate-300">Controlar stock</span>
                </label>
                {form.trackStock && <>
                  <Field label="Stock actual">
                    <input value={form.stock} onChange={e => setForm(f => ({ ...f, stock: e.target.value }))} type="number" min="0" className={inputCls}/>
                  </Field>
                  <Field label="Alerta de bajo stock">
                    <input value={form.lowStockAlert} onChange={e => setForm(f => ({ ...f, lowStockAlert: e.target.value }))} type="number" min="0" className={inputCls}/>
                  </Field>
                </>}
              </div>
            </Card>
          </div>

          <div className="space-y-5">
            <Card title="Estado">
              <div className="space-y-2">
                {(['active', 'draft'] as const).map(s => (
                  <label key={s} className="flex items-center gap-3 cursor-pointer">
                    <div onClick={() => setForm(f => ({ ...f, status: s }))}
                      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 cursor-pointer ${form.status === s ? 'border-blue-600 bg-blue-600' : 'border-slate-300 dark:border-white/20'}`}>
                      {form.status === s && <div className="w-1.5 h-1.5 rounded-full bg-white"/>}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">{s === 'active' ? 'Activo' : 'Borrador'}</p>
                      <p className="text-xs text-slate-400">{s === 'active' ? 'Visible en la tienda' : 'No visible aún'}</p>
                    </div>
                  </label>
                ))}
              </div>
            </Card>

            <Card title="Categoría">
              <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className={inputCls}>
                <option value="">Sin categoría</option>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </Card>

            <Card title="Etiquetas">
              <div className="flex flex-wrap gap-2 mb-3">
                {tags.map(t => (
                  <span key={t} className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-500/20">
                    {t}<button onClick={() => setTags(ts => ts.filter(x => x !== t))}><X size={10}/></button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  placeholder="Nueva etiqueta…" className={`${inputCls} flex-1`}/>
                <button onClick={addTag} className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-white/8 hover:bg-blue-50 dark:hover:bg-blue-500/10 text-slate-500 hover:text-blue-600 transition-colors"><Plus size={14}/></button>
              </div>
            </Card>

            <div className="space-y-2">
              <button onClick={handleSave} disabled={saving}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-sm transition-all shadow-lg shadow-blue-500/20">
                {saving ? <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg> : <><Check size={14}/> Guardar cambios</>}
              </button>
              <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-red-200 dark:border-red-500/20 text-red-500 font-semibold text-sm hover:bg-red-50 dark:hover:bg-red-500/5 transition-colors">
                <Trash2 size={14}/> Eliminar producto
              </button>
            </div>
          </div>
        </div>
      </div>
    </LayoutCompras>
  );
}
