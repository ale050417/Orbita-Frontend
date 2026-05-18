import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { LayoutCompras } from '@/modules/compras/layout/LayoutCompras';
import { ChevronLeft, Plus, Trash2, Check, X, Edit2, Save, Upload, ChevronDown } from 'lucide-react';

/* ── types ── */
type OptionType = 'color' | 'talle' | 'sabor' | 'material';

interface OptionDef { type: OptionType; values: string[] }
interface Variant { id: string; combo: Record<string, string>; sku: string; price: string; stock: string; image: string | null; active: boolean }

const OPTION_LABELS: Record<OptionType, string> = { color: 'Color', talle: 'Talle', sabor: 'Sabor', material: 'Material' };
const ALL_OPTION_TYPES: OptionType[] = ['color', 'talle', 'sabor', 'material'];

const COLOR_SWATCHES: Record<string, string> = {
  Negro: '#111', Blanco: '#fff', Rojo: '#ef4444', Azul: '#3b82f6', Verde: '#22c55e', Amarillo: '#eab308', Gris: '#9ca3af',
};

function genVariants(options: OptionDef[]): Variant[] {
  if (options.length === 0) return [];
  const combos: Record<string, string>[] = [{}];
  for (const opt of options) {
    const next: Record<string, string>[] = [];
    for (const combo of combos)
      for (const val of opt.values)
        next.push({ ...combo, [opt.type]: val });
    combos.splice(0, combos.length, ...next);
  }
  return combos.map((c, i) => ({
    id: String(i + 1), combo: c, sku: '', price: '3200', stock: '10', image: null, active: true,
  }));
}

/* mock initial state */
const INIT_OPTIONS: OptionDef[] = [
  { type: 'talle', values: ['S', 'M', 'L', 'XL'] },
  { type: 'color', values: ['Negro', 'Blanco', 'Azul'] },
];

const inputCls = 'w-full px-2 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/40 text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all';

export default function Variants() {
  const router = useRouter();
  const { id } = router.query;
  const [options, setOptions] = useState<OptionDef[]>(INIT_OPTIONS);
  const [variants, setVariants] = useState<Variant[]>(() => genVariants(INIT_OPTIONS));
  const [editingOption, setEditingOption] = useState<number | null>(null);
  const [newValue, setNewValue] = useState('');
  const [saving, setSaving] = useState(false);

  const addOption = (type: OptionType) => {
    if (options.find(o => o.type === type)) return;
    const updated = [...options, { type, values: [] }];
    setOptions(updated);
    setVariants(genVariants(updated));
  };

  const removeOption = (i: number) => {
    const updated = options.filter((_, j) => j !== i);
    setOptions(updated);
    setVariants(genVariants(updated));
  };

  const addValue = (optIdx: number) => {
    const t = newValue.trim();
    if (!t) return;
    const updated = options.map((o, i) => i === optIdx ? { ...o, values: [...o.values, t] } : o);
    setOptions(updated);
    setVariants(genVariants(updated));
    setNewValue('');
  };

  const removeValue = (optIdx: number, val: string) => {
    const updated = options.map((o, i) => i === optIdx ? { ...o, values: o.values.filter(v => v !== val) } : o);
    setOptions(updated);
    setVariants(genVariants(updated));
  };

  const updateVariant = (id: string, field: keyof Variant, value: string | boolean | null) => {
    setVariants(vs => vs.map(v => v.id === id ? { ...v, [field]: value } : v));
  };

  const handleSave = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 800));
    setSaving(false);
  };

  const available = ALL_OPTION_TYPES.filter(t => !options.find(o => o.type === t));

  return (
    <LayoutCompras title="Variantes del producto">
      <div className="p-6 max-w-5xl mx-auto space-y-6">

        {/* breadcrumb */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm">
            <Link href="/tienda/products" className="flex items-center gap-1 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"><ChevronLeft size={16}/> Productos</Link>
            <span className="text-slate-300 dark:text-white/20">/</span>
            <Link href={`/tienda/products/${id}`} className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">Shampoo Premium 400ml</Link>
            <span className="text-slate-300 dark:text-white/20">/</span>
            <span className="font-semibold text-slate-900 dark:text-white">Variantes</span>
          </div>
          <button onClick={handleSave} disabled={saving}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-xs transition-all shadow-lg shadow-blue-500/20">
            {saving ? <svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg> : <><Save size={13}/> Guardar</>}
          </button>
        </div>

        {/* options builder */}
        <div className="bg-white dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-white/8 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-black text-slate-900 dark:text-white">Opciones de variante</h3>
            {available.length > 0 && (
              <div className="relative group">
                <button className="flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline">
                  <Plus size={13}/> Agregar opción <ChevronDown size={11}/>
                </button>
                <div className="absolute right-0 top-full mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl shadow-xl overflow-hidden z-20 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity min-w-[140px]">
                  {available.map(t => (
                    <button key={t} onClick={() => addOption(t)}
                      className="w-full px-4 py-2.5 text-left text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-blue-500/10 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                      {OPTION_LABELS[t]}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            {options.map((opt, i) => (
              <div key={opt.type} className="p-4 rounded-xl bg-slate-50 dark:bg-white/4 border border-slate-100 dark:border-white/8">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-black text-slate-700 dark:text-slate-200 uppercase tracking-wide">{OPTION_LABELS[opt.type]}</span>
                  <button onClick={() => removeOption(i)} className="text-xs text-red-400 hover:text-red-600 transition-colors flex items-center gap-1"><Trash2 size={12}/></button>
                </div>
                <div className="flex flex-wrap gap-2 mb-3">
                  {opt.values.map(val => (
                    <span key={val} className="flex items-center gap-1.5 pl-2.5 pr-1.5 py-1 rounded-full text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/15 text-slate-700 dark:text-slate-200">
                      {opt.type === 'color' && COLOR_SWATCHES[val] && (
                        <span className="w-3 h-3 rounded-full border border-black/10 flex-shrink-0" style={{ background: COLOR_SWATCHES[val] }}/>
                      )}
                      {val}
                      <button onClick={() => removeValue(i, val)} className="hover:text-red-500 transition-colors"><X size={10}/></button>
                    </span>
                  ))}
                  <div className="flex items-center gap-1">
                    <input value={newValue} onChange={e => setNewValue(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); if (editingOption === i) addValue(i); }}}
                      onFocus={() => setEditingOption(i)}
                      placeholder={`Agregar ${OPTION_LABELS[opt.type].toLowerCase()}`}
                      className="w-32 px-2 py-1 rounded-full text-xs border border-dashed border-slate-300 dark:border-white/15 bg-transparent text-slate-600 dark:text-slate-300 placeholder-slate-400 outline-none focus:border-blue-500"/>
                    <button onClick={() => { if (editingOption === i || true) addValue(i); }}
                      className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white hover:bg-blue-500 transition-colors">
                      <Plus size={11}/>
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {options.length === 0 && (
              <div className="text-center py-8 text-slate-400">
                <p className="text-sm">Sin opciones aún. Agregá Color, Talle u otras.</p>
              </div>
            )}
          </div>
        </div>

        {/* variant matrix */}
        {variants.length > 0 && (
          <div className="bg-white dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-white/8 overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 dark:border-white/8 flex items-center justify-between">
              <h3 className="text-sm font-black text-slate-900 dark:text-white">{variants.length} variantes generadas</h3>
              <button className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline">Editar en lote</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-slate-50 dark:border-white/4">
                    <th className="px-4 py-3 text-left font-bold text-slate-400 uppercase tracking-wide">Variante</th>
                    <th className="px-4 py-3 text-left font-bold text-slate-400 uppercase tracking-wide hidden md:table-cell">Foto</th>
                    <th className="px-4 py-3 text-left font-bold text-slate-400 uppercase tracking-wide">SKU</th>
                    <th className="px-4 py-3 text-left font-bold text-slate-400 uppercase tracking-wide">Precio</th>
                    <th className="px-4 py-3 text-left font-bold text-slate-400 uppercase tracking-wide">Stock</th>
                    <th className="px-4 py-3 text-center font-bold text-slate-400 uppercase tracking-wide">Activo</th>
                  </tr>
                </thead>
                <tbody>
                  {variants.map(v => (
                    <tr key={v.id} className={`border-b border-slate-50 dark:border-white/4 last:border-0 transition-colors ${v.active ? 'hover:bg-slate-50 dark:hover:bg-white/3' : 'opacity-50'}`}>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1.5">
                          {Object.entries(v.combo).map(([k, val]) => (
                            <span key={k} className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 dark:bg-white/8 text-slate-600 dark:text-slate-300 font-semibold">
                              {k === 'color' && COLOR_SWATCHES[val] && <span className="w-2.5 h-2.5 rounded-full border border-black/10 flex-shrink-0" style={{ background: COLOR_SWATCHES[val] }}/>}
                              {val}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <button className="w-9 h-9 rounded-xl border-2 border-dashed border-slate-200 dark:border-white/15 flex items-center justify-center text-slate-400 hover:border-blue-400 hover:text-blue-500 transition-colors overflow-hidden bg-slate-50 dark:bg-slate-800/50">
                          {v.image ? <img src={v.image} alt="" className="w-full h-full object-cover"/> : <Upload size={12}/>}
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <input value={v.sku} onChange={e => updateVariant(v.id, 'sku', e.target.value)}
                          placeholder="SKU-001" className={`${inputCls} w-24`}/>
                      </td>
                      <td className="px-4 py-3">
                        <div className="relative w-24">
                          <span className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400 font-semibold text-xs">$</span>
                          <input value={v.price} onChange={e => updateVariant(v.id, 'price', e.target.value)}
                            type="number" className={`${inputCls} pl-5`}/>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <input value={v.stock} onChange={e => updateVariant(v.id, 'stock', e.target.value)}
                          type="number" min="0" className={`${inputCls} w-20`}/>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button onClick={() => updateVariant(v.id, 'active', !v.active)}
                          className={`w-10 h-5 rounded-full transition-colors flex-shrink-0 relative ${v.active ? 'bg-blue-600' : 'bg-slate-200 dark:bg-white/15'}`}>
                          <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-all ${v.active ? 'left-5' : 'left-0.5'}`}/>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </LayoutCompras>
  );
}
