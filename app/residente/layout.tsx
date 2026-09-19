'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../lib/supabase';
import ThemeToggle from '../components/ThemeToggle';

function PowerIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
    </svg>
  );
}

export default function ResidenteLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [nombre, setNombre] = useState('Residente');

  useEffect(() => {
    async function checkAuth() {
      const { data } = await supabase.auth.getUser();
      if (!data.user) { router.push('/login'); return; }
      const { data: perfil } = await supabase.from('usuarios').select('nombre, rol').eq('id', data.user.id).single();
      if (!perfil || perfil.rol !== 'residente') { router.push('/login'); return; }
      setNombre(perfil.nombre);
    }
    checkAuth();
  }, [router]);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push('/');
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      <header className="sticky top-0 z-40 border-b border-slate-200/70 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img src="/logo-badge.png" alt="NeoHome" className="w-8 h-8 rounded-lg shadow-sm object-cover" />
            <span className="font-bold text-slate-900 dark:text-white tracking-tight">NeoHome</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden md:flex flex-col items-end leading-tight">
              <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">{nombre}</span>
              <span className="text-xs text-slate-500 dark:text-slate-400">Residente</span>
            </div>
            <span className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-600 to-navy-600 text-white flex items-center justify-center text-sm font-semibold shadow-sm shrink-0">
              {nombre.charAt(0).toUpperCase()}
            </span>
            <ThemeToggle />
            <button
              onClick={handleLogout}
              title="Cerrar sesión"
              aria-label="Cerrar sesión"
              className="w-9 h-9 flex items-center justify-center rounded-lg text-slate-400 dark:text-slate-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
            >
              <PowerIcon />
            </button>
          </div>
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-5 sm:px-8 py-6 sm:py-8 lg:py-10">{children}</main>
    </div>
  );
}