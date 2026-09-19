'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

function BanknoteIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="6" width="20" height="12" rx="2" />
      <circle cx="12" cy="12" r="2" />
      <path d="M6 12h.01M18 12h.01" />
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

function ExchangeIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M17 1l4 4-4 4" />
      <path d="M3 11V9a4 4 0 0 1 4-4h14" />
      <path d="M7 23l-4-4 4-4" />
      <path d="M21 13v2a4 4 0 0 1-4 4H3" />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4z" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

function AlertTriangleIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </svg>
  );
}

function SpinnerIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4" />
      <path d="M12 8h.01" />
    </svg>
  );
}

export default function DashboardPage() {
  const [totalCobrado, setTotalCobrado] = useState(0);
  const [porcentajeMorosidad, setPorcentajeMorosidad] = useState(0);
  const [alicuotaPromedio, setAlicuotaPromedio] = useState(0);
  const [tasaBcv, setTasaBcv] = useState('');
  const [editandoTasa, setEditandoTasa] = useState(false);
  const [guardandoTasa, setGuardandoTasa] = useState(false);
  const [mensajeTasa, setMensajeTasa] = useState('');
  const [loading, setLoading] = useState(true);

  async function cargarTasa() {
    const { data } = await supabase
      .from('configuracion')
      .select('valor')
      .eq('clave', 'tasa_bcv')
      .single();
    if (data) setTasaBcv(data.valor);
  }

  useEffect(() => {
    async function cargar() {
      const inicioMes = new Date();
      inicioMes.setDate(1);
      inicioMes.setHours(0, 0, 0, 0);

      const { data: pagos } = await supabase
        .from('pagos')
        .select('monto_equivalente_usd, fecha, estado')
        .eq('estado', 'conciliado')
        .gte('fecha', inicioMes.toISOString());

      setTotalCobrado((pagos ?? []).reduce((s, p) => s + (p.monto_equivalente_usd ?? 0), 0));

      const { data: unidades } = await supabase.from('unidades').select('saldo_deudor');
      const total = unidades?.length ?? 0;
      const morosas = (unidades ?? []).filter((u) => u.saldo_deudor > 0).length;
      setPorcentajeMorosidad(total > 0 ? Number(((morosas / total) * 100).toFixed(1)) : 0);

      const { data: alicuotas } = await supabase
        .from('alicuotas')
        .select('monto_unidad')
        .gte('fecha_generacion', inicioMes.toISOString());

      const promedio = alicuotas?.length
        ? alicuotas.reduce((s, a) => s + (a.monto_unidad ?? 0), 0) / alicuotas.length
        : 0;
      setAlicuotaPromedio(promedio);

      await cargarTasa();
      setLoading(false);
    }
    cargar();
  }, []);

  async function guardarTasa() {
    const valor = Number(tasaBcv);
    if (!valor || valor <= 0) {
      setMensajeTasa('Ingresa un valor válido.');
      return;
    }
    setGuardandoTasa(true);
    setMensajeTasa('');

    const { error } = await supabase
      .from('configuracion')
      .update({ valor: String(valor), updated_at: new Date().toISOString() })
      .eq('clave', 'tasa_bcv');

    if (error) {
      setMensajeTasa('Error: ' + error.message);
    } else {
      setMensajeTasa('✓ Tasa actualizada');
      setEditandoTasa(false);
      setTimeout(() => setMensajeTasa(''), 2500);
    }
    setGuardandoTasa(false);
  }

  const esExitoTasa = mensajeTasa.startsWith('✓');

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto space-y-8 fade-in animate-pulse" aria-hidden="true">
        <div>
          <div className="h-3 w-40 rounded-full bg-slate-200 dark:bg-slate-700"></div>
          <div className="mt-3 h-8 w-64 rounded-lg bg-slate-200 dark:bg-slate-700"></div>
          <div className="mt-2 h-4 w-80 max-w-full rounded-full bg-slate-200 dark:bg-slate-700"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5">
          <div className="md:col-span-2 h-44 rounded-2xl bg-slate-200 dark:bg-slate-700"></div>
          <div className="h-44 rounded-2xl bg-slate-200 dark:bg-slate-700"></div>
          <div className="h-44 rounded-2xl bg-slate-200 dark:bg-slate-700"></div>
          <div className="md:col-span-2 xl:col-span-4 h-36 rounded-2xl bg-slate-200 dark:bg-slate-700"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 fade-in relative">
      <div aria-hidden="true" className="pointer-events-none absolute -top-16 left-1/2 -translate-x-1/2 h-64 w-[60rem] max-w-full rounded-full bg-brand-200/40 dark:bg-brand-500/10 blur-3xl"></div>
      <div aria-hidden="true" className="pointer-events-none absolute top-24 -right-20 h-56 w-56 rounded-full bg-teal-200/30 dark:bg-teal-500/10 blur-3xl"></div>
      <div aria-hidden="true" className="pointer-events-none absolute top-72 -left-24 h-64 w-64 rounded-full bg-lavender-200/30 dark:bg-lavender-500/10 blur-3xl"></div>

      <div className="relative">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-brand-600 dark:text-brand-400">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-600 dark:bg-brand-400"></span>
          Panel del administrador
        </div>
        <h1 className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Resumen financiero
        </h1>
        <p className="mt-1.5 text-sm sm:text-base text-slate-500 dark:text-slate-400">
          Control económico del condominio · Período del mes en curso
        </p>
      </div>

      <div className="relative grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5">
        <div className="relative md:col-span-2 overflow-hidden rounded-2xl border border-slate-200/70 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 sm:p-7 shadow-card">
          <div aria-hidden="true" className="pointer-events-none absolute top-0 right-0 h-full w-1/2 overflow-hidden">
            <div className="absolute top-1/3 right-0 h-44 w-44 rounded-full bg-brand-100/80 dark:bg-brand-500/10 blur-2xl translate-x-1/3"></div>
            <div className="absolute bottom-8 right-12 h-10 w-10 rounded-xl border border-brand-200/70 dark:border-brand-500/20 rotate-12"></div>
            <div className="absolute top-10 right-24 h-6 w-6 rounded-lg bg-teal-100/70 dark:bg-teal-500/10 -rotate-6"></div>
          </div>

          <div className="relative">
            <div className="flex items-center gap-3">
              <span className="w-11 h-11 rounded-xl bg-gradient-to-br from-brand-600 to-navy-700 text-white flex items-center justify-center shadow-card">
                <BanknoteIcon />
              </span>
              <div>
                <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Total cobrado este mes</p>
              </div>
            </div>
            <p className="mt-5 text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white tabular-nums">
              ${totalCobrado.toFixed(2)}
            </p>
            <div className="mt-4 flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-brand-700 dark:text-brand-300">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-600 dark:bg-brand-400"></span>
                Recaudación actual
              </span>
              <span className="text-xs text-slate-400 dark:text-slate-500">· Pagos conciliados del mes</span>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/70 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 sm:p-7 shadow-card">
          <div className="flex items-center gap-3">
            <span className="w-11 h-11 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center ring-1 ring-amber-100 dark:ring-amber-800/60">
              <TrendingDownIcon />
            </span>
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">% de morosidad</p>
          </div>
          <p className="mt-5 text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white tabular-nums">
            {porcentajeMorosidad}%
          </p>
          <p className="mt-4 text-xs font-medium text-amber-700 dark:text-amber-400">
            Unidades con saldo pendiente
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200/70 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 sm:p-7 shadow-card">
          <div className="flex items-center gap-3">
            <span className="w-11 h-11 rounded-xl bg-royal-50 dark:bg-royal-900/40 text-royal-600 dark:text-royal-400 flex items-center justify-center ring-1 ring-royal-100 dark:ring-royal-800/60">
              <CalculatorIcon />
            </span>
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Alícuota promedio</p>
          </div>
          <p className="mt-5 text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white tabular-nums">
            ${alicuotaPromedio.toFixed(2)}
          </p>
          <p className="mt-4 text-xs font-medium text-royal-700 dark:text-royal-400">
            Alícuotas generadas en el mes
          </p>
        </div>

        <div className="relative md:col-span-2 xl:col-span-4 rounded-2xl border border-teal-200/70 dark:border-teal-800/60 bg-white dark:bg-slate-800 p-6 sm:p-7 shadow-card">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
            <div className="flex items-center gap-3">
              <span className="w-11 h-11 rounded-xl bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400 flex items-center justify-center ring-1 ring-teal-100 dark:ring-teal-800/60">
                <ExchangeIcon />
              </span>
              <div>
                <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Tasa BCV</p>
                <p className="text-xs text-slate-400 dark:text-slate-500">Bs/USD · Referencia oficial configurable</p>
              </div>
            </div>

            {editandoTasa ? (
              <div className="w-full lg:w-auto lg:min-w-[360px]">
                <div className="flex gap-2.5">
                  <input
                    type="number"
                    value={tasaBcv}
                    onChange={(e) => setTasaBcv(e.target.value)}
                    step="0.01"
                    aria-label="Tasa BCV"
                    className="w-full flex-1 px-3.5 py-2.5 text-lg font-bold rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-shadow tabular-nums"
                  />
                  <button
                    onClick={guardarTasa}
                    disabled={guardandoTasa}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:opacity-60 disabled:hover:bg-brand-600 text-white text-sm font-semibold shadow-card hover:shadow-card-hover transition-all"
                  >
                    {guardandoTasa && <SpinnerIcon />}
                    {guardandoTasa ? 'Guardando' : 'Guardar'}
                  </button>
                  <button
                    onClick={() => { setEditandoTasa(false); cargarTasa(); setMensajeTasa(''); }}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                  >
                    <XIcon />
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <p className="text-3xl font-extrabold tracking-tight text-teal-600 dark:text-teal-400 tabular-nums">
                  Bs. {Number(tasaBcv || 0).toFixed(2)}
                </p>
                <button
                  onClick={() => setEditandoTasa(true)}
                  disabled={guardandoTasa}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                >
                  <EditIcon />
                  Editar
                </button>
              </div>
            )}
          </div>

          {mensajeTasa && (
            <div
              className={`mt-4 flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium fade-in ${
                esExitoTasa
                  ? 'border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400'
                  : 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400'
              }`}
            >
              {esExitoTasa ? <CheckIcon /> : <AlertTriangleIcon />}
              <span>{mensajeTasa.replace('✓ ', '')}</span>
            </div>
          )}
        </div>
      </div>

      <section className="relative rounded-2xl border border-slate-200/70 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/40 p-6 sm:p-7">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
          <InfoIcon />
          Cómo se compone este resumen
        </div>
        <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-5">
          <div>
            <p className="text-sm font-semibold text-slate-800 dark:text-white">Total cobrado</p>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Suma de los pagos conciliados durante el mes en curso.
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-800 dark:text-white">Morosidad</p>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Porcentaje de unidades con saldo pendiente sobre el total registrado.
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-800 dark:text-white">Alícuota promedio</p>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Promedio de los montos de alícuota generados en el período actual.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}