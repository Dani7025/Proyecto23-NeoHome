'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '../lib/supabase';
import ThemeToggle from '../components/ThemeToggle';

function ArrowLeftIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="M22 6l-10 7L2 6" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <path d="M1 1l22 22" />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 8v4M12 16h.01" />
    </svg>
  );
}

function SparkleIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3z" />
      <path d="M19 15l.9 2.1L22 18l-2.1.9L19 21l-.9-2.1L16 18l2.1-.9L19 15z" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 3l7 3v5c0 4.5-3 8.5-7 10-4-1.5-7-5.5-7-10V6l7-3z" />
      <path d="M12 9v4M12 16h.01" />
    </svg>
  );
}

function CalculatorIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="4" y="3" width="16" height="18" rx="2" />
      <rect x="7" y="7" width="10" height="4" rx="1" />
      <path d="M8 15h.01M12 15h.01M16 15h.01M8 18h.01M12 18h.01M16 18h.01" />
    </svg>
  );
}

const HIGHLIGHTS = [
  { icon: SparkleIcon, text: 'Conciliación automática con IA' },
  { icon: ShieldIcon, text: 'Control de morosidad en tiempo real' },
  { icon: CalculatorIcon, text: 'Cálculo de alícuotas por coeficiente' },
];

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({ email, password });

    if (authError || !authData.user) {
      setError('Correo o contraseña incorrectos.');
      setLoading(false);
      return;
    }

    const { data: perfil, error: perfilError } = await supabase
      .from('usuarios')
      .select('rol')
      .eq('id', authData.user.id)
      .single();

    if (perfilError || !perfil) {
      setError('Tu cuenta no tiene un perfil asociado en la tabla usuarios.');
      setLoading(false);
      return;
    }

    router.push(perfil.rol === 'admin' ? '/dashboard' : '/residente');
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300 lg:grid lg:grid-cols-2">
      {/* Lado de branding */}
      <aside className="relative flex flex-col justify-between overflow-hidden bg-gradient-to-br from-brand-800 via-brand-700 to-navy-900 px-6 sm:px-10 pt-6 pb-10 sm:pt-8 sm:pb-12 lg:h-screen lg:p-12">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(560px 300px at 12% 0%, rgba(150,129,217,0.28), transparent 60%), radial-gradient(520px 320px at 92% 100%, rgba(44,123,145,0.28), transparent 60%)',
            }}
          />
          <div className="hidden lg:block absolute -right-24 top-1/3 w-72 h-72 rounded-full border border-white/10" />
          <div className="hidden lg:block absolute -right-10 top-[calc(33%+56px)] w-40 h-40 rounded-full border border-white/10" />
          <div className="hidden lg:flex absolute bottom-16 left-12 gap-3">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="w-14 h-20 rounded-lg border border-white/10 bg-white/5" />
            ))}
          </div>
        </div>

        <div className="relative flex flex-col gap-8 lg:gap-10">
          <Link
            href="/"
            className="self-start inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-white/90 hover:text-white bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-colors"
          >
            <ArrowLeftIcon />
            <span className="hidden sm:inline">Volver</span>
          </Link>

          <div className="flex items-center gap-3">
            <img
              src="/logo-badge.png"
              alt="NeoHome"
              className="w-11 h-11 rounded-xl shadow-lg shadow-black/20 object-cover"
            />
            <div className="flex flex-col leading-tight">
              <span className="text-xl font-bold text-white tracking-tight">NeoHome</span>
              <span className="text-xs font-medium text-brand-200">Gestión Financiera Residencial</span>
            </div>
          </div>

          <div className="mt-2 lg:mt-4">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-[1.12]">
              Tu condominio,
              <br />
              bajo control.
            </h2>
            <p className="mt-4 max-w-md text-sm sm:text-base leading-relaxed text-brand-100/90">
              Accede a tu panel para conciliar pagos, revisar morosidad y administrar alícuotas de
              forma simple, ordenada y segura.
            </p>
          </div>

          <ul className="hidden sm:flex flex-col gap-3 mt-2">
            {HIGHLIGHTS.map((h) => (
              <li key={h.text} className="flex items-center gap-3 text-sm text-brand-100">
                <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-white/10 text-lavender-200">
                  <h.icon />
                </span>
                {h.text}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative hidden sm:block text-xs text-brand-200/70 mt-10">
          NeoHome · Plataforma de gestión financiera residencial
        </p>
      </aside>

      {/* Lado del formulario */}
      <main className="relative flex flex-col px-5 sm:px-8 py-6 sm:py-8 lg:py-0 lg:h-screen">
        <div className="flex justify-end">
          <ThemeToggle />
        </div>

        <div className="flex-1 flex items-center justify-center py-8">
          <div className="w-full max-w-md fade-in-up">
            <div className="bg-white dark:bg-slate-800/60 dark:backdrop-blur-sm border border-slate-200/80 dark:border-slate-700/80 rounded-2xl shadow-pop p-6 sm:p-8">
              <div className="mb-7">
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                  Bienvenido de nuevo
                </h1>
                <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
                  Ingresa tus datos para acceder a tu panel.
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-5">
                <div>
                  <label htmlFor="login-email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                    Correo electrónico
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500">
                      <MailIcon />
                    </span>
                    <input
                      id="login-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@condominio.com"
                      required
                      className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 transition-all outline-none focus:border-brand-600 dark:focus:border-brand-500 focus:ring-4 focus:ring-brand-600/10 dark:focus:ring-brand-500/15"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="login-password" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                    Contraseña
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500">
                      <LockIcon />
                    </span>
                    <input
                      id="login-password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full pl-11 pr-12 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 transition-all outline-none focus:border-brand-600 dark:focus:border-brand-500 focus:ring-4 focus:ring-brand-600/10 dark:focus:ring-brand-500/15"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                      title={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                    >
                      {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                    </button>
                  </div>
                </div>

                {error && (
                  <div
                    role="alert"
                    className="flex items-start gap-3 rounded-xl border border-red-200 dark:border-red-900/60 bg-red-50 dark:bg-red-950/40 px-4 py-3 fade-in"
                  >
                    <span className="text-red-500 dark:text-red-400 mt-0.5">
                      <AlertIcon />
                    </span>
                    <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 active:bg-brand-800 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold shadow-card hover:shadow-card-hover transition-all outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900"
                >
                  {loading && (
                    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-90" d="M4 12a8 8 0 0 1 8-8" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                    </svg>
                  )}
                  {loading ? 'Ingresando...' : 'Iniciar sesión'}
                </button>

                <p className="text-center text-xs text-slate-400 dark:text-slate-500">
                  Acceso para administradores y residentes de NeoHome.
                </p>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}