'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

type Unidad = {
  id: string;
  numero_apartamento: string;
  usuario_id: string | null;
};

function UserIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

function KeyIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 2l-9.6 9.6" />
      <circle cx="7.5" cy="15.5" r="5.5" />
      <path d="M15.5 7.5l3 3L22 7l-3-3" />
    </svg>
  );
}

function HomeIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 10.5L12 3l9 7.5" />
      <path d="M5 9.5V21h14V9.5" />
      <path d="M9 21v-6h6v6" />
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

function UserPlusIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M19 8v6M22 11h-6" />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4M12 8h.01" />
    </svg>
  );
}

function CheckCircleIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <path d="M22 4L12 14.01l-3-3" />
    </svg>
  );
}

function AlertTriangleIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </svg>
  );
}

function SpinnerIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}

export default function ResidentesPage() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [apartamento, setApartamento] = useState('');
  const [unidades, setUnidades] = useState<Unidad[]>([]);
  const [enviando, setEnviando] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  async function cargarUnidades() {
    const { data } = await supabase
      .from('unidades')
      .select('id, numero_apartamento, usuario_id')
      .is('usuario_id', null)
      .order('numero_apartamento');
    setUnidades(data || []);
  }

  useEffect(() => {
    cargarUnidades();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setMensaje('');
    setEnviando(true);

    const res = await fetch('/api/admin/crear-residente', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, email, password, numero_apartamento: apartamento }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || 'Error al crear residente');
    } else {
      setMensaje('✓ ' + data.mensaje);
      setNombre('');
      setEmail('');
      setPassword('');
      setApartamento('');
      await cargarUnidades();
    }
    setEnviando(false);
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 fade-in">
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-brand-600 dark:text-brand-400">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-600 dark:bg-brand-400"></span>
          Gestión de cuentas
        </div>
        <h1 className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Registrar residente</h1>
        <p className="mt-1.5 text-sm sm:text-base text-slate-500 dark:text-slate-400">
          Añade un nuevo residente y asígnalo a una unidad disponible.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-card border border-slate-200/70 dark:border-slate-700 p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-7">
          <section>
            <div className="flex items-center gap-3">
              <span className="w-9 h-9 shrink-0 rounded-xl bg-brand-50 dark:bg-brand-900/40 text-brand-600 dark:text-brand-400 border border-brand-100 dark:border-brand-800 flex items-center justify-center">
                <UserIcon />
              </span>
              <div>
                <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100">Información del residente</h2>
                <p className="text-xs text-slate-400 dark:text-slate-500">Datos personales del nuevo residente.</p>
              </div>
            </div>

            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="res-nombre" className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Nombre completo
                </label>
                <div className="relative mt-2">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                    <UserIcon />
                  </span>
                  <input
                    id="res-nombre"
                    type="text"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    placeholder="Ej: María González"
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-shadow placeholder:text-slate-400"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="res-email" className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Email
                </label>
                <div className="relative mt-2">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                    <MailIcon />
                  </span>
                  <input
                    id="res-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="residente@neohome.com"
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-shadow placeholder:text-slate-400"
                    required
                  />
                </div>
              </div>
            </div>
          </section>

          <div className="border-t border-slate-100 dark:border-slate-700"></div>

          <section>
            <div className="flex items-center gap-3">
              <span className="w-9 h-9 shrink-0 rounded-xl bg-navy-50 dark:bg-navy-900/40 text-navy-600 dark:text-navy-400 border border-navy-100 dark:border-navy-800 flex items-center justify-center">
                <KeyIcon />
              </span>
              <div>
                <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100">Credenciales de acceso</h2>
                <p className="text-xs text-slate-400 dark:text-slate-500">Contraseña temporal para el primer acceso.</p>
              </div>
            </div>

            <div className="mt-5">
              <label htmlFor="res-password" className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Contraseña temporal
              </label>
              <div className="relative mt-2">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                  <KeyIcon />
                </span>
                <input
                  id="res-password"
                  type="text"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Ej: neo123"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-shadow placeholder:text-slate-400"
                  required
                />
              </div>
              <div className="mt-2.5 flex items-start gap-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700 px-3 py-2.5">
                <span className="mt-0.5 text-slate-400 dark:text-slate-500 shrink-0">
                  <InfoIcon />
                </span>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Mínimo 6 caracteres. Compártela con el residente.
                </p>
              </div>
            </div>
          </section>

          <div className="border-t border-slate-100 dark:border-slate-700"></div>

          <section>
            <div className="flex items-center gap-3">
              <span className="w-9 h-9 shrink-0 rounded-xl bg-royal-50 dark:bg-royal-900/40 text-royal-600 dark:text-royal-400 border border-royal-200 dark:border-royal-800 flex items-center justify-center">
                <HomeIcon />
              </span>
              <div>
                <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100">Asignación de unidad</h2>
                <p className="text-xs text-slate-400 dark:text-slate-500">Únicamente se muestran unidades libres.</p>
              </div>
            </div>

            <div className="mt-5">
              <label htmlFor="res-apartamento" className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Apartamento
              </label>
              <div className="relative mt-2">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                  <HomeIcon />
                </span>
                <select
                  id="res-apartamento"
                  value={apartamento}
                  onChange={(e) => setApartamento(e.target.value)}
                  className="w-full appearance-none pl-11 pr-10 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-shadow cursor-pointer"
                  required
                >
                  <option value="">Selecciona una unidad...</option>
                  {unidades.map((u) => (
                    <option key={u.id} value={u.numero_apartamento}>
                      Apt {u.numero_apartamento}
                    </option>
                  ))}
                </select>
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                  <ChevronDownIcon />
                </span>
              </div>
              {unidades.length === 0 && (
                <div className="mt-2.5 flex items-start gap-2 rounded-lg border border-amber-200/70 dark:border-amber-800/60 bg-amber-50/70 dark:bg-amber-950/30 px-3 py-2.5">
                  <span className="mt-0.5 text-amber-600 dark:text-amber-400 shrink-0">
                    <InfoIcon />
                  </span>
                  <p className="text-xs text-amber-800 dark:text-amber-300">
                    No hay unidades libres. Todas están asignadas.
                  </p>
                </div>
              )}
            </div>
          </section>

          {(nombre.trim() || apartamento) && (
            <div className="rounded-xl border border-slate-200/70 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/60 p-4 grid grid-cols-2 gap-4 sm:gap-6">
              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">Residente</p>
                <p className="mt-0.5 text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">{nombre || '—'}</p>
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">Unidad</p>
                <p className="mt-0.5 text-sm font-semibold text-slate-800 dark:text-slate-100">{apartamento ? `Apt ${apartamento}` : '—'}</p>
              </div>
            </div>
          )}

          {error && (
            <div className="rounded-xl border border-red-200 dark:border-red-800 bg-red-50/70 dark:bg-red-950/30 px-4 py-3 flex items-start gap-3" role="alert">
              <span className="mt-0.5 text-red-500 dark:text-red-400 shrink-0">
                <AlertTriangleIcon />
              </span>
              <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
            </div>
          )}

          {mensaje && (
            <div className="rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50/70 dark:bg-emerald-950/30 px-4 py-3 flex items-start gap-3" role="status">
              <span className="mt-0.5 text-emerald-500 dark:text-emerald-400 shrink-0">
                <CheckCircleIcon />
              </span>
              <p className="text-sm text-emerald-700 dark:text-emerald-300">{mensaje}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={enviando}
            className="w-full inline-flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 disabled:opacity-60 disabled:hover:bg-brand-600 text-white font-semibold py-3.5 rounded-xl shadow-card hover:shadow-card-hover transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
          >
            {enviando ? (
              <>
                <SpinnerIcon />
                Creando...
              </>
            ) : (
              <>
                <UserPlusIcon />
                Crear residente
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}