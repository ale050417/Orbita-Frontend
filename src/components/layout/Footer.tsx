import { useState } from 'react';
import { LegalModal } from '@/components/ui/LegalModal';

type LegalKey = 'terminos' | 'privacidad' | 'cookies';

interface FooterLink {
  label: string;
  href?: string;
  action?: LegalKey;
}

const cols: { title: string; links: FooterLink[] }[] = [
  {
    title: 'Navegación',
    links: [
      { label: 'Módulos',      href: '#modulos'     },
      { label: 'Rubros',       href: '#rubros'       },
      { label: 'Testimonios',  href: '#testimonios'  },
      { label: 'Próximamente', href: '#proximamente' },
    ],
  },
  {
    title: 'Plataforma',
    links: [
      { label: 'Turnos',       href: '#modulos' },
      { label: 'Tienda Online',href: '#modulos' },
      { label: 'Dashboard',    href: '#modulos' },
      { label: 'Clientes',     href: '#modulos' },
    ],
  },
  {
    title: 'Legal & Contacto',
    links: [
      { label: 'Términos de uso', action: 'terminos'   },
      { label: 'Privacidad',      action: 'privacidad' },
      { label: 'Cookies',         action: 'cookies'    },
    ],
  },
];

export function Footer() {
  const [legalModal, setLegalModal] = useState<{ isOpen: boolean; contentKey: LegalKey | null }>({ isOpen: false, contentKey: null });

  const handleClick = (e: React.MouseEvent, link: FooterLink) => {
    e.preventDefault();
    if (link.action) { setLegalModal({ isOpen: true, contentKey: link.action }); return; }
    const href = link.href;
    if (!href) return;
    if (href === '#') { window.scrollTo({ top: 0, behavior: 'smooth' }); return; }
    const el = document.getElementById(href.slice(1));
    if (!el) return;
    const isSticky = ['#rubros', '#testimonios', '#proximamente'].includes(href);
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - (isSticky ? 0 : 80), behavior: 'smooth' });
  };

  return (
    <>
      <footer className="bg-transparent border-t border-slate-200 dark:border-white/5 pt-16 pb-8 relative z-10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="md:col-span-1">
              <div className="flex items-center gap-2.5 mb-4 cursor-pointer" onClick={(e) => handleClick(e as React.MouseEvent, { href: '#' })}>
                <svg viewBox="0 0 30 30" fill="none" className="w-7 h-7">
                  <circle cx="15" cy="15" r="13" stroke="#2563eb" strokeWidth="3.2" strokeDasharray="60 22" strokeLinecap="round"/>
                  <circle cx="25.5" cy="7.5" r="4" fill="#93c5fd"/>
                  <circle cx="15" cy="15" r="4.5" fill="#1e3a8a"/>
                </svg>
                <span className="text-lg font-bold text-slate-900 dark:text-white">Órbita</span>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-[240px]">
                La plataforma integral que pone tu negocio en órbita. Turnos, ventas, clientes y analytics en un solo lugar.
              </p>
            </div>

            {cols.map(col => (
              <div key={col.title}>
                <h4 className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-500 mb-4">{col.title}</h4>
                <ul className="space-y-3">
                  {col.links.map(link => (
                    <li key={link.label}>
                      <a href={link.href || '#'} onClick={(e) => handleClick(e, link)}
                        className="text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer">
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="pt-8 border-t border-slate-200 dark:border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
            <span className="text-sm text-slate-400">© 2026 Órbita. Todos los derechos reservados.</span>
            <span className="text-sm text-slate-400">Hecho por emprendedores, para emprendedores</span>
          </div>
        </div>
      </footer>

      <LegalModal
        isOpen={legalModal.isOpen}
        contentKey={legalModal.contentKey}
        onClose={() => setLegalModal(s => ({ ...s, isOpen: false }))}
      />
    </>
  );
}
