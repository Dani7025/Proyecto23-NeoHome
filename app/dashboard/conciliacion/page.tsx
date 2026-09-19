'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

interface ComprobanteRow {
  id: string;
  imagen_url: string;
  fecha_carga: string;
  unidad_id: string;
  unidades: {
    numero_apartamento: string;
    saldo_deudor: number;
    usuarios: { nombre: string } | null;
  } | null;
  pagos: {
    id: string;
    monto_equivalente_usd: number | null;
    referencia: string | null;
    estado: string;
    fecha: string;
    mensaje: string | null;
  }[];
}

const ESTADOS: Record<string, { label: string; classes: string; dot: string }> = {
  conciliado: {
    label: 'Conciliado',
    classes: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
    dot: 'bg-emerald-500',
  },
  abono_parcial: {
    label: 'Abono Parcial',
    classes: 'bg-royal-50 dark:bg-royal-900/40 text-royal-600 dark:text-royal-400 border-royal-200 dark:border-royal-800',
    dot: 'bg-royal-500',
  },
  discrepancia: {
    label: 'Discrepancia',
    classes: 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800',
    dot: 'bg-amber-500',
  },
  en_revision: {
    label: 'En Revisión',
    classes: 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800',
    dot: 'bg-amber-400',
  },
  rechazado: {
    label: 'Rechazado',
    classes: 'bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800',
    dot: 'bg-red-500',
  },
  pendiente: {
    label: 'Pendiente',
    classes: 'bg-slate-100 dark:bg-slate-700/60 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-600',
    dot: 'bg-slate-400',
  },
};

function SearchIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="11" cy="11" r="8" />
      <path d="M21 21l-4.35-4.35" />
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

function HomeIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 10.5L12 3l9 7.5" />
      <path d="M5 9.5V21h14V9.5" />
      <path d="M9 21v-6h6v6" />
    </svg>
  );
}

function FileTextIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6" />
      <path d="M16 13H8M16 17H8M10 9H8" />
    </svg>
  );
}

function ExternalLinkIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <path d="M15 3h6v6" />
      <path d="M10 14L21 3" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
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
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </svg>
  );
}

function SparklesIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 3l1.9 5.8L20 10l-6.1 1.2L12 17l-1.9-5.8L4 10l6.1-1.2z" />
      <path d="M19 14l.8 2.4L22 17l-2.2.6L19 20l-.8-2.4L16 17l2.2-.6z" />
    </svg>
  );
}

function InboxIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M22 12h-6l-2 3h-4l-2-3H2" />
      <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
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

function formatFecha(fecha: string) {
  return new Date(fecha).toLocaleDateString('es-VE', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function ConciliacionPage() {
  const [filas, setFilas] = useState<ComprobanteRow[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<ComprobanteRow | null>(null);
  const [processing, setProcessing] = useState(false);

  async function cargar() {
    const { data } = await supabase
      .from('comprobantes')
      .select(`
        id,
        imagen_url,
        fecha_carga,
        unidad_id,
        unidades ( numero_apartamento, saldo_deudor, usuarios ( nombre ) ),
        pagos ( id, monto_equivalente_usd, referencia, estado, fecha, mensaje )
      `)
      .order('fecha_carga', { ascending: false });

    setFilas((data as unknown as ComprobanteRow[]) || []);
    setLoading(false);
  }

  useEffect(() => {
    cargar();
  }, []);

  async function handleResolver(nuevoEstado: 'conciliado' | 'rechazado') {
    if (!selected) return;
    setProcessing(true);

    const pago = selected.pagos[0];
    if (!pago) {
      setProcessing(false);
      return;
    }

    const montoUsd = pago.monto_equivalente_usd ?? 0;

    if (nuevoEstado === 'conciliado') {
      // 1. Actualizar pago a conciliado
      await supabase
        .from('pagos')
        .update({
          estado: 'conciliado',
          mensaje: 'Resuelto manualmente por el administrador. Pago conciliado.',
        })
        .eq('id', pago.id);

      // 2. Marcar comprobante como extraído correctamente
      await supabase
        .from('comprobantes')
        .update({ estado_extraccion: 'extraido' })
        .eq('id', selected.id);

      // 3. Descontar el saldo de la unidad
      const saldoActual = selected.unidades?.saldo_deudor ?? 0;
      const nuevoSaldo = Math.max(0, Number((saldoActual - montoUsd).toFixed(2)));

      await supabase
        .from('unidades')
        .update({ saldo_deudor: nuevoSaldo })
        .eq('id', selected.unidad_id);
    } else {
      // Rechazar: solo cambiar estado y mensaje, no tocar saldo
      await supabase
        .from('pagos')
        .update({
          estado: 'rechazado',
          mensaje: 'Rechazado por el administrador tras revisión manual.',
        })
        .eq('id', pago.id);

      await supabase
        .from('comprobantes')
        .update({ estado_extraccion: 'rechazado' })
        .eq('id', selected.id);
    }

    setProcessing(false);
    setSelected(null);
    setLoading(true);
    await cargar();
  }

  const filtradas = filas.filter((f) => {
    const estado = f.pagos[0]?.estado ?? 'pendiente';
    const apto = (f.unidades?.numero_apartamento ?? '').toString();
    return apto.includes(busqueda) && (filtroEstado === 'todos' || estado === filtroEstado);
  });

  const conteoPorEstado = (estado: string) =>
    filas.filter((f) => (f.pagos[0]?.estado ?? 'pendiente') === estado).length;

  const estadosVisibles = Object.keys(ESTADOS).filter((k) => conteoPorEstado(k) > 0);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto space-y-6 fade-in animate-pulse" aria-hidden="true">
        <div>
          <div className="h-8 w-64 rounded-lg bg-slate-200 dark:bg-slate-700"></div>
          <div className="mt-2 h-4 w-80 max-w-full rounded-full bg-slate-200 dark:bg-slate-700"></div>
        </div>
        <div className="h-12 rounded-xl bg-slate-200 dark:bg-slate-700"></div>
        <div className="h-72 rounded-xl bg-slate-200 dark:bg-slate-700"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 fade-in">
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-brand-600 dark:text-brand-400">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-600 dark:bg-brand-400"></span>
          Centro de revisión
        </div>
        <h1 className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Conciliación de pagos</h1>
        <p className="mt-1.5 text-sm sm:text-base text-slate-500 dark:text-slate-400">
          Revisa y valida los comprobantes enviados por los residentes.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
            <SearchIcon />
          </span>
          <input
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar por unidad..."
            className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-shadow placeholder:text-slate-400"
          />
        </div>
        <div className="relative sm:w-56">
          <select
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
            className="w-full appearance-none pl-4 pr-10 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-shadow cursor-pointer"
          >
            <option value="todos">Todos los estados</option>
            <option value="conciliado">Conciliado</option>
            <option value="abono_parcial">Abono Parcial</option>
            <option value="discrepancia">Discrepancia</option>
            <option value="en_revision">En Revisión</option>
            <option value="rechazado">Rechazado</option>
            <option value="pendiente">Pendiente</option>
          </select>
          <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
            <ChevronDownIcon />
          </span>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200/70 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 sm:p-5 shadow-card">
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500 mr-1">
            Resumen
          </span>
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-brand-50 dark:bg-brand-900/40 text-brand-700 dark:text-brand-300 border border-brand-100 dark:border-brand-800 text-xs font-semibold">
            {filas.length} comprobante{filas.length !== 1 ? 's' : ''}
          </span>
          {estadosVisibles.map((k) => {
            const c = ESTADOS[k];
            return (
              <span
                key={k}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300"
              >
                <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`}></span>
                {conteoPorEstado(k)} {c.label}
              </span>
            );
          })}
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-card border border-slate-200/70 dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-sm">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-wider text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-slate-700">
                <th className="px-6 py-3.5 font-semibold">Unidad</th>
                <th className="px-6 py-3.5 font-semibold">Residente</th>
                <th className="px-6 py-3.5 font-semibold">Monto</th>
                <th className="px-6 py-3.5 font-semibold">Fecha</th>
                <th className="px-6 py-3.5 font-semibold">Estado</th>
                <th className="px-6 py-3.5 font-semibold">Comprobante</th>
                <th className="px-6 py-3.5 font-semibold">Acción</th>
              </tr>
            </thead>
            <tbody>
              {filtradas.map((f) => {
                const pago = f.pagos[0];
                const estado = pago?.estado ?? 'pendiente';
                const cfg = ESTADOS[estado] ?? ESTADOS.pendiente;
                const puedeResolver = estado === 'discrepancia' || estado === 'en_revision' || estado === 'pendiente';
                const inicial = (f.unidades?.usuarios?.nombre ?? '-').trim().charAt(0).toUpperCase();
                return (
                  <tr key={f.id} className="border-b border-slate-100 dark:border-slate-700 last:border-0 hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 text-xs font-semibold">
                        <HomeIcon />
                        Apt {f.unidades?.numero_apartamento ?? '-'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 shrink-0 rounded-full bg-gradient-to-br from-brand-600 to-navy-600 text-white flex items-center justify-center text-xs font-bold">
                          {inicial}
                        </span>
                        <span className="font-medium text-slate-800 dark:text-slate-100">
                          {f.unidades?.usuarios?.nombre ?? '-'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-bold text-slate-900 dark:text-white tabular-nums">
                      {pago?.monto_equivalente_usd != null
                        ? `$${pago.monto_equivalente_usd.toFixed(2)}`
                        : <span className="font-normal text-slate-400">—</span>}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-slate-500 dark:text-slate-400">
                      {formatFecha(pago?.fecha ?? f.fecha_carga)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${cfg.classes}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`}></span>
                        {cfg.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <a
                        href={f.imagen_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-royal-600 dark:text-royal-400 hover:text-royal-700 dark:hover:text-royal-300 hover:underline"
                      >
                        <FileTextIcon />
                        Ver comprobante
                      </a>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {puedeResolver ? (
                        <button
                          onClick={() => setSelected(f)}
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-sm transition-colors"
                        >
                          Resolver
                        </button>
                      ) : (
                        <span className="text-xs text-slate-400 dark:text-slate-500">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
              {filtradas.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-16">
                    <div className="flex flex-col items-center text-center">
                      <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-700/60 text-slate-400 dark:text-slate-500 flex items-center justify-center">
                        <InboxIcon />
                      </div>
                      <p className="mt-4 font-semibold text-slate-700 dark:text-slate-200">No hay comprobantes que coincidan.</p>
                      <p className="mt-1 text-sm text-slate-400 dark:text-slate-500">
                        Prueba con otra unidad o ajusta el filtro por estado.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-navy-900/70 backdrop-blur-sm p-4"
          onClick={() => !processing && setSelected(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Resolver pago manualmente"
            className="bg-white dark:bg-slate-800 rounded-3xl shadow-pop max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 z-10 bg-white dark:bg-slate-800 p-5 sm:p-6 border-b border-slate-100 dark:border-slate-700 flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Resolver pago manualmente</h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Apt {selected.unidades?.numero_apartamento ?? '-'} · {selected.unidades?.usuarios?.nombre ?? 'Residente'}
                </p>
              </div>
              <button
                onClick={() => !processing && setSelected(null)}
                aria-label="Cerrar"
                className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors focus-visible:ring-2 focus-visible:ring-brand-500"
              >
                <XIcon />
              </button>
            </div>

            <div className="p-5 sm:p-6 space-y-5">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2">
                  Comprobante subido
                </p>
                <a href={selected.imagen_url} target="_blank" rel="noreferrer" className="block">
                  <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 p-2 group">
                    <img
                      src={selected.imagen_url}
                      alt={`Comprobante de ${selected.unidades?.usuarios?.nombre ?? 'la unidad'}`}
                      className="w-full max-h-72 object-contain rounded-lg cursor-pointer transition-opacity group-hover:opacity-90"
                    />
                  </div>
                </a>
                <a
                  href={selected.imagen_url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2.5 inline-flex items-center gap-1.5 text-xs font-semibold text-royal-600 dark:text-royal-400 hover:text-royal-700 dark:hover:text-royal-300 hover:underline"
                >
                  Abrir comprobante en otra pestaña
                  <ExternalLinkIcon />
                </a>
              </div>

              <div className="rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-100 dark:border-slate-700 p-5 grid grid-cols-2 gap-x-4 gap-y-5">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">Unidad</p>
                  <p className="mt-0.5 font-semibold text-slate-800 dark:text-white">Apt {selected.unidades?.numero_apartamento ?? '-'}</p>
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">Residente</p>
                  <p className="mt-0.5 font-semibold text-slate-800 dark:text-white">{selected.unidades?.usuarios?.nombre ?? '-'}</p>
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">Monto detectado</p>
                  <p className="mt-0.5 font-bold text-slate-900 dark:text-white tabular-nums">
                    {selected.pagos[0]?.monto_equivalente_usd != null ? `$${selected.pagos[0].monto_equivalente_usd.toFixed(2)}` : '—'}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">Referencia</p>
                  <p className="mt-0.5 font-semibold text-slate-800 dark:text-white break-all">{selected.pagos[0]?.referencia ?? '—'}</p>
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">Saldo actual unidad</p>
                  <p className="mt-0.5 font-semibold text-slate-800 dark:text-white tabular-nums">
                    ${(selected.unidades?.saldo_deudor ?? 0).toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">Estado actual</p>
                  <p className="mt-0.5">
                    {(() => {
                      const est = selected.pagos[0]?.estado ?? 'pendiente';
                      const c = ESTADOS[est] ?? ESTADOS.pendiente;
                      return (
                        <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${c.classes}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`}></span>
                          {c.label}
                        </span>
                      );
                    })()}
                  </p>
                </div>
              </div>

              {selected.pagos[0]?.mensaje && (
                <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 p-4 flex items-start gap-3">
                  <span className="mt-0.5 text-slate-400 dark:text-slate-500 shrink-0">
                    <SparklesIcon />
                  </span>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">Mensaje del sistema</p>
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{selected.pagos[0].mensaje}</p>
                  </div>
                </div>
              )}

              <div className="rounded-xl border border-amber-200/70 dark:border-amber-800/60 bg-amber-50/70 dark:bg-amber-950/30 px-4 py-3.5 flex items-start gap-3">
                <span className="mt-0.5 text-amber-600 dark:text-amber-400 shrink-0">
                  <AlertTriangleIcon />
                </span>
                <p className="text-sm text-amber-800 dark:text-amber-300">
                  Si concilias, se descontará <span className="font-bold">${(selected.pagos[0]?.monto_equivalente_usd ?? 0).toFixed(2)}</span> del saldo de la unidad. Un rechazo no modifica el saldo.
                </p>
              </div>
            </div>

            <div className="sticky bottom-0 bg-white dark:bg-slate-800 p-5 sm:p-6 border-t border-slate-100 dark:border-slate-700 flex flex-col-reverse sm:flex-row gap-3">
              <button
                onClick={() => handleResolver('rechazado')}
                disabled={processing}
                className="flex-1 inline-flex items-center justify-center gap-2 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 font-semibold py-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors disabled:opacity-60 text-sm"
              >
                {processing ? <SpinnerIcon /> : <XIcon />}
                {processing ? 'Procesando...' : 'Rechazar'}
              </button>
              <button
                onClick={() => handleResolver('conciliado')}
                disabled={processing}
                className="flex-1 inline-flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 disabled:opacity-60 disabled:hover:bg-brand-600 text-white font-semibold py-3 rounded-xl shadow-card hover:shadow-card-hover transition-all text-sm"
              >
                {processing ? <SpinnerIcon /> : <CheckIcon />}
                {processing ? 'Procesando...' : 'Marcar como Conciliado'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}