import Head from 'next/head';
import Link from 'next/link';
import { ReactNode } from 'react';

interface Props {
  title: string;
  step?: number;
  totalSteps?: number;
  children: ReactNode;
}

export function OnboardingLayout({ title, step, totalSteps, children }: Props) {
  return (
    <>
      <Head>
        <title>{title} — Órbita</title>
      </Head>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
        <header className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-white/5 bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm sticky top-0 z-50">
          <Link href="/" className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3"/><path d="M12 2a10 10 0 0 1 10 10 10 10 0 0 1-10 10A10 10 0 0 1 2 12 10 10 0 0 1 12 2z"/>
              </svg>
            </span>
            <span className="font-black text-slate-900 dark:text-white tracking-tight">Órbita</span>
          </Link>
          {step !== undefined && totalSteps !== undefined && (
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-400">Paso {step} de {totalSteps}</span>
              <div className="flex gap-1.5">
                {Array.from({ length: totalSteps }).map((_, i) => (
                  <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i < step ? 'w-6 bg-blue-600' : i === step - 1 ? 'w-6 bg-blue-600' : 'w-4 bg-slate-200 dark:bg-white/10'}`} />
                ))}
              </div>
            </div>
          )}
          <Link href="/login" className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
            ¿Ya tenés cuenta? <span className="font-semibold text-blue-600">Iniciar sesión</span>
          </Link>
        </header>
        <main className="flex-1 flex flex-col items-center justify-center px-4 py-12">
          {children}
        </main>
      </div>
    </>
  );
}
