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

const ESTADOS: Record<string, { label: string; classes: string }> = {
  conciliado: { label: 'Conciliado', classes: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800' },
  abono_parcial: { label: 'Abono Parcial', classes: 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800' },
  discrepancia: { label: 'Discrepancia', classes: 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800' },
  en_revision: { label: 'En Revisión', classes: 'bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800' },
  rechazado: { label: 'Rechazado', classes: 'bg-slate-100 dark:bg-slate-700/60 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-600' },
  pendiente: { label: 'Pendiente', classes: 'bg-slate-100 dark:bg-slate-700/60 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-600' },
};

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

  if (loading) {
    return <p className="text-slate-500 dark:text-slate-400">Cargando...</p>;
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Conciliación de Pagos</h2>
        <div className="flex gap-3">
          <input
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar unidad..."
            className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white text-sm outline-none focus:ring-2 focus:ring-teal-500"
          />
          <select
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
            className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white text-sm outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="todos">Todos los estados</option>
            <option value="conciliado">Conciliado</option>
            <option value="abono_parcial">Abono Parcial</option>
            <option value="discrepancia">Discrepancia</option>
            <option value="en_revision">En Revisión</option>
            <option value="rechazado">Rechazado</option>
            <option value="pendiente">Pendiente</option>
          </select>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-700">
              <th className="px-5 py-3 font-medium">Unidad</th>
              <th className="px-5 py-3 font-medium">Residente</th>
              <th className="px-5 py-3 font-medium">Monto</th>
              <th className="px-5 py-3 font-medium">Fecha</th>
              <th className="px-5 py-3 font-medium">Estado</th>
              <th className="px-5 py-3 font-medium">Comprobante</th>
              <th className="px-5 py-3 font-medium">Acción</th>
            </tr>
          </thead>
          <tbody>
            {filtradas.map((f) => {
              const pago = f.pagos[0];
              const estado = pago?.estado ?? 'pendiente';
              const cfg = ESTADOS[estado] ?? ESTADOS.pendiente;
              const puedeResolver = estado === 'discrepancia' || estado === 'en_revision' || estado === 'pendiente';
              return (
                <tr key={f.id} className="border-b border-slate-100 dark:border-slate-700 last:border-0">
                  <td className="px-5 py-3 text-slate-700 dark:text-slate-200">Apt {f.unidades?.numero_apartamento ?? '-'}</td>
                  <td className="px-5 py-3 text-slate-700 dark:text-slate-200">{f.unidades?.usuarios?.nombre ?? '-'}</td>
                  <td className="px-5 py-3 text-slate-700 dark:text-slate-200">
                    {pago?.monto_equivalente_usd != null ? `$${pago.monto_equivalente_usd.toFixed(2)}` : '—'}
                  </td>
                  <td className="px-5 py-3 text-slate-700 dark:text-slate-200">
                    {new Date(pago?.fecha ?? f.fecha_carga).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-3">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${cfg.classes}`}>{cfg.label}</span>
                  </td>
                  <td className="px-5 py-3">
                    <a href={f.imagen_url} target="_blank" rel="noreferrer" className="text-teal-600 dark:text-teal-400 text-xs font-medium hover:underline">
                      Ver comprobante
                    </a>
                  </td>
                  <td className="px-5 py-3">
                    {puedeResolver ? (
                      <button
                        onClick={() => setSelected(f)}
                        className="text-xs font-medium px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white transition-colors"
                      >
                        Resolver
                      </button>
                    ) : (
                      <span className="text-xs text-slate-400">—</span>
                    )}
                  </td>
                </tr>
              );
            })}
            {filtradas.length === 0 && (
              <tr>
                <td colSpan={7} className="px-5 py-8 text-center text-slate-400 dark:text-slate-500">
                  No hay comprobantes que coincidan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal de resolución */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => !processing && setSelected(null)}>
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-5 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white">Resolver pago manualmente</h3>
              <button onClick={() => !processing && setSelected(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xl">✕</button>
            </div>

            <div className="p-5 space-y-4">
              {/* Imagen */}
              <div>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">Comprobante subido</p>
                <a href={selected.imagen_url} target="_blank" rel="noreferrer">
                  <img
                    src={selected.imagen_url}
                    alt="Comprobante"
                    className="w-full max-h-80 object-contain rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 cursor-pointer hover:opacity-90 transition-opacity"
                  />
                </a>
              </div>

              {/* Datos del pago */}
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Unidad</p>
                  <p className="font-medium text-slate-800 dark:text-white">Apt {selected.unidades?.numero_apartamento ?? '-'}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Residente</p>
                  <p className="font-medium text-slate-800 dark:text-white">{selected.unidades?.usuarios?.nombre ?? '-'}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Monto detectado</p>
                  <p className="font-medium text-slate-800 dark:text-white">
                    {selected.pagos[0]?.monto_equivalente_usd != null ? `$${selected.pagos[0].monto_equivalente_usd.toFixed(2)}` : '—'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Referencia</p>
                  <p className="font-medium text-slate-800 dark:text-white">{selected.pagos[0]?.referencia ?? '—'}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Saldo actual unidad</p>
                  <p className="font-medium text-slate-800 dark:text-white">
                    ${(selected.unidades?.saldo_deudor ?? 0).toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Estado actual</p>
                  <p className="font-medium text-slate-800 dark:text-white">
                    {ESTADOS[selected.pagos[0]?.estado ?? 'pendiente']?.label ?? '—'}
                  </p>
                </div>
              </div>

              {selected.pagos[0]?.mensaje && (
                <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-3 text-sm text-slate-600 dark:text-slate-300">
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Mensaje del sistema</p>
                  {selected.pagos[0].mensaje}
                </div>
              )}

              <p className="text-xs text-slate-500 dark:text-slate-400 italic">
                Revisa el comprobante y decide. Si concilias, se descuenta ${(selected.pagos[0]?.monto_equivalente_usd ?? 0).toFixed(2)} del saldo.
              </p>
            </div>

            <div className="p-5 border-t border-slate-100 dark:border-slate-700 flex gap-3">
              <button
                onClick={() => handleResolver('rechazado')}
                disabled={processing}
                className="flex-1 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 font-medium py-2.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors disabled:opacity-60"
              >
                {processing ? 'Procesando...' : 'Rechazar'}
              </button>
              <button
                onClick={() => handleResolver('conciliado')}
                disabled={processing}
                className="flex-1 bg-teal-600 hover:bg-teal-700 disabled:opacity-60 text-white font-semibold py-2.5 rounded-lg transition-colors"
              >
                {processing ? 'Procesando...' : 'Marcar como Conciliado'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}