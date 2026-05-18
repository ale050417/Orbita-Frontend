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
          <Link href="/" className="flex items-center gap-2.5">
            <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="15" cy="15" r="13" stroke="#2563eb" strokeWidth="3.2" strokeDasharray="60 22" strokeLinecap="round"/>
              <circle cx="25.5" cy="7.5" r="4" fill="#93c5fd"/>
              <circle cx="15" cy="15" r="4.5" fill="#1e3a8a"/>
            </svg>
            <span className="font-black text-slate-900 dark:text-white tracking-tight text-lg">Órbita</span>
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
