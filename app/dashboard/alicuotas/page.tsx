'use client';

import { useState } from 'react';
import { supabase } from '../../lib/supabase';

interface Distribucion {
  apartamento: string;
  coeficiente: number;
  monto: number;
}

const PASOS_DISTRIBUCION = [
  { titulo: 'Gasto común', descripcion: 'El monto total del condominio a repartir.' },
  { titulo: 'Coeficiente de cada unidad', descripcion: 'La participación de cada apartamento en los gastos comunes.' },
  { titulo: 'Monto asignado', descripcion: 'Lo que cada unidad debe pagar, según monto × coeficiente.' },
];

function PencilIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5z" />
      <path d="M15 5l4 4" />
    </svg>
  );
}

function CalculatorIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="4" y="2" width="16" height="20" rx="2" />
      <line x1="8" y1="6" x2="16" y2="6" />
      <path d="M8 13h.01M12 13h.01M16 13h.01M8 17h.01M12 17h.01M16 17h.01" />
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

function CheckIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 6L9 17l-5-5" />
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

function HomeIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 10.5L12 3l9 7.5" />
      <path d="M5 9.5V21h14V9.5" />
      <path d="M9 21v-6h6v6" />
    </svg>
  );
}

export default function AlicuotasPage() {
  const [descripcion, setDescripcion] = useState('');
  const [montoTotal, setMontoTotal] = useState('');
  const [distribucion, setDistribucion] = useState<Distribucion[]>([]);
  const [generando, setGenerando] = useState(false);
  const [error, setError] = useState('');

   async function generarAlicuotas() {
    setError('');
    const monto = Number(montoTotal);
    if (!monto || monto <= 0) {
      setError('Ingresa un monto válido.');
      return;
    }
    setGenerando(true);

    const { data: unidades, error: unidadesError } = await supabase
      .from('unidades')
      .select('id, numero_apartamento, coeficiente, saldo_deudor');

    if (unidadesError || !unidades || unidades.length === 0) {
      setError('No se pudieron cargar las unidades.');
      setGenerando(false);
      return;
    }

    const mes = new Date().toLocaleDateString('es-VE', { month: 'long', year: 'numeric' });

    const filas = unidades.map((u) => ({
      unidad_id: u.id,
      mes,
      monto_total_condominio: monto,
      monto_unidad: Number((monto * u.coeficiente).toFixed(2)),
      fecha_generacion: new Date().toISOString(),
    }));

    const { error: insertError } = await supabase.from('alicuotas').insert(filas);

    if (insertError) {
      setError('Error al generar alícuotas: ' + insertError.message);
      setGenerando(false);
      return;
    }

    // Sumar cada alícuota al saldo deudor de su unidad
    for (const u of unidades) {
      const montoAsignado = Number((monto * u.coeficiente).toFixed(2));
      await supabase
        .from('unidades')
        .update({ saldo_deudor: Number((u.saldo_deudor + montoAsignado).toFixed(2)) })
        .eq('id', u.id);
    }

    setDistribucion(
      unidades.map((u) => ({
        apartamento: u.numero_apartamento,
        coeficiente: u.coeficiente,
        monto: Number((monto * u.coeficiente).toFixed(2)),
      }))
    );
    setDescripcion('');
    setMontoTotal('');
    setGenerando(false);
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 fade-in">
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-brand-600 dark:text-brand-400">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-600 dark:bg-brand-400"></span>
          Administración financiera
        </div>
        <h1 className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Gestión de alícuotas</h1>
        <p className="mt-1.5 text-sm sm:text-base text-slate-500 dark:text-slate-400">
          Distribuye los gastos comunes de forma proporcional según el coeficiente de cada unidad.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_340px] items-start">
        <div className="rounded-2xl border border-slate-200/70 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 sm:p-6 shadow-card">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Registrar gasto común</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Define el gasto del mes y NeoHome lo repartirá automáticamente entre las unidades.
          </p>

          <div className="mt-5 grid gap-5 sm:grid-cols-[1fr_240px]">
            <div>
              <label htmlFor="desc-alicuota" className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Descripción
              </label>
              <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">El gasto común que se está registrando.</p>
              <div className="relative mt-2">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                  <PencilIcon />
                </span>
                <input
                  id="desc-alicuota"
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  placeholder="Pintura exterior"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-shadow placeholder:text-slate-400"
                />
              </div>
            </div>

            <div>
              <label htmlFor="monto-alicuota" className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Monto total
              </label>
              <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">El gasto total del condominio a distribuir.</p>
              <div className="relative mt-2">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold text-slate-400 pointer-events-none">$</span>
                <input
                  id="monto-alicuota"
                  type="number"
                  value={montoTotal}
                  onChange={(e) => setMontoTotal(e.target.value)}
                  placeholder="475"
                  className="w-full pl-8 pr-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-lg font-bold tabular-nums outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-shadow placeholder:text-slate-400 placeholder:font-medium"
                />
              </div>
            </div>
          </div>

          <div className="mt-5 flex flex-col sm:flex-row sm:items-center gap-4 sm:justify-between">
            <p className="text-xs text-slate-400 dark:text-slate-500">
              La distribución se guardará en <span className="font-semibold text-slate-500 dark:text-slate-400">Alícuotas</span> y se sumará al saldo de cada unidad.
            </p>
            <button
              onClick={generarAlicuotas}
              disabled={generando}
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold shadow-card hover:shadow-card-hover transition-all disabled:opacity-60 disabled:hover:bg-brand-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 whitespace-nowrap"
            >
              {generando ? (
                <>
                  <SpinnerIcon />
                  Calculando distribución...
                </>
              ) : (
                <>
                  <CalculatorIcon />
                  Generar Alícuotas
                </>
              )}
            </button>
          </div>

          {error && (
            <div className="mt-5 flex items-start gap-3 rounded-xl border border-red-200 dark:border-red-800 bg-red-50/70 dark:bg-red-950/30 px-4 py-3" role="alert">
              <span className="mt-0.5 text-red-500 dark:text-red-400 shrink-0">
                <AlertTriangleIcon />
              </span>
              <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-slate-200/70 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 sm:p-6 shadow-card">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-brand-600 dark:text-brand-400">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-600 dark:bg-brand-400"></span>
            Cálculo automático
          </div>
          <h2 className="mt-2 text-lg font-bold text-slate-900 dark:text-white">Cómo se distribuye</h2>

          <div className="mt-4 inline-flex items-center rounded-lg bg-brand-50 dark:bg-brand-900/40 border border-brand-100 dark:border-brand-800 px-3 py-1.5 text-xs font-mono font-semibold text-brand-700 dark:text-brand-300">
            monto × coeficiente = monto por unidad
          </div>

          <ol className="mt-4 space-y-4">
            {PASOS_DISTRIBUCION.map((paso, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="w-6 h-6 shrink-0 rounded-full bg-brand-600 text-white flex items-center justify-center text-[11px] font-bold mt-0.5">
                  {i + 1}
                </span>
                <div>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{paso.titulo}</p>
                  <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">{paso.descripcion}</p>
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-5 rounded-xl border border-teal-200/70 dark:border-teal-800/60 bg-teal-50/70 dark:bg-teal-950/30 px-4 py-3 flex items-start gap-2.5">
            <span className="mt-0.5 text-teal-600 dark:text-teal-400 shrink-0">
              <CheckIcon />
            </span>
            <p className="text-sm text-teal-800 dark:text-teal-300">
              <span className="font-semibold">NeoHome hace el cálculo por ti.</span>{' '}
              No necesitas calcular las alícuotas manualmente.
            </p>
          </div>
        </div>
      </div>

      {distribucion.length > 0 && (
        <section className="space-y-4 fade-in-up">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400"></span>
              Resultado final
            </div>
            <h2 className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Distribución generada</h2>
            <p className="mt-1.5 text-sm sm:text-base text-slate-500 dark:text-slate-400">
              El gasto fue repartido entre todas las unidades según su coeficiente.
            </p>
          </div>

          <div className="rounded-2xl shadow-card border border-slate-200/70 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden">
            <div className="px-5 sm:px-6 py-4 flex flex-wrap items-center gap-2.5 border-b border-slate-100 dark:border-slate-700">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-brand-50 dark:bg-brand-900/40 text-brand-700 dark:text-brand-300 border border-brand-100 dark:border-brand-800 text-xs font-semibold">
                {distribucion.length} unidad{distribucion.length !== 1 ? 'es' : ''}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold">
                <CheckIcon />
                Distribución generada correctamente
              </span>
            </div>

            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full min-w-[560px] text-sm">
                <thead>
                  <tr className="text-left text-[11px] uppercase tracking-wider text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-slate-700">
                    <th className="px-6 py-3.5 font-semibold">Unidad</th>
                    <th className="px-6 py-3.5 font-semibold">Coeficiente</th>
                    <th className="px-6 py-3.5 font-semibold text-right">Monto Asignado</th>
                  </tr>
                </thead>
                <tbody>
                  {distribucion.map((d, i) => (
                    <tr key={i} className="border-b border-slate-100 dark:border-slate-700 last:border-0 hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 text-xs font-semibold">
                          <HomeIcon />
                          <span className="mt-px">Apt {d.apartamento}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-medium text-slate-700 dark:text-slate-200 tabular-nums">{d.coeficiente}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <span className="text-base font-bold text-slate-900 dark:text-white tabular-nums">${d.monto.toFixed(2)}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="sm:hidden divide-y divide-slate-100 dark:divide-slate-700/60">
              {distribucion.map((d, i) => (
                <div key={i} className="px-5 py-4 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 text-xs font-semibold">
                      <HomeIcon />
                      <span className="mt-px">Apt {d.apartamento}</span>
                    </span>
                    <p className="mt-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">Coeficiente</p>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-200 tabular-nums">{d.coeficiente}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">Monto asignado</p>
                    <p className="text-lg font-bold text-slate-900 dark:text-white tabular-nums">${d.monto.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}