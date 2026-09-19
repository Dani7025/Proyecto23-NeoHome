'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

interface Moroso {
  numero_apartamento: string;
  saldo_deudor: number;
  usuarios: { nombre: string } | null;
}

function HomeIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 10.5L12 3l9 7.5" />
      <path d="M5 9.5V21h14V9.5" />
      <path d="M9 21v-6h6v6" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <path d="M22 6l-10 7L2 6" />
    </svg>
  );
}

function CheckCircleIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <path d="M22 4L12 14.01l-3-3" />
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

export default function MorosidadPage() {
  const [morosos, setMorosos] = useState<Moroso[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function cargar() {
      const { data } = await supabase
        .from('unidades')
        .select('numero_apartamento, saldo_deudor, usuarios(nombre)')
        .gt('saldo_deudor', 0)
        .order('saldo_deudor', { ascending: false });

      setMorosos((data as unknown as Moroso[]) || []);
      setLoading(false);
    }
    cargar();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto space-y-6 fade-in">
        <div>
          <div className="h-2 w-28 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse"></div>
          <div className="mt-3 h-7 w-56 rounded-lg bg-slate-200 dark:bg-slate-700 animate-pulse"></div>
          <div className="mt-2 h-4 w-96 max-w-full rounded-lg bg-slate-100 dark:bg-slate-800 animate-pulse"></div>
        </div>

        <div className="flex items-center gap-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/70 dark:border-slate-700 shadow-card px-5 py-4">
          <span className="text-brand-600 dark:text-brand-400">
            <SpinnerIcon />
          </span>
          <p className="text-sm text-slate-500 dark:text-slate-400">Cargando...</p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-card border border-slate-200/70 dark:border-slate-700 divide-y divide-slate-100 dark:divide-slate-700/60">
          {[0, 1, 2, 3].map((n) => (
            <div key={n} className="flex items-center gap-6 px-6 py-4">
              <div className="h-7 w-16 rounded-lg bg-slate-100 dark:bg-slate-700/60 animate-pulse"></div>
              <div className="flex items-center gap-3 flex-1">
                <div className="h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-700/60 animate-pulse"></div>
                <div className="h-4 w-36 rounded bg-slate-100 dark:bg-slate-700/60 animate-pulse"></div>
              </div>
              <div className="h-6 w-24 rounded bg-slate-100 dark:bg-slate-700/60 animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const totalAdeudado = morosos.reduce((acc, u) => acc + (u.saldo_deudor ?? 0), 0);

  return (
    <div className="max-w-7xl mx-auto space-y-6 fade-in">
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-brand-600 dark:text-brand-400">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-600 dark:bg-brand-400"></span>
          Monitoreo financiero
        </div>
        <h1 className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Morosidad</h1>
        <p className="mt-1.5 text-sm sm:text-base text-slate-500 dark:text-slate-400">
          Revisa las unidades con saldo pendiente y prioriza la gestión de cuentas.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200/70 dark:border-slate-700 bg-gradient-to-r from-slate-50 via-white to-slate-50 dark:from-slate-800/60 dark:via-slate-800 dark:to-slate-800/60 p-4 sm:p-5 shadow-card flex flex-col md:flex-row md:items-center gap-4 md:justify-between">
        <div className="flex items-start gap-3">
          <span className="w-10 h-10 shrink-0 rounded-xl bg-teal-50 dark:bg-teal-900/40 text-teal-600 dark:text-teal-400 border border-teal-100 dark:border-teal-800 flex items-center justify-center">
            <HomeIcon />
          </span>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">Resumen de cuentas</p>
            <p className="mt-0.5 text-sm text-slate-600 dark:text-slate-300">
              Los saldos se ordenan de mayor a menor para priorizar la gestión de cobranza.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2.5 md:justify-end">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-brand-50 dark:bg-brand-900/40 text-brand-700 dark:text-brand-300 border border-brand-100 dark:border-brand-800 text-xs font-semibold">
            {morosos.length} unidad{morosos.length !== 1 ? 'es' : ''} con deuda
          </span>
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 text-xs font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
            Total adeudado ${totalAdeudado.toFixed(2)}
          </span>
        </div>
      </div>

      {morosos.length === 0 ? (
        <div className="rounded-2xl bg-white dark:bg-slate-800 shadow-card border border-slate-200/70 dark:border-slate-700 px-6 py-16 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-500 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800 flex items-center justify-center">
            <CheckCircleIcon />
          </div>
          <p className="mt-5 font-semibold text-slate-700 dark:text-slate-200">No hay unidades morosas.</p>
          <p className="mt-1 text-sm text-slate-400 dark:text-slate-500">Todas las unidades están al día con sus pagos.</p>
        </div>
      ) : (
        <>
          <div className="hidden sm:block bg-white dark:bg-slate-800 rounded-2xl shadow-card border border-slate-200/70 dark:border-slate-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px] text-sm">
                <thead>
                  <tr className="text-left text-[11px] uppercase tracking-wider text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-slate-700">
                    <th className="px-6 py-3.5 font-semibold">Unidad</th>
                    <th className="px-6 py-3.5 font-semibold">Residente</th>
                    <th className="px-6 py-3.5 font-semibold">Monto adeudado</th>
                    <th className="px-6 py-3.5 font-semibold">Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {morosos.map((u, i) => {
                    const inicial = (u.usuarios?.nombre ?? '-').trim().charAt(0).toUpperCase();
                    return (
                      <tr key={i} className="border-b border-slate-100 dark:border-slate-700 last:border-0 hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 text-xs font-semibold">
                            <HomeIcon />
                            <span className="mt-px">Apt {u.numero_apartamento}</span>
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <span className="w-8 h-8 shrink-0 rounded-full bg-gradient-to-br from-brand-600 to-navy-600 text-white flex items-center justify-center text-xs font-bold">
                              {inicial}
                            </span>
                            <span className="font-medium text-slate-800 dark:text-slate-100">
                              {u.usuarios?.nombre ?? '-'}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="leading-tight">
                            <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-red-500/80 dark:text-red-400/80">
                              <span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block"></span>
                              Saldo pendiente
                            </p>
                            <p className="mt-1 text-base font-bold text-slate-900 dark:text-white tabular-nums">${u.saldo_deudor.toFixed(2)}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            type="button"
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-300 dark:border-slate-600 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-700/60 hover:text-slate-900 dark:hover:text-white transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
                          >
                            <MailIcon />
                            Enviar recordatorio
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="sm:hidden space-y-3">
            {morosos.map((u, i) => {
              const inicial = (u.usuarios?.nombre ?? '-').trim().charAt(0).toUpperCase();
              return (
                <div key={i} className="rounded-2xl bg-white dark:bg-slate-800 shadow-card border border-slate-200/70 dark:border-slate-700 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 text-xs font-semibold">
                      <HomeIcon />
                      <span className="mt-px">Apt {u.numero_apartamento}</span>
                    </span>
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="w-8 h-8 shrink-0 rounded-full bg-gradient-to-br from-brand-600 to-navy-600 text-white flex items-center justify-center text-xs font-bold">
                        {inicial}
                      </span>
                      <span className="font-medium text-sm text-slate-800 dark:text-slate-100 truncate">
                        {u.usuarios?.nombre ?? '-'}
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 flex items-end justify-between gap-3 border-t border-slate-100 dark:border-slate-700 pt-3.5">
                    <div className="leading-tight">
                      <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-red-500/80 dark:text-red-400/80">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block"></span>
                        Saldo pendiente
                      </p>
                      <p className="mt-1 text-lg font-bold text-slate-900 dark:text-white tabular-nums">${u.saldo_deudor.toFixed(2)}</p>
                    </div>
                    <button
                      type="button"
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-300 dark:border-slate-600 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-700/60 hover:text-slate-900 dark:hover:text-white transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
                    >
                      <MailIcon />
                      Enviar recordatorio
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}