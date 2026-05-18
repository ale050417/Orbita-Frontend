import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ReactNode, useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import {
  LayoutDashboard, Package, ShoppingCart, Users,
  Calendar, Settings, Bell, Sun, Moon, Menu, X, ChevronRight,
  ExternalLink, LogOut,
} from 'lucide-react';

interface NavItem {
  label: string; href: string; icon: ReactNode;
  children?: { label: string; href: string }[];
}

const NAV: NavItem[] = [
  { label: 'Panel',      href: '/admin',                icon: <LayoutDashboard size={16}/> },
  { label: 'Productos',  href: '/tienda/products',       icon: <Package size={16}/>,
    children: [
      { label: 'Lista',      href: '/tienda/products'        },
      { label: 'Nuevo',      href: '/tienda/products/new'    },
      { label: 'Categorías', href: '/tienda/categories'      },
      { label: 'Importar',   href: '/tienda/products/import' },
    ]
  },
  { label: 'Pedidos',    href: '/tienda/orders',         icon: <ShoppingCart size={16}/> },
  { label: 'Clientes',   href: '/tienda/clients',        icon: <Users size={16}/> },
  { label: 'Turnos',     href: '/turnos',                icon: <Calendar size={16}/> },
  { label: 'Ajustes',    href: '/admin/settings',        icon: <Settings size={16}/> },
];

function NavLink({ item, collapsed, onClose }: { item: NavItem; collapsed: boolean; onClose?: () => void }) {
  const router = useRouter();
  const isActive = router.pathname === item.href || router.pathname.startsWith(item.href + '/');
  const [open, setOpen] = useState(isActive && !!item.children);

  if (item.children && !collapsed) {
    return (
      <div>
        <button onClick={() => setOpen(o => !o)}
          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-semibold transition-colors ${isActive ? 'bg-blue-600 text-white' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/6'}`}>
          <span className="flex-shrink-0">{item.icon}</span>
          <span className="flex-1 text-left">{item.label}</span>
          <ChevronRight size={13} className={`transition-transform ${open ? 'rotate-90' : ''}`}/>
        </button>
        {open && (
          <div className="ml-7 mt-1 space-y-0.5 border-l-2 border-slate-100 dark:border-white/8 pl-3">
            {item.children.map(c => (
              <Link key={c.href} href={c.href} onClick={onClose}
                className={`block py-1.5 px-2 rounded-lg text-xs font-semibold transition-colors ${router.pathname === c.href ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}>
                {c.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <Link href={item.href} onClick={onClose}
      title={collapsed ? item.label : undefined}
      className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-semibold transition-colors ${isActive ? 'bg-blue-600 text-white' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/6'} ${collapsed ? 'justify-center' : ''}`}>
      <span className="flex-shrink-0">{item.icon}</span>
      {!collapsed && <span>{item.label}</span>}
    </Link>
  );
}

interface Props { title: string; children: ReactNode; }

export function LayoutCompras({ title, children }: Props) {
  const { isDark, toggle } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const SidebarContent = ({ onClose }: { onClose?: () => void }) => (
    <div className="flex flex-col h-full">
      <div className={`flex items-center gap-2 px-4 py-4 border-b border-slate-100 dark:border-white/8 ${collapsed ? 'justify-center' : ''}`}>
        <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3"/><path d="M12 2a10 10 0 0 1 10 10 10 10 0 0 1-10 10A10 10 0 0 1 2 12 10 10 0 0 1 12 2z"/>
          </svg>
        </div>
        {!collapsed && <span className="font-black text-slate-900 dark:text-white tracking-tight">Órbita</span>}
      </div>
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {NAV.map(item => <NavLink key={item.href} item={item} collapsed={collapsed} onClose={onClose}/>)}
      </nav>
      <div className="px-3 py-4 border-t border-slate-100 dark:border-white/8 space-y-1">
        <Link href="/" target="_blank"
          className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors ${collapsed ? 'justify-center' : ''}`}>
          <ExternalLink size={14}/>{!collapsed && 'Ver tienda'}
        </Link>
        <button className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-red-500 transition-colors ${collapsed ? 'justify-center' : ''}`}>
          <LogOut size={14}/>{!collapsed && 'Cerrar sesión'}
        </button>
      </div>
    </div>
  );

  return (
    <>
      <Head><title>{title} — Órbita</title></Head>
      <div className="flex h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden">
        <aside className={`hidden md:flex flex-col border-r border-slate-200 dark:border-white/8 bg-white dark:bg-slate-900/60 flex-shrink-0 transition-all duration-200 ${collapsed ? 'w-16' : 'w-56'}`}>
          <SidebarContent/>
        </aside>
        {mobileOpen && (
          <div className="md:hidden fixed inset-0 z-50 flex">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setMobileOpen(false)}/>
            <aside className="relative w-64 bg-white dark:bg-slate-900 h-full shadow-2xl">
              <button onClick={() => setMobileOpen(false)} className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-white/8">
                <X size={18} className="text-slate-500"/>
              </button>
              <SidebarContent onClose={() => setMobileOpen(false)}/>
            </aside>
          </div>
        )}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <header className="flex items-center gap-3 px-4 md:px-6 h-14 border-b border-slate-200 dark:border-white/8 bg-white dark:bg-slate-900/60 flex-shrink-0">
            <button className="md:hidden p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-white/8 text-slate-500" onClick={() => setMobileOpen(true)}>
              <Menu size={20}/>
            </button>
            <button className="hidden md:flex p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-white/8 text-slate-400" onClick={() => setCollapsed(c => !c)}>
              <Menu size={16}/>
            </button>
            <div className="flex-1"/>
            <button onClick={toggle} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-white/8 text-slate-500 dark:text-slate-400">
              {isDark ? <Sun size={18}/> : <Moon size={18}/>}
            </button>
            <button className="relative p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-white/8 text-slate-500 dark:text-slate-400">
              <Bell size={18}/>
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-blue-600"/>
            </button>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">M</div>
          </header>
          <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
      </div>
    </>
  );
}
