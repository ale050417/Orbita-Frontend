import { useState, useRef, ChangeEvent } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import \{ LayoutCompras \} from '@/modules/compras/layout/LayoutCompras';
import { ChevronLeft, Upload, X, Plus, Check, Info } from 'lucide-react';

/* â”€â”€ shared field/input helpers â”€â”€ */
const inputCls = 'w-full px-3 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/40 text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all';

function Field({ label, children, hint, required }: { label: string; children: React.ReactNode; hint?: string; required?: boolean }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-bold text-slate-600 dark:text-slate-300 flex items-center gap-1">
        {label}{required && <span className="text-blue-500">*</span>}
        {hint && <span className="font-normal text-slate-400 ml-1 flex items-center gap-0.5"><Info size={10}/>{hint}</span>}
      </label>
      {children}
    </div>
  );
}

const CATEGORIES = ['Servicios', 'Cuidado', 'Accesorios', 'Packs', 'Otros'];

export default function NewProduct() {
  const router = useRouter();
  const imgRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    name: '', sku: '', description: '', price: '', comparePrice: '',
    cost: '', category: '', status: 'active' as 'active' | 'draft',
    taxable: true, trackStock: false, stock: '', lowStockAlert: '',
    slug: '', metaTitle: '', metaDesc: '',
  });

  const [images, setImages] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [saving, setSaving] = useState(false);

  const handleImages = (e: ChangeEvent<HTMLInputElement>) => {
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

  const handleSave = async (asDraft = false) => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 800));
    router.push('/tienda/products');
  };

  const toSlug = (v: string) => v.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

  return (
    <LayoutCompras title="Nuevo producto">
      <div className="p-6 max-w-5xl mx-auto">
        {/* breadcrumb */}
        <div className="flex items-center gap-2 mb-6 text-sm">
          <Link href="/tienda/products" className="flex items-center gap-1 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
            <ChevronLeft size={16}/> Productos
          </Link>
          <span className="text-slate-300 dark:text-white/20">/</span>
          <span className="font-semibold text-slate-900 dark:text-white">Nuevo producto</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* main column */}
          <div className="lg:col-span-2 space-y-5">

            {/* basic info */}
            <Card title="InformaciÃ³n bÃ¡sica">
              <div className="space-y-4">
                <Field label="Nombre del producto" required>
                  <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value, slug: toSlug(e.target.value) }))}
                    placeholder="Ej: Corte de pelo clÃ¡sico" className={inputCls}/>
                </Field>
                <Field label="DescripciÃ³n">
                  <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                    rows={4} placeholder="DescripciÃ³n del productoâ€¦" className={`${inputCls} resize-none`}/>
                </Field>
              </div>
            </Card>

            {/* images */}
            <Card title="ImÃ¡genes">
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                {images.map((img, i) => (
                  <div key={i} className="relative aspect-square rounded-xl overflow-hidden group">
                    <img src={img} alt="" className="w-full h-full object-cover"/>
                    <button onClick={() => setImages(imgs => imgs.filter((_, j) => j !== i))}
                      className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <X size={10} className="text-white"/>
                    </button>
                    {i === 0 && <span className="absolute bottom-1 left-1 text-[9px] font-bold bg-blue-600 text-white px-1.5 py-0.5 rounded">Principal</span>}
                  </div>
                ))}
                <button onClick={() => imgRef.current?.click()}
                  className="aspect-square rounded-xl border-2 border-dashed border-slate-200 dark:border-white/15 flex flex-col items-center justify-center gap-1 text-slate-400 hover:text-blue-500 hover:border-blue-400 transition-colors">
                  <Upload size={18}/><span className="text-[10px] font-semibold">Agregar</span>
                </button>
                <input ref={imgRef} type="file" multiple accept="image/*" className="hidden" onChange={handleImages}/>
              </div>
              <p className="text-xs text-slate-400 mt-3">La primera imagen es la principal. ArrastrÃ¡ para reordenar.</p>
            </Card>

            {/* pricing */}
            <Card title="Precios">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <Field label="Precio (ARS)" required>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400 font-semibold">$</span>
                    <input value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                      type="number" min="0" placeholder="0" className={`${inputCls} pl-7`}/>
                  </div>
                </Field>
                <Field label="Precio tachado" hint="precio anterior">
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400 font-semibold">$</span>
                    <input value={form.comparePrice} onChange={e => setForm(f => ({ ...f, comparePrice: e.target.value }))}
                      type="number" min="0" placeholder="0" className={`${inputCls} pl-7`}/>
                  </div>
                </Field>
                <Field label="Costo" hint="no se muestra">
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400 font-semibold">$</span>
                    <input value={form.cost} onChange={e => setForm(f => ({ ...f, cost: e.target.value }))}
                      type="number" min="0" placeholder="0" className={`${inputCls} pl-7`}/>
                  </div>
                </Field>
              </div>
              <label className="flex items-center gap-2 mt-4 cursor-pointer">
                <input type="checkbox" checked={form.taxable} onChange={e => setForm(f => ({ ...f, taxable: e.target.checked }))}
                  className="rounded accent-blue-600"/>
                <span className="text-sm text-slate-600 dark:text-slate-300">Aplicar IVA / impuestos</span>
              </label>
            </Card>

            {/* inventory */}
            <Card title="Inventario">
              <div className="grid grid-cols-2 gap-4">
                <Field label="SKU">
                  <input value={form.sku} onChange={e => setForm(f => ({ ...f, sku: e.target.value }))}
                    placeholder="Ej: PRD-001" className={inputCls}/>
                </Field>
                <label className="flex items-center gap-3 pt-6 cursor-pointer">
                  <input type="checkbox" checked={form.trackStock} onChange={e => setForm(f => ({ ...f, trackStock: e.target.checked }))}
                    className="rounded accent-blue-600"/>
                  <span className="text-sm text-slate-600 dark:text-slate-300">Controlar stock</span>
                </label>
                {form.trackStock && <>
                  <Field label="Stock inicial">
                    <input value={form.stock} onChange={e => setForm(f => ({ ...f, stock: e.target.value }))}
                      type="number" min="0" placeholder="0" className={inputCls}/>
                  </Field>
                  <Field label="Alerta de stock bajo">
                    <input value={form.lowStockAlert} onChange={e => setForm(f => ({ ...f, lowStockAlert: e.target.value }))}
                      type="number" min="0" placeholder="5" className={inputCls}/>
                  </Field>
                </>}
              </div>
            </Card>

            {/* SEO */}
            <Card title="SEO y URL">
              <div className="space-y-4">
                <Field label="Slug (URL)">
                  <div className="flex items-center rounded-xl border border-slate-200 dark:border-white/10 overflow-hidden">
                    <span className="px-3 text-xs text-slate-400 border-r border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800/50 py-2.5 whitespace-nowrap">/productos/</span>
                    <input value={form.slug} onChange={e => setForm(f => ({ ...f, slug: toSlug(e.target.value) }))}
                      placeholder="nombre-del-producto" className="flex-1 px-3 py-2.5 text-sm bg-transparent text-slate-900 dark:text-white placeholder-slate-400 outline-none"/>
                  </div>
                </Field>
                <Field label="TÃ­tulo SEO">
                  <input value={form.metaTitle} onChange={e => setForm(f => ({ ...f, metaTitle: e.target.value }))}
                    placeholder="TÃ­tulo para buscadores" className={inputCls}/>
                </Field>
                <Field label="DescripciÃ³n SEO">
                  <textarea value={form.metaDesc} onChange={e => setForm(f => ({ ...f, metaDesc: e.target.value }))}
                    rows={2} placeholder="DescripciÃ³n breve para Googleâ€¦" className={`${inputCls} resize-none`}/>
                </Field>
              </div>
            </Card>
          </div>

          {/* side column */}
          <div className="space-y-5">
            <Card title="Estado">
              <div className="space-y-2">
                {(['active', 'draft'] as const).map(s => (
                  <label key={s} className="flex items-center gap-3 cursor-pointer">
                    <div onClick={() => setForm(f => ({ ...f, status: s }))}
                      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0 cursor-pointer ${form.status === s ? 'border-blue-600 bg-blue-600' : 'border-slate-300 dark:border-white/20'}`}>
                      {form.status === s && <div className="w-1.5 h-1.5 rounded-full bg-white"/>}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">{s === 'active' ? 'Activo' : 'Borrador'}</p>
                      <p className="text-xs text-slate-400">{s === 'active' ? 'Visible en la tienda' : 'No visible aÃºn'}</p>
                    </div>
                  </label>
                ))}
              </div>
            </Card>

            <Card title="CategorÃ­a">
              <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                className={inputCls}>
                <option value="">Sin categorÃ­a</option>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </Card>

            <Card title="Etiquetas">
              <div className="flex flex-wrap gap-2 mb-3">
                {tags.map(t => (
                  <span key={t} className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-500/20">
                    {t}
                    <button onClick={() => setTags(ts => ts.filter(x => x !== t))}><X size={10}/></button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  placeholder="Nueva etiquetaâ€¦" className={`${inputCls} flex-1`}/>
                <button onClick={addTag} className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-white/8 hover:bg-blue-50 dark:hover:bg-blue-500/10 text-slate-500 hover:text-blue-600 transition-colors">
                  <Plus size={14}/>
                </button>
              </div>
            </Card>

            {/* actions */}
            <div className="space-y-2">
              <button onClick={() => handleSave(false)} disabled={!form.name || saving}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-sm transition-all shadow-lg shadow-blue-500/20">
                {saving
                  ? <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                  : <><Check size={14}/> Guardar producto</>
                }
              </button>
              <button onClick={() => handleSave(true)} disabled={saving}
                className="w-full py-2.5 rounded-xl border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 font-semibold text-sm hover:bg-slate-50 dark:hover:bg-white/4 transition-colors">
                Guardar borrador
              </button>
            </div>
          </div>
        </div>
      </div>
    </LayoutCompras>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-white/8 p-5">
      <h3 className="text-sm font-black text-slate-900 dark:text-white mb-4">{title}</h3>
      {children}
    </div>
  );
}

