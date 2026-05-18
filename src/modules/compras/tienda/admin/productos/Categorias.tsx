import { useState, useRef, ChangeEvent } from 'react';
import Link from 'next/link';
import { LayoutCompras } from '@/modules/compras/layout/LayoutCompras';
import { Plus, Edit2, Trash2, ChevronRight, X, Check, Upload, FolderOpen, Image } from 'lucide-react';

/* â”€â”€ types â”€â”€ */
interface Subcategory { id: string; name: string; slug: string; count: number }
interface Category {
  id: string; name: string; slug: string; image: string | null;
  color: string; count: number; subcategories: Subcategory[];
}

const INITIAL_CATS: Category[] = [
  { id: '1', name: 'Servicios',   slug: 'servicios',   image: null, color: '#3b82f6', count: 3, subcategories: [{ id: 's1', name: 'Corte', slug: 'corte', count: 2 }, { id: 's2', name: 'ColoraciÃ³n', slug: 'coloracion', count: 1 }] },
  { id: '2', name: 'Cuidado',     slug: 'cuidado',     image: null, color: '#8b5cf6', count: 5, subcategories: [{ id: 's3', name: 'Shampoo', slug: 'shampoo', count: 3 }, { id: 's4', name: 'Acondicionador', slug: 'acondicionador', count: 2 }] },
  { id: '3', name: 'Accesorios',  slug: 'accesorios',  image: null, color: '#f59e0b', count: 2, subcategories: [] },
  { id: '4', name: 'Packs',       slug: 'packs',       image: null, color: '#10b981', count: 1, subcategories: [] },
];

const PALETTE = ['#3b82f6','#8b5cf6','#f59e0b','#10b981','#ef4444','#f97316','#06b6d4','#ec4899','#64748b'];

const toSlug = (v: string) => v.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

const inputCls = 'w-full px-3 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/40 text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all';

/* â”€â”€ modal for add/edit â”€â”€ */
interface ModalProps {
  cat?: Category; onSave: (c: Omit<Category, 'id' | 'count' | 'subcategories'>) => void; onClose: () => void;
}
function CategoryModal({ cat, onSave, onClose }: ModalProps) {
  const imgRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState(cat?.name ?? '');
  const [slug, setSlug] = useState(cat?.slug ?? '');
  const [color, setColor] = useState(cat?.color ?? '#3b82f6');
  const [image, setImage] = useState<string | null>(cat?.image ?? null);

  const handleImg = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]; if (!f) return;
    const r = new FileReader(); r.onload = ev => setImage(ev.target?.result as string); r.readAsDataURL(f);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}/>
      <div className="relative bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-white/8 p-6 w-full max-w-sm shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-base font-black text-slate-900 dark:text-white">{cat ? 'Editar categorÃ­a' : 'Nueva categorÃ­a'}</h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-white/8 text-slate-400"><X size={18}/></button>
        </div>
        <div className="space-y-4">
          {/* image upload */}
          <div className="flex items-center gap-4">
            <button type="button" onClick={() => imgRef.current?.click()}
              className="w-16 h-16 rounded-2xl border-2 border-dashed border-slate-200 dark:border-white/15 flex items-center justify-center overflow-hidden bg-slate-50 dark:bg-slate-800/50 hover:border-blue-400 transition-colors group flex-shrink-0">
              {image ? <img src={image} alt="" className="w-full h-full object-cover"/> : <Upload size={18} className="text-slate-400 group-hover:text-blue-500 transition-colors"/>}
            </button>
            <input ref={imgRef} type="file" accept="image/*" className="hidden" onChange={handleImg}/>
            <div className="flex-1 space-y-1.5">
              <label className="text-xs font-bold text-slate-600 dark:text-slate-300">Nombre <span className="text-blue-500">*</span></label>
              <input value={name} onChange={e => { setName(e.target.value); setSlug(toSlug(e.target.value)); }}
                placeholder="Ej: Servicios" className={inputCls}/>
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-600 dark:text-slate-300">Slug (URL)</label>
            <input value={slug} onChange={e => setSlug(toSlug(e.target.value))} placeholder="servicios" className={inputCls}/>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-600 dark:text-slate-300">Color</label>
            <div className="flex gap-2 flex-wrap">
              {PALETTE.map(c => (
                <button key={c} type="button" onClick={() => setColor(c)}
                  className={`w-7 h-7 rounded-full transition-all ${color === c ? 'ring-2 ring-offset-2 ring-blue-500 dark:ring-offset-slate-900 scale-110' : 'hover:scale-105'}`}
                  style={{ background: c }}/>
              ))}
            </div>
          </div>
        </div>
        <div className="flex gap-2 mt-6">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 font-semibold text-sm hover:bg-slate-50 dark:hover:bg-white/4 transition-colors">
            Cancelar
          </button>
          <button onClick={() => { onSave({ name, slug, image, color }); onClose(); }} disabled={!name.trim()}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-sm transition-colors">
            <Check size={14}/> Guardar
          </button>
        </div>
      </div>
    </div>
  );
}

/* â”€â”€ subcategory inline edit â”€â”€ */
function SubcatRow({ sub, onDelete, onEdit }: { sub: Subcategory; onDelete: () => void; onEdit: (name: string) => void }) {
  const [editing, setEditing] = useState(false);
  const [val, setVal] = useState(sub.name);
  return (
    <div className="flex items-center gap-2 py-1.5 px-3 rounded-xl hover:bg-slate-50 dark:hover:bg-white/4 group">
      <ChevronRight size={12} className="text-slate-300 dark:text-white/20 flex-shrink-0"/>
      {editing
        ? <input value={val} onChange={e => setVal(e.target.value)} autoFocus
            onKeyDown={e => { if (e.key === 'Enter') { onEdit(val); setEditing(false); } if (e.key === 'Escape') setEditing(false); }}
            className="flex-1 text-sm px-2 py-0.5 rounded-lg border border-blue-500 bg-white dark:bg-slate-900/40 text-slate-900 dark:text-white outline-none"/>
        : <span className="flex-1 text-sm text-slate-600 dark:text-slate-300">{sub.name}</span>
      }
      <span className="text-xs text-slate-400">{sub.count}</span>
      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={() => setEditing(true)} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-white/8 text-slate-400 hover:text-blue-600"><Edit2 size={11}/></button>
        <button onClick={onDelete} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-white/8 text-slate-400 hover:text-red-500"><Trash2 size={11}/></button>
      </div>
    </div>
  );
}

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATS);
  const [expanded, setExpanded] = useState<Set<string>>(new Set(['1']));
  const [modal, setModal] = useState<{ open: boolean; editing?: Category }>({ open: false });
  const [addingSubFor, setAddingSubFor] = useState<string | null>(null);
  const [newSubName, setNewSubName] = useState('');

  const toggleExpand = (id: string) => setExpanded(s => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });

  const saveCategory = (data: Omit<Category, 'id' | 'count' | 'subcategories'>) => {
    if (modal.editing) {
      setCategories(cs => cs.map(c => c.id === modal.editing!.id ? { ...c, ...data } : c));
    } else {
      setCategories(cs => [...cs, { id: Date.now().toString(), count: 0, subcategories: [], ...data }]);
    }
  };

  const deleteCategory = (id: string) => setCategories(cs => cs.filter(c => c.id !== id));

  const addSubcategory = (catId: string) => {
    const t = newSubName.trim(); if (!t) return;
    setCategories(cs => cs.map(c => c.id === catId
      ? { ...c, subcategories: [...c.subcategories, { id: Date.now().toString(), name: t, slug: toSlug(t), count: 0 }] }
      : c
    ));
    setNewSubName(''); setAddingSubFor(null);
  };

  const deleteSubcategory = (catId: string, subId: string) => {
    setCategories(cs => cs.map(c => c.id === catId ? { ...c, subcategories: c.subcategories.filter(s => s.id !== subId) } : c));
  };

  const editSubcategory = (catId: string, subId: string, name: string) => {
    setCategories(cs => cs.map(c => c.id === catId
      ? { ...c, subcategories: c.subcategories.map(s => s.id === subId ? { ...s, name, slug: toSlug(name) } : s) }
      : c
    ));
  };

  return (
    <LayoutCompras title="CategorÃ­as">
      <div className="p-6 max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-black text-slate-900 dark:text-white">CategorÃ­as</h1>
            <p className="text-sm text-slate-400 mt-0.5">{categories.length} categorÃ­as Â· {categories.reduce((a, c) => a + c.subcategories.length, 0)} subcategorÃ­as</p>
          </div>
          <button onClick={() => setModal({ open: true })}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white transition-colors shadow-sm shadow-blue-500/20">
            <Plus size={14}/> Nueva categorÃ­a
          </button>
        </div>

        <div className="space-y-3">
          {categories.map(cat => (
            <div key={cat.id} className="bg-white dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-white/8 overflow-hidden">
              {/* category row */}
              <div className="flex items-center gap-3 px-5 py-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden" style={{ background: cat.color + '20', border: `1.5px solid ${cat.color}40` }}>
                  {cat.image
                    ? <img src={cat.image} alt="" className="w-full h-full object-cover"/>
                    : <FolderOpen size={16} style={{ color: cat.color }}/>
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-black text-slate-900 dark:text-white">{cat.name}</p>
                  <p className="text-xs text-slate-400 font-mono">/productos/{cat.slug}</p>
                </div>
                <span className="text-xs font-semibold text-slate-400 px-2 py-0.5 rounded-full bg-slate-100 dark:bg-white/6">{cat.count} productos</span>
                <div className="flex items-center gap-1">
                  <button onClick={() => setModal({ open: true, editing: cat })} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-white/8 text-slate-400 hover:text-blue-600 transition-colors"><Edit2 size={14}/></button>
                  <button onClick={() => deleteCategory(cat.id)} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-white/8 text-slate-400 hover:text-red-500 transition-colors"><Trash2 size={14}/></button>
                  <button onClick={() => toggleExpand(cat.id)} className={`p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-white/8 text-slate-400 transition-all ${expanded.has(cat.id) ? 'rotate-90' : ''}`}><ChevronRight size={14}/></button>
                </div>
              </div>

              {/* subcategories */}
              {expanded.has(cat.id) && (
                <div className="border-t border-slate-100 dark:border-white/8 px-5 py-3 space-y-0.5">
                  {cat.subcategories.map(sub => (
                    <SubcatRow key={sub.id} sub={sub}
                      onDelete={() => deleteSubcategory(cat.id, sub.id)}
                      onEdit={name => editSubcategory(cat.id, sub.id, name)}/>
                  ))}
                  {addingSubFor === cat.id
                    ? (
                      <div className="flex items-center gap-2 pl-5 py-1.5">
                        <input value={newSubName} onChange={e => setNewSubName(e.target.value)} autoFocus
                          onKeyDown={e => { if (e.key === 'Enter') addSubcategory(cat.id); if (e.key === 'Escape') { setAddingSubFor(null); setNewSubName(''); }}}
                          placeholder="Nombre de subcategorÃ­a"
                          className="flex-1 text-sm px-3 py-1.5 rounded-xl border border-blue-500 bg-white dark:bg-slate-900/40 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/20"/>
                        <button onClick={() => addSubcategory(cat.id)} className="px-3 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-500 transition-colors">Agregar</button>
                        <button onClick={() => { setAddingSubFor(null); setNewSubName(''); }} className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"><X size={14}/></button>
                      </div>
                    ) : (
                      <button onClick={() => setAddingSubFor(cat.id)}
                        className="flex items-center gap-1.5 pl-5 py-1.5 text-xs font-semibold text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors w-full text-left">
                        <Plus size={12}/> Agregar subcategorÃ­a
                      </button>
                    )
                  }
                </div>
              )}
            </div>
          ))}
        </div>

        {categories.length === 0 && (
          <div className="text-center py-20 text-slate-400">
            <FolderOpen size={40} className="mx-auto mb-3 opacity-30"/>
            <p className="text-sm font-semibold">Sin categorÃ­as todavÃ­a</p>
            <button onClick={() => setModal({ open: true })} className="mt-4 text-sm font-bold text-blue-600 dark:text-blue-400 hover:underline">Crear la primera</button>
          </div>
        )}
      </div>

      {modal.open && (
        <CategoryModal cat={modal.editing} onSave={saveCategory} onClose={() => setModal({ open: false })}/>
      )}
    </LayoutCompras>
  );
}

