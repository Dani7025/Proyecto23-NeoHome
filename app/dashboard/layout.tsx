'use client';

import { useState, useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '../lib/supabase';
import ThemeToggle from '../components/ThemeToggle';

function GridIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}

function FileCheckIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6" />
      <path d="M9 15l2 2 4-4" />
    </svg>
  );
}

function TrendingDownIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M23 6l-9.5 9.5-5-5L1 18" />
      <path d="M17 18h6v-6" />
    </svg>
  );
}

function CalculatorIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="4" y="2" width="16" height="20" rx="2" />
      <path d="M8 6h8" />
      <path d="M8 12h.01M12 12h.01M16 12h.01M8 16h.01M12 16h.01M16 16h.01M8 20h.01M12 20h.01" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function PowerIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 12h18M3 6h18M3 18h18" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

const NAV_ICONS = {
  resumen: GridIcon,
  conciliacion: FileCheckIcon,
  morosidad: TrendingDownIcon,
  alicuotas: CalculatorIcon,
  residentes: UsersIcon,
};

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Resumen', icon: 'resumen' as keyof typeof NAV_ICONS },
  { href: '/dashboard/conciliacion', label: 'Conciliación', icon: 'conciliacion' as keyof typeof NAV_ICONS },
  { href: '/dashboard/morosidad', label: 'Morosidad', icon: 'morosidad' as keyof typeof NAV_ICONS },
  { href: '/dashboard/alicuotas', label: 'Alícuotas', icon: 'alicuotas' as keyof typeof NAV_ICONS },
  { href: '/dashboard/residentes', label: 'Residentes', icon: 'residentes' as keyof typeof NAV_ICONS },
];

const GRUPOS = [
  { titulo: 'Principal', items: ['/dashboard', '/dashboard/conciliacion', '/dashboard/morosidad'] },
  { titulo: 'Administración', items: ['/dashboard/alicuotas', '/dashboard/residentes'] },
];

function SidebarContent({
  pathname,
  nombre,
  onNavigate,
  onLogout,
}: {
  pathname: string;
  nombre: string;
  onNavigate?: () => void;
  onLogout: () => void;
}) {
  return (
    <div className="flex flex-col h-full w-full bg-gradient-to-b from-navy-800 via-navy-900 to-teal-900 text-white">
      <div className="flex items-center gap-3 px-6 py-6 border-b border-white/[0.06]">
        <span className="relative shrink-0">
          <img
            src="/logo-badge.png"
            alt="NeoHome"
            className="w-10 h-10 rounded-xl object-cover ring-1 ring-white/15 shadow-lg"
          />
          <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-teal-400 ring-2 ring-navy-900"></span>
        </span>
        <div className="min-w-0">
          <p className="text-lg font-bold tracking-tight leading-none">NeoHome</p>
          <p className="mt-1 text-[11px] font-medium text-slate-400 leading-none tracking-wide">
            Gestión Financiera Residencial
          </p>
        </div>
      </div>

      <nav aria-label="Menú principal" className="flex-1 overflow-y-auto px-3.5 py-6 space-y-6">
        {GRUPOS.map((grupo) => (
          <div key={grupo.titulo}>
            <p className="px-3 mb-2 text-[11px] font-semibold uppercase tracking-widest text-slate-500">
              {grupo.titulo}
            </p>
            <div className="space-y-1">
              {grupo.items.map((href) => {
                const item = NAV_ITEMS.find((i) => i.href === href)!;
                const Icon = NAV_ICONS[item.icon];
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onNavigate}
                    aria-current={active ? 'page' : undefined}
                    className={`relative w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                      active
                        ? 'bg-white/10 ring-1 ring-white/10 text-white'
                        : 'text-slate-400 hover:text-white hover:bg-white/[0.06]'
                    }`}
                  >
                    {active && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r-full bg-lavender-300"></span>
                    )}
                    <span
                      className={`w-8 h-8 shrink-0 rounded-lg flex items-center justify-center transition-colors duration-200 ${
                        active
                          ? 'bg-brand-500/30 text-lavender-200'
                          : 'bg-white/[0.04] text-slate-400 group-hover:text-white'
                      }`}
                    >
                      <Icon />
                    </span>
                    <span className="truncate">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="px-3.5 py-4 border-t border-white/10">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
        >
          <span className="w-8 h-8 shrink-0 rounded-lg bg-white/[0.04] text-slate-400 flex items-center justify-center">
            <PowerIcon />
          </span>
          <span>Cerrar sesión</span>
        </button>
      </div>
      <p className="px-6 pb-4 text-[11px] text-slate-500">
        {nombre} · Administrador
      </p>
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [nombre, setNombre] = useState('Junta de Condominio');
  const [panelOpen, setPanelOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [telefono, setTelefono] = useState('');
  const [saved, setSaved] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function checkAuth() {
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        router.push('/login');
        return;
      }
      const { data: perfil } = await supabase.from('usuarios').select('nombre, rol').eq('id', data.user.id).single();
      if (!perfil || perfil.rol !== 'admin') {
        router.push('/login');
        return;
      }
      setNombre(perfil.nombre);
    }
    checkAuth();
  }, [router]);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push('/');
  }

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setAvatarUrl(ev.target?.result as string);
    reader.readAsDataURL(file);
  }

  function handleSaveProfile() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  const itemActual = NAV_ITEMS.find((i) => i.href === pathname);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      <aside className="hidden lg:block w-72 flex-shrink-0">
        <SidebarContent pathname={pathname} nombre={nombre} onLogout={handleLogout} />
      </aside>

      <div
        className={`fixed inset-0 z-50 lg:hidden ${menuOpen ? '' : 'pointer-events-none'}`}
        aria-hidden={!menuOpen}
      >
        <div
          className={`absolute inset-0 bg-navy-900/70 backdrop-blur-[2px] transition-opacity duration-300 ${
            menuOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setMenuOpen(false)}
        ></div>
        <div
          className={`absolute left-0 top-0 h-full w-72 max-w-[85vw] shadow-pop transition-transform duration-300 ease-out ${
            menuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <button
            onClick={() => setMenuOpen(false)}
            aria-label="Cerrar menú"
            className="absolute top-4 right-4 z-10 w-9 h-9 rounded-lg flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-colors"
          >
            <XIcon />
          </button>
          <SidebarContent pathname={pathname} nombre={nombre} onNavigate={() => setMenuOpen(false)} onLogout={handleLogout} />
        </div>
      </div>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 bg-white/85 dark:bg-slate-900/70 backdrop-blur-md border-b border-slate-200/70 dark:border-slate-800 flex items-center gap-3 px-4 sm:px-6 flex-shrink-0 z-30 transition-colors duration-300">
          <button
            onClick={() => setMenuOpen(true)}
            aria-label="Abrir menú"
            className="lg:hidden w-10 h-10 rounded-xl flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
          >
            <MenuIcon />
          </button>

          <div className="hidden lg:block min-w-0">
            <p className="text-lg font-semibold tracking-tight text-slate-900 dark:text-white leading-none">
              {itemActual?.label ?? 'Panel'}
            </p>
            <p className="mt-1 text-xs text-slate-400 leading-none">Panel del Administrador</p>
          </div>

          <div className="ml-auto flex items-center gap-2 sm:gap-3">
            <ThemeToggle />
            <span className="hidden sm:block h-8 w-px bg-slate-200 dark:bg-slate-700"></span>

            <div className="relative">
              <button
                onClick={() => setPanelOpen(!panelOpen)}
                aria-expanded={panelOpen}
                aria-label="Abrir menú de perfil"
                className="flex items-center gap-2.5 sm:gap-3 p-1 pr-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
              >
                <span className="hidden sm:flex flex-col items-end leading-tight">
                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">{nombre}</span>
                  <span className="text-xs text-slate-400">Administrador</span>
                </span>
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt="Foto de perfil"
                    className="w-9 h-9 rounded-full object-cover ring-2 ring-white dark:ring-slate-700 shadow-sm"
                  />
                ) : (
                  <span className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-600 to-navy-600 text-white flex items-center justify-center text-sm font-bold shadow-sm">
                    {nombre.charAt(0).toUpperCase()}
                  </span>
                )}
                <ChevronDownIcon />
              </button>

              {panelOpen && (
                <>
                  <div className="fixed inset-0 z-20" onClick={() => setPanelOpen(false)} aria-hidden="true"></div>
                  <div className="absolute right-0 top-[calc(100%+0.5rem)] w-80 max-w-[calc(100vw-2rem)] bg-white dark:bg-slate-800 border border-slate-200/70 dark:border-slate-700 rounded-2xl shadow-pop p-6 fade-in z-30">
                    <div className="flex flex-col items-center text-center">
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        aria-label="Cambiar foto de perfil"
                        className="relative group mb-3"
                      >
                        {avatarUrl ? (
                          <img
                            src={avatarUrl}
                            alt="Foto de perfil"
                            className="w-20 h-20 rounded-full object-cover ring-2 ring-brand-200 dark:ring-brand-800 shadow-card"
                          />
                        ) : (
                          <span className="w-20 h-20 rounded-full bg-gradient-to-br from-brand-600 to-navy-600 text-white flex items-center justify-center text-2xl font-bold ring-2 ring-brand-200 dark:ring-brand-800 shadow-card">
                            {nombre.charAt(0).toUpperCase()}
                          </span>
                        )}
                        <span className="absolute inset-0 rounded-full flex items-center justify-center bg-navy-900/50 text-white opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-semibold">
                          <CameraIcon />
                        </span>
                      </button>
                      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
                      <p className="font-semibold text-slate-800 dark:text-white">{nombre}</p>
                      <p className="text-xs text-slate-400">Administrador</p>
                    </div>

                    <div className="mt-5 pt-5 space-y-4 border-t border-slate-100 dark:border-slate-700">
                      <div>
                        <label className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">
                          <PhoneIcon />
                          Teléfono móvil
                        </label>
                        <input
                          value={telefono}
                          onChange={(e) => setTelefono(e.target.value)}
                          placeholder="0414-1234567"
                          className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-shadow"
                        />
                      </div>
                      <button
                        onClick={handleSaveProfile}
                        className="w-full bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold py-2.5 rounded-xl shadow-card hover:shadow-card-hover transition-all"
                      >
                        Guardar cambios
                      </button>
                      {saved && (
                        <p className="flex items-center justify-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 fade-in">
                          <CheckIcon />
                          Datos actualizados
                        </p>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">{children}</main>
      </div>
    </div>
  );
}

function CameraIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.08.93.26 1.85.54 2.76a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.32-1.31a2 2 0 0 1 2.11-.45c.91.28 1.83.46 2.76.54A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}