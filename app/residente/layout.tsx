'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../lib/supabase';
import ThemeToggle from '../components/ThemeToggle';

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
      <header className="h-16 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between px-6">
        <div className="flex items-center gap-2">
          <img src="/logo-badge.png" alt="NeoHome" className="w-8 h-8 rounded-lg" />
          <span className="font-bold text-slate-800 dark:text-white">NeoHome</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden sm:block text-sm text-slate-600 dark:text-slate-300">{nombre}</span>
          <ThemeToggle />
          <button onClick={handleLogout} className="text-slate-500 dark:text-slate-400 hover:text-red-500 transition-colors">
            🚪
          </button>
        </div>
      </header>
      <main className="p-6 lg:p-8">{children}</main>
    </div>
  );
}