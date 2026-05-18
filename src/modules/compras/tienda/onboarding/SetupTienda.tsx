import { useState, useRef, ChangeEvent } from 'react';
import { useRouter } from 'next/router';
import { OnboardingLayout } from '@/components/shared/Layout/OnboardingLayout';
import { ChevronRight, ChevronLeft, Check, Upload, X, Plus } from 'lucide-react';

/* ── types ── */
interface StepDatos {
  nombre: string; slug: string; telefono: string; direccion: string; logo: string | null;
}
interface StepPagos {
  efectivo: boolean; transferencia: boolean; mercadopago: boolean; tarjeta: boolean;
}
interface StepProducto {
  nombre: string; precio: string; descripcion: string; imagen: string | null;
}

const PAGO_OPTIONS = [
  { key: 'efectivo',      label: 'Efectivo',       desc: 'Pagos en mano o en el local',   icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="12" x="2" y="6" rx="2"/><circle cx="12" cy="12" r="2"/><path d="M6 12h.01M18 12h.01"/></svg> },
  { key: 'transferencia', label: 'Transferencia',  desc: 'CBU / Alias bancario',           icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><path d="M22 10H2"/></svg> },
  { key: 'mercadopago',   label: 'MercadoPago',    desc: 'Link de pago y QR',             icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg> },
  { key: 'tarjeta',       label: 'Tarjeta',        desc: 'Crédito y débito presencial',   icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><path d="M2 10h20"/></svg> },
] as const;

/* ── step sub-components ── */
function StepDatosView({ data, onChange }: { data: StepDatos; onChange: (d: StepDatos) => void }) {
  const logoRef = useRef<HTMLInputElement>(null);

  const handleLogo = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => onChange({ ...data, logo: ev.target?.result as string });
    reader.readAsDataURL(file);
  };

  const toSlug = (v: string) => v.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 space-y-5">
          <Field label="Nombre del negocio" required>
            <input value={data.nombre} onChange={e => onChange({ ...data, nombre: e.target.value, slug: toSlug(e.target.value) })}
              placeholder="Ej: Barbería El Centro" className={inputCls} />
          </Field>
          <Field label="URL pública" hint="orbita.site/…">
            <div className="flex items-center rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800/50 overflow-hidden">
              <span className="px-3 text-sm text-slate-400 border-r border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/40 h-full flex items-center py-2.5 whitespace-nowrap">orbita.site/</span>
              <input value={data.slug} onChange={e => onChange({ ...data, slug: toSlug(e.target.value) })}
                placeholder="mi-negocio" className="flex-1 px-3 py-2.5 text-sm bg-transparent text-slate-900 dark:text-white placeholder-slate-400 outline-none" />
            </div>
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Teléfono">
              <input value={data.telefono} onChange={e => onChange({ ...data, telefono: e.target.value })}
                placeholder="+54 9 11..." type="tel" className={inputCls} />
            </Field>
            <Field label="Dirección">
              <input value={data.direccion} onChange={e => onChange({ ...data, direccion: e.target.value })}
                placeholder="Calle y número" className={inputCls} />
            </Field>
          </div>
        </div>
        <div className="flex flex-col items-center gap-3">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Logo</span>
          <button type="button" onClick={() => logoRef.current?.click()}
            className="relative w-24 h-24 rounded-2xl border-2 border-dashed border-slate-200 dark:border-white/15 hover:border-blue-400 dark:hover:border-blue-500 flex items-center justify-center overflow-hidden bg-slate-50 dark:bg-slate-900/40 transition-colors group">
            {data.logo
              ? <img src={data.logo} alt="logo" className="w-full h-full object-cover" />
              : <div className="flex flex-col items-center gap-1 text-slate-400 group-hover:text-blue-500 transition-colors">
                  <Upload size={20}/><span className="text-[10px]">Subir</span>
                </div>
            }
          </button>
          {data.logo && (
            <button type="button" onClick={() => onChange({ ...data, logo: null })}
              className="text-xs text-red-500 hover:text-red-600 flex items-center gap-1">
              <X size={12}/> Quitar
            </button>
          )}
          <input ref={logoRef} type="file" accept="image/*" className="hidden" onChange={handleLogo} />
        </div>
      </div>
    </div>
  );
}

function StepPagosView({ data, onChange }: { data: StepPagos; onChange: (d: StepPagos) => void }) {
  return (
    <div className="space-y-3">
      <p className="text-sm text-slate-500 dark:text-slate-400">Seleccioná los métodos que aceptás. Podés agregar más después.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {PAGO_OPTIONS.map(opt => {
          const active = data[opt.key as keyof StepPagos];
          return (
            <button key={opt.key} type="button"
              onClick={() => onChange({ ...data, [opt.key]: !active })}
              className={`flex items-center gap-3 p-4 rounded-2xl border text-left transition-all duration-150 ${active ? 'border-blue-500 bg-blue-50 dark:bg-blue-500/10' : 'border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/40 hover:border-slate-300 dark:hover:border-white/20'}`}>
              <span className={`flex-shrink-0 ${active ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'}`}>{opt.icon}</span>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-bold ${active ? 'text-blue-700 dark:text-blue-300' : 'text-slate-900 dark:text-white'}`}>{opt.label}</p>
                <p className="text-xs text-slate-400 truncate">{opt.desc}</p>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0 ${active ? 'bg-blue-600 border-blue-600' : 'border-slate-300 dark:border-white/20'}`}>
                {active && <Check size={10} strokeWidth={3} className="text-white"/>}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function StepProductoView({ data, onChange }: { data: StepProducto; onChange: (d: StepProducto) => void }) {
  const imgRef = useRef<HTMLInputElement>(null);

  const handleImg = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => onChange({ ...data, imagen: ev.target?.result as string });
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-500 dark:text-slate-400">
        Agregá tu primer producto. Podés saltar este paso y cargarlo después.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <button type="button" onClick={() => imgRef.current?.click()}
          className="w-full sm:w-32 h-32 rounded-2xl border-2 border-dashed border-slate-200 dark:border-white/15 hover:border-blue-400 dark:hover:border-blue-500 flex items-center justify-center overflow-hidden bg-slate-50 dark:bg-slate-900/40 transition-colors group flex-shrink-0">
          {data.imagen
            ? <img src={data.imagen} alt="producto" className="w-full h-full object-cover" />
            : <div className="flex flex-col items-center gap-1.5 text-slate-400 group-hover:text-blue-500 transition-colors">
                <Upload size={22}/><span className="text-xs">Foto</span>
              </div>
          }
        </button>
        <input ref={imgRef} type="file" accept="image/*" className="hidden" onChange={handleImg} />
        <div className="flex-1 space-y-3">
          <Field label="Nombre del producto" required>
            <input value={data.nombre} onChange={e => onChange({ ...data, nombre: e.target.value })}
              placeholder="Ej: Corte de pelo" className={inputCls} />
          </Field>
          <Field label="Precio (ARS)">
            <input value={data.precio} onChange={e => onChange({ ...data, precio: e.target.value })}
              placeholder="1500" type="number" min="0" className={inputCls} />
          </Field>
          <Field label="Descripción">
            <textarea value={data.descripcion} onChange={e => onChange({ ...data, descripcion: e.target.value })}
              placeholder="Breve descripción del producto o servicio" rows={2}
              className={`${inputCls} resize-none`} />
          </Field>
        </div>
      </div>
    </div>
  );
}

/* ── helpers ── */
const inputCls = 'w-full px-3 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/40 text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all';

function Field({ label, children, hint, required }: { label: string; children: React.ReactNode; hint?: string; required?: boolean }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-1">
        {label}{required && <span className="text-blue-500">*</span>}
        {hint && <span className="font-normal text-slate-400 ml-1">{hint}</span>}
      </label>
      {children}
    </div>
  );
}

const STEPS = ['Datos del negocio', 'Métodos de pago', 'Primer producto'];

/* ── page ── */
export default function TiendaSetup() {
  const router = useRouter();
  const { rubro = 'tienda' } = router.query;

  const [step, setStep] = useState(1);
  const [datos, setDatos] = useState<StepDatos>({ nombre: '', slug: '', telefono: '', direccion: '', logo: null });
  const [pagos, setPagos] = useState<StepPagos>({ efectivo: true, transferencia: false, mercadopago: false, tarjeta: false });
  const [producto, setProducto] = useState<StepProducto>({ nombre: '', precio: '', descripcion: '', imagen: null });
  const [loading, setLoading] = useState(false);

  const canNext = step === 1 ? datos.nombre.trim().length > 0 : true;

  const handleNext = () => {
    if (step < 3) setStep(s => s + 1);
    else handleFinish();
  };

  const handleFinish = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    router.push('/onboarding/tienda/success?slug=' + (datos.slug || 'mi-negocio'));
  };

  return (
    <OnboardingLayout title="Configurar mi tienda" step={step} totalSteps={3}>
      <div className="w-full max-w-xl">
        {/* step indicator */}
        <div className="flex items-center gap-2 mb-8">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all flex-shrink-0 ${i + 1 < step ? 'bg-blue-600 text-white' : i + 1 === step ? 'bg-blue-600 text-white ring-4 ring-blue-500/20' : 'bg-slate-100 dark:bg-white/8 text-slate-400'}`}>
                {i + 1 < step ? <Check size={13} strokeWidth={3}/> : i + 1}
              </div>
              <span className={`text-xs font-semibold hidden sm:block ${i + 1 === step ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>{s}</span>
              {i < STEPS.length - 1 && <div className={`h-px flex-1 min-w-[20px] transition-colors ${i + 1 < step ? 'bg-blue-500' : 'bg-slate-200 dark:bg-white/10'}`}/>}
            </div>
          ))}
        </div>

        <div className="bg-white dark:bg-slate-900/50 rounded-3xl border border-slate-200 dark:border-white/8 p-7 shadow-sm">
          <h2 className="text-xl font-black text-slate-900 dark:text-white mb-5">{STEPS[step - 1]}</h2>

          {step === 1 && <StepDatosView data={datos} onChange={setDatos} />}
          {step === 2 && <StepPagosView data={pagos} onChange={setPagos} />}
          {step === 3 && <StepProductoView data={producto} onChange={setProducto} />}

          <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-100 dark:border-white/8">
            <div>
              {step > 1 && (
                <button type="button" onClick={() => setStep(s => s - 1)}
                  className="flex items-center gap-1.5 text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                  <ChevronLeft size={16}/> Atrás
                </button>
              )}
            </div>
            <div className="flex items-center gap-3">
              {step === 3 && (
                <button type="button" onClick={handleFinish}
                  className="text-sm font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                  Saltar este paso
                </button>
              )}
              <button type="button" onClick={handleNext} disabled={!canNext || loading}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm transition-all shadow-lg shadow-blue-500/20 hover:-translate-y-0.5">
                {loading ? (
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                ) : (
                  <>
                    {step === 3 ? 'Crear mi tienda' : 'Continuar'}
                    <ChevronRight size={16}/>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </OnboardingLayout>
  );
}
