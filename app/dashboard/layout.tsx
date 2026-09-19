'use client';

import { useState, useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '../lib/supabase';
import ThemeToggle from '../components/ThemeToggle';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Resumen', icon: '📊' },
  { href: '/dashboard/conciliacion', label: 'Conciliación', icon: '🧾' },
  { href: '/dashboard/morosidad', label: 'Morosidad', icon: '⚠️' },
  { href: '/dashboard/alicuotas', label: 'Alícuotas', icon: '🧮' },
  { href: '/dashboard/residentes', label: 'Residentes', icon: '👥' },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [nombre, setNombre] = useState('Junta de Condominio');
  const [panelOpen, setPanelOpen] = useState(false);
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

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      <aside className="w-64 bg-slate-900 text-white flex flex-col flex-shrink-0">
        <div className="h-16 flex items-center px-6 border-b border-slate-800">
          <img src="/logo-badge.png" alt="NeoHome" className="w-8 h-8 rounded-lg mr-2" />
          <span className="font-bold text-lg tracking-wide">NeoHome</span>
        </div>
        <nav className="flex-1 py-4 space-y-1 px-3">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`w-full flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  active ? 'bg-slate-800 text-white' : 'text-slate-400 hover:bg-slate-800'
                }`}
              >
                <span className="mr-3">{item.icon}</span> {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-slate-800">
          <button onClick={handleLogout} className="w-full flex items-center px-3 py-2 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
            🚪 Cerrar sesión
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-end px-6 gap-3 flex-shrink-0 transition-colors duration-300">
          <ThemeToggle />
          <div className="relative">
            <button onClick={() => setPanelOpen(!panelOpen)} className="flex items-center gap-3">
              <span className="hidden sm:block text-sm font-semibold text-slate-700 dark:text-slate-200">{nombre}</span>
              {avatarUrl ? (
                <img src={avatarUrl} className="w-9 h-9 rounded-full object-cover border border-teal-200 dark:border-teal-800" />
              ) : (
                <div className="w-9 h-9 rounded-full bg-teal-100 dark:bg-teal-900 text-teal-700 dark:text-teal-300 flex items-center justify-center font-bold border border-teal-200 dark:border-teal-800">
                  👤
                </div>
              )}
            </button>

            {panelOpen && (
              <div className="absolute right-0 top-12 w-72 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl p-5 fade-in z-30">
                <div className="flex flex-col items-center text-center mb-4">
                  <button onClick={() => fileInputRef.current?.click()} className="relative group mb-3">
                    {avatarUrl ? (
                      <img src={avatarUrl} className="w-16 h-16 rounded-full object-cover border-2 border-teal-200 dark:border-teal-700" />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-teal-100 dark:bg-teal-900 text-teal-700 dark:text-teal-300 flex items-center justify-center text-2xl border-2 border-teal-200 dark:border-teal-700">
                        👤
                      </div>
                    )}
                  </button>
                  <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
                  <p className="font-semibold text-slate-800 dark:text-white">{nombre}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Administrador</p>
                </div>
                <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-700">
                  <div>
                    <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Teléfono móvil</label>
                    <input
                      value={telefono}
                      onChange={(e) => setTelefono(e.target.value)}
                      placeholder="0414-1234567"
                      className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white outline-none focus:border-teal-500"
                    />
                  </div>
                  <button onClick={handleSaveProfile} className="w-full bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium py-2 rounded-lg transition-colors">
                    Guardar cambios
                  </button>
                  {saved && <p className="text-xs text-green-600 dark:text-green-400 text-center">✓ Datos actualizados</p>}
                </div>
              </div>
            )}
          </div>
        </header>

        <main className="flex-1 overflow-auto p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}