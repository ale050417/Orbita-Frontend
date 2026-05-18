import { useState, useRef, ChangeEvent, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { LayoutCompras } from '@/modules/compras/layout/LayoutCompras';
import { ChevronLeft, Upload, FileText, X, Check, AlertTriangle, Info, ChevronDown, ArrowRight, Download } from 'lucide-react';

/* â”€â”€ types â”€â”€ */
type ImportStatus = 'idle' | 'mapping' | 'preview' | 'importing' | 'done';

interface ParsedRow { [key: string]: string }
interface MappedColumn { fileCol: string; targetField: string }
interface ErrorRow { row: number; col: string; message: string }

const TARGET_FIELDS = [
  { key: 'name',         label: 'Nombre',       required: true  },
  { key: 'price',        label: 'Precio',        required: true  },
  { key: 'sku',          label: 'SKU',           required: false },
  { key: 'stock',        label: 'Stock',         required: false },
  { key: 'description',  label: 'DescripciÃ³n',   required: false },
  { key: 'category',     label: 'CategorÃ­a',     required: false },
  { key: 'status',       label: 'Estado',        required: false },
  { key: 'image_url',    label: 'URL de imagen', required: false },
  { key: 'ignore',       label: 'Ignorar columna', required: false },
];

/* â”€â”€ mock CSV parse â”€â”€ */
function parseMockCSV(): { columns: string[]; rows: ParsedRow[] } {
  const columns = ['Nombre del producto', 'Precio', 'SKU', 'Cantidad', 'Descripcion', 'Categoria'];
  const rows: ParsedRow[] = [
    { 'Nombre del producto': 'Shampoo Pro', Precio: '3200', SKU: 'SHP-001', Cantidad: '30', Descripcion: 'Shampoo profesional', Categoria: 'Cuidado' },
    { 'Nombre del producto': 'Cera Mate',   Precio: '1800', SKU: 'CER-002', Cantidad: '15', Descripcion: 'Cera para peinado',   Categoria: 'Cuidado' },
    { 'Nombre del producto': 'Mascarilla',  Precio: 'abc',  SKU: '',        Cantidad: '10', Descripcion: '',                   Categoria: 'Cuidado' },
    { 'Nombre del producto': 'Pack Triple', Precio: '8500', SKU: 'PKG-003', Cantidad: '5',  Descripcion: 'Pack de 3 productos', Categoria: 'Packs'  },
    { 'Nombre del producto': '',            Precio: '2000', SKU: 'MIS-004', Cantidad: '',   Descripcion: '',                   Categoria: ''        },
  ];
  return { columns, rows };
}

function validateRows(rows: ParsedRow[], mapping: MappedColumn[]): ErrorRow[] {
  const errors: ErrorRow[] = [];
  const nameCol = mapping.find(m => m.targetField === 'name')?.fileCol;
  const priceCol = mapping.find(m => m.targetField === 'price')?.fileCol;
  rows.forEach((r, i) => {
    if (nameCol && !r[nameCol]?.trim()) errors.push({ row: i + 2, col: nameCol, message: 'Nombre vacÃ­o' });
    if (priceCol && r[priceCol] && isNaN(Number(r[priceCol]))) errors.push({ row: i + 2, col: priceCol, message: `Precio invÃ¡lido: "${r[priceCol]}"` });
  });
  return errors;
}

export default function ImportProducts() {
  const router = useRouter();
  const dropRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const [status, setStatus] = useState<ImportStatus>('idle');
  const [fileName, setFileName] = useState('');
  const [columns, setColumns] = useState<string[]>([]);
  const [rows, setRows] = useState<ParsedRow[]>([]);
  const [mapping, setMapping] = useState<MappedColumn[]>([]);
  const [errors, setErrors] = useState<ErrorRow[]>([]);
  const [progress, setProgress] = useState(0);
  const [dragOver, setDragOver] = useState(false);

  const handleFile = (file: File) => {
    setFileName(file.name);
    const { columns: cols, rows: r } = parseMockCSV();
    setColumns(cols);
    setRows(r);
    const autoMap: MappedColumn[] = cols.map(c => {
      const lower = c.toLowerCase();
      if (lower.includes('nombre') || lower.includes('name')) return { fileCol: c, targetField: 'name' };
      if (lower.includes('precio') || lower.includes('price')) return { fileCol: c, targetField: 'price' };
      if (lower.includes('sku')) return { fileCol: c, targetField: 'sku' };
      if (lower.includes('cantidad') || lower.includes('stock')) return { fileCol: c, targetField: 'stock' };
      if (lower.includes('desc')) return { fileCol: c, targetField: 'description' };
      if (lower.includes('categ')) return { fileCol: c, targetField: 'category' };
      return { fileCol: c, targetField: 'ignore' };
    });
    setMapping(autoMap);
    setStatus('mapping');
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, []);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (file) handleFile(file);
  };

  const setFieldMap = (fileCol: string, targetField: string) => {
    setMapping(m => m.map(x => x.fileCol === fileCol ? { ...x, targetField } : x));
  };

  const handlePreview = () => {
    const errs = validateRows(rows, mapping);
    setErrors(errs);
    setStatus('preview');
  };

  const handleImport = async () => {
    setStatus('importing');
    setProgress(0);
    const validCount = rows.filter(r => {
      const nameCol = mapping.find(m => m.targetField === 'name')?.fileCol;
      return nameCol && r[nameCol]?.trim();
    }).length;
    for (let i = 0; i <= validCount; i++) {
      await new Promise(res => setTimeout(res, 120));
      setProgress(Math.round((i / validCount) * 100));
    }
    setStatus('done');
  };

  const validRows = rows.filter(r => {
    const nameCol = mapping.find(m => m.targetField === 'name')?.fileCol;
    return nameCol && r[nameCol]?.trim();
  });

  return (
    <LayoutCompras title="Importar productos">
      <div className="p-6 max-w-4xl mx-auto">
        <div className="flex items-center gap-2 text-sm mb-6">
          <Link href="/tienda/products" className="flex items-center gap-1 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
            <ChevronLeft size={16}/> Productos
          </Link>
          <span className="text-slate-300 dark:text-white/20">/</span>
          <span className="font-semibold text-slate-900 dark:text-white">Importar</span>
        </div>

        {/* steps indicator */}
        <div className="flex items-center gap-2 mb-8 text-xs">
          {['Subir archivo', 'Mapear columnas', 'Vista previa', 'Importar'].map((s, i) => {
            const stepNum = i + 1;
            const statusIdx = ['idle','mapping','preview','importing','done'].indexOf(status);
            const done = statusIdx > stepNum || (status === 'done' && i < 4);
            const active = (statusIdx === stepNum) || (i === 0 && status === 'idle') || (i === 3 && (status === 'importing' || status === 'done'));
            return (
              <div key={s} className="flex items-center gap-2">
                <div className={`flex items-center gap-1.5 ${active ? 'text-blue-600 dark:text-blue-400 font-bold' : done ? 'text-emerald-500 font-semibold' : 'text-slate-400'}`}>
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${active ? 'bg-blue-600 text-white' : done ? 'bg-emerald-500 text-white' : 'bg-slate-100 dark:bg-white/8'}`}>
                    {done ? <Check size={10} strokeWidth={3}/> : stepNum}
                  </div>
                  {s}
                </div>
                {i < 3 && <div className={`h-px w-6 flex-shrink-0 ${statusIdx > stepNum ? 'bg-emerald-400' : 'bg-slate-200 dark:bg-white/10'}`}/>}
              </div>
            );
          })}
        </div>

        {/* â”€â”€ STEP 1: upload â”€â”€ */}
        {status === 'idle' && (
          <div className="space-y-5">
            <div ref={dropRef} onDrop={handleDrop} onDragOver={e => { e.preventDefault(); setDragOver(true); }} onDragLeave={() => setDragOver(false)}
              onClick={() => fileRef.current?.click()}
              className={`flex flex-col items-center justify-center gap-4 p-12 rounded-3xl border-2 border-dashed cursor-pointer transition-all ${dragOver ? 'border-blue-500 bg-blue-50 dark:bg-blue-500/5' : 'border-slate-200 dark:border-white/15 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-slate-50 dark:hover:bg-white/3'}`}>
              <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center">
                <Upload size={26} className="text-blue-500"/>
              </div>
              <div className="text-center">
                <p className="text-sm font-bold text-slate-900 dark:text-white">ArrastrÃ¡ tu archivo aquÃ­</p>
                <p className="text-xs text-slate-400 mt-1">o <span className="text-blue-600 dark:text-blue-400">hacÃ© click para elegir</span></p>
                <p className="text-xs text-slate-400 mt-1">CSV o Excel (.xlsx) â€” hasta 10 MB</p>
              </div>
            </div>
            <input ref={fileRef} type="file" accept=".csv,.xlsx,.xls" className="hidden" onChange={handleInputChange}/>
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-blue-50 dark:bg-blue-500/8 border border-blue-200 dark:border-blue-500/20 text-xs text-blue-700 dark:text-blue-300">
              <Info size={14} className="flex-shrink-0"/>
              <span>El archivo debe tener al menos las columnas: <strong>Nombre</strong> y <strong>Precio</strong>.</span>
              <button className="ml-auto flex items-center gap-1 font-bold whitespace-nowrap hover:underline flex-shrink-0"><Download size={12}/> Plantilla</button>
            </div>
          </div>
        )}

        {/* â”€â”€ STEP 2: mapping â”€â”€ */}
        {status === 'mapping' && (
          <div className="space-y-5">
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-white/4 border border-slate-200 dark:border-white/8">
              <FileText size={16} className="text-slate-400 flex-shrink-0"/>
              <span className="text-sm font-semibold text-slate-900 dark:text-white flex-1 truncate">{fileName}</span>
              <span className="text-xs text-slate-400">{rows.length} filas Â· {columns.length} columnas</span>
              <button onClick={() => setStatus('idle')} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-white/8 text-slate-400"><X size={14}/></button>
            </div>

            <div className="bg-white dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-white/8 overflow-hidden">
              <div className="px-5 py-3.5 border-b border-slate-100 dark:border-white/8">
                <h3 className="text-sm font-black text-slate-900 dark:text-white">Mapear columnas</h3>
                <p className="text-xs text-slate-400 mt-0.5">AsignÃ¡ cada columna del archivo al campo correspondiente en Ã“rbita.</p>
              </div>
              <div className="divide-y divide-slate-50 dark:divide-white/4">
                {mapping.map(m => (
                  <div key={m.fileCol} className="flex items-center gap-4 px-5 py-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{m.fileCol}</p>
                      <p className="text-xs text-slate-400 truncate mt-0.5">Ej: {rows[0]?.[m.fileCol] ?? 'â€”'}</p>
                    </div>
                    <ArrowRight size={14} className="text-slate-300 dark:text-white/20 flex-shrink-0"/>
                    <div className="relative w-44 flex-shrink-0">
                      <select value={m.targetField} onChange={e => setFieldMap(m.fileCol, e.target.value)}
                        className="appearance-none w-full pl-3 pr-8 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/40 text-slate-700 dark:text-slate-200 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all">
                        {TARGET_FIELDS.map(f => <option key={f.key} value={f.key}>{f.label}{f.required ? ' *' : ''}</option>)}
                      </select>
                      <ChevronDown size={11} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"/>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end">
              <button onClick={handlePreview}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm transition-all shadow-lg shadow-blue-500/20">
                Ver vista previa <ArrowRight size={15}/>
              </button>
            </div>
          </div>
        )}

        {/* â”€â”€ STEP 3: preview â”€â”€ */}
        {status === 'preview' && (
          <div className="space-y-5">
            {errors.length > 0 && (
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-500/8 border border-amber-200 dark:border-amber-500/20">
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle size={15} className="text-amber-600 dark:text-amber-400 flex-shrink-0"/>
                  <span className="text-sm font-bold text-amber-700 dark:text-amber-400">{errors.length} advertencia{errors.length > 1 ? 's' : ''} encontrada{errors.length > 1 ? 's' : ''}</span>
                </div>
                <div className="space-y-1.5">
                  {errors.map((e, i) => (
                    <p key={i} className="text-xs text-amber-700 dark:text-amber-300 flex items-center gap-2">
                      <span className="font-mono bg-amber-100 dark:bg-amber-500/10 px-1.5 py-0.5 rounded text-[10px]">Fila {e.row}</span>
                      <span className="font-semibold">{e.col}:</span> {e.message}
                    </p>
                  ))}
                </div>
                <p className="text-xs text-amber-600 dark:text-amber-400 mt-3">Las filas con errores serÃ¡n omitidas. Se importarÃ¡n <strong>{validRows.length} de {rows.length}</strong> filas.</p>
              </div>
            )}

            <div className="bg-white dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-white/8 overflow-hidden">
              <div className="px-5 py-3.5 border-b border-slate-100 dark:border-white/8 flex items-center justify-between">
                <h3 className="text-sm font-black text-slate-900 dark:text-white">Vista previa ({validRows.length} filas vÃ¡lidas)</h3>
                <span className="text-xs text-slate-400">{rows.length - validRows.length} omitidas</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-slate-50 dark:border-white/4">
                      <th className="px-4 py-2.5 text-left font-bold text-slate-400 uppercase">#</th>
                      {mapping.filter(m => m.targetField !== 'ignore').map(m => (
                        <th key={m.fileCol} className="px-4 py-2.5 text-left font-bold text-slate-400 uppercase whitespace-nowrap">
                          {TARGET_FIELDS.find(f => f.key === m.targetField)?.label ?? m.fileCol}
                        </th>
                      ))}
                      <th className="px-4 py-2.5 text-center font-bold text-slate-400 uppercase">Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((r, i) => {
                      const hasError = errors.some(e => e.row === i + 2);
                      return (
                        <tr key={i} className={`border-b border-slate-50 dark:border-white/4 last:border-0 ${hasError ? 'bg-red-50/50 dark:bg-red-500/5' : ''}`}>
                          <td className="px-4 py-2.5 text-slate-400">{i + 2}</td>
                          {mapping.filter(m => m.targetField !== 'ignore').map(m => (
                            <td key={m.fileCol} className={`px-4 py-2.5 ${!r[m.fileCol] ? 'text-slate-300 dark:text-white/20 italic' : 'text-slate-700 dark:text-slate-200'}`}>
                              {r[m.fileCol] || 'â€”'}
                            </td>
                          ))}
                          <td className="px-4 py-2.5 text-center">
                            {hasError
                              ? <span className="inline-flex items-center gap-1 text-red-500 font-bold"><X size={11}/> Error</span>
                              : <span className="inline-flex items-center gap-1 text-emerald-500 font-bold"><Check size={11}/> OK</span>
                            }
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <button onClick={() => setStatus('mapping')} className="flex items-center gap-1 text-sm font-semibold text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors">
                <ChevronLeft size={16}/> Volver a mapeo
              </button>
              <button onClick={handleImport}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm transition-all shadow-lg shadow-blue-500/20">
                Importar {validRows.length} productos <ArrowRight size={15}/>
              </button>
            </div>
          </div>
        )}

        {/* â”€â”€ STEP 4: importing â”€â”€ */}
        {status === 'importing' && (
          <div className="flex flex-col items-center justify-center py-20 gap-6">
            <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center">
              <svg className="w-8 h-8 text-blue-500 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
            </div>
            <div className="text-center">
              <p className="text-base font-black text-slate-900 dark:text-white">Importando productosâ€¦</p>
              <p className="text-sm text-slate-400 mt-1">{progress}% completado</p>
            </div>
            <div className="w-64 h-2 rounded-full bg-slate-100 dark:bg-white/8 overflow-hidden">
              <div className="h-full rounded-full bg-blue-600 transition-all duration-300" style={{ width: `${progress}%` }}/>
            </div>
          </div>
        )}

        {/* â”€â”€ STEP 5: done â”€â”€ */}
        {status === 'done' && (
          <div className="flex flex-col items-center justify-center py-16 gap-5 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-500/15 flex items-center justify-center">
              <Check size={32} strokeWidth={2.5} className="text-emerald-500"/>
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">Â¡ImportaciÃ³n completada!</h2>
              <p className="text-slate-400 text-sm mt-2">Se importaron <strong className="text-slate-900 dark:text-white">{validRows.length} productos</strong> correctamente.</p>
            </div>
            <div className="flex gap-3 mt-2">
              <button onClick={() => setStatus('idle')} className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 font-semibold text-sm hover:bg-slate-50 dark:hover:bg-white/4 transition-colors">
                Importar otro archivo
              </button>
              <Link href="/tienda/products" className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm transition-all shadow-lg shadow-blue-500/20">
                Ver productos
              </Link>
            </div>
          </div>
        )}
      </div>
    </LayoutCompras>
  );
}

