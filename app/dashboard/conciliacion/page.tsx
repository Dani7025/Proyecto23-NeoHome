'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

interface ComprobanteRow {
  id: string;
  imagen_url: string;
  fecha_carga: string;
  unidades: {
    numero_apartamento: string;
    usuarios: { nombre: string } | null;
  } | null;
  pagos: {
    monto_equivalente_usd: number | null;
    referencia: string | null;
    estado: string;
    fecha: string;
  }[];
}

const ESTADOS: Record<string, { label: string; classes: string }> = {
  conciliado: { label: 'Conciliado', classes: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800' },
  discrepancia: { label: 'Discrepancia', classes: 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800' },
  en_revision: { label: 'En Revisión', classes: 'bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800' },
  pendiente: { label: 'Pendiente', classes: 'bg-slate-100 dark:bg-slate-700/60 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-600' },
};

export default function ConciliacionPage() {
  const [filas, setFilas] = useState<ComprobanteRow[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function cargar() {
      const { data } = await supabase
        .from('comprobantes')
        .select(`
          id,
          imagen_url,
          fecha_carga,
          unidades ( numero_apartamento, usuarios ( nombre ) ),
          pagos ( monto_equivalente_usd, referencia, estado, fecha )
        `)
        .order('fecha_carga', { ascending: false });

      setFilas((data as unknown as ComprobanteRow[]) || []);
      setLoading(false);
    }
    cargar();
  }, []);

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
            <option value="discrepancia">Discrepancia</option>
            <option value="en_revision">En Revisión</option>
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
            </tr>
          </thead>
          <tbody>
            {filtradas.map((f) => {
              const pago = f.pagos[0];
              const estado = pago?.estado ?? 'pendiente';
              const cfg = ESTADOS[estado] ?? ESTADOS.pendiente;
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
                </tr>
              );
            })}
            {filtradas.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-8 text-center text-slate-400 dark:text-slate-500">
                  No hay comprobantes que coincidan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}