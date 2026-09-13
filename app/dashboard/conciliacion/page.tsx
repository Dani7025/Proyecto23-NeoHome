'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

type Pago = {
  id: string;
  monto_extraido_ves: number | null;
  monto_equivalente_usd: number | null;
  estado: string;
  fecha: string;
  comprobantes: {
    unidades: {
      numero_apartamento: string;
      usuarios: { nombre: string } | null;
    } | null;
  } | null;
};

const ESTADO_STYLES: Record<string, string> = {
  conciliado: 'bg-green-100 dark:bg-green-950 text-green-800 dark:text-green-400 border-green-200 dark:border-green-800',
  discrepancia: 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-400 border-amber-200 dark:border-amber-800',
  en_revision: 'bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-400 border-red-200 dark:border-red-800',
};

const ESTADO_LABEL: Record<string, string> = {
  conciliado: '✓ Conciliado',
  discrepancia: 'Discrepancia',
  en_revision: '⚠ En revisión',
};

export default function ConciliacionPage() {
  const [pagos, setPagos] = useState<Pago[]>([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('todos');

  useEffect(() => {
    async function cargar() {
      const { data, error } = await supabase
        .from('pagos')
        .select(`
          id, monto_extraido_ves, monto_equivalente_usd, estado, fecha,
          comprobantes (
            unidades ( numero_apartamento, usuarios ( nombre ) )
          )
        `)
        .order('fecha', { ascending: false });

      if (!error && data) setPagos(data as unknown as Pago[]);
      setLoading(false);
    }
    cargar();
  }, []);

  const filtrados = pagos.filter((p) => {
    const unidad = p.comprobantes?.unidades?.numero_apartamento || '';
    const coincideBusqueda = unidad.toLowerCase().includes(busqueda.toLowerCase());
    const coincideEstado = filtroEstado === 'todos' || p.estado === filtroEstado;
    return coincideBusqueda && coincideEstado;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6 fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Conciliación de Pagos</h2>
        <div className="flex space-x-2">
          <input
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar unidad..."
            className="px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-white rounded-lg outline-none focus:border-teal-500 w-40 sm:w-64"
          />
          <select
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
            className="px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-800 dark:text-white"
          >
            <option value="todos">Todos los estados</option>
            <option value="en_revision">En revisión</option>
            <option value="discrepancia">Discrepancia</option>
            <option value="conciliado">Conciliados</option>
          </select>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400">
            <tr>
              <th className="px-6 py-3 font-medium">Unidad</th>
              <th className="px-6 py-3 font-medium">Residente</th>
              <th className="px-6 py-3 font-medium">Monto (VES)</th>
              <th className="px-6 py-3 font-medium">Equiv. (USD)</th>
              <th className="px-6 py-3 font-medium">Fecha</th>
              <th className="px-6 py-3 font-medium">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
            {loading && (
              <tr><td colSpan={6} className="px-6 py-10 text-center text-slate-400">Cargando...</td></tr>
            )}
            {!loading && filtrados.length === 0 && (
              <tr><td colSpan={6} className="px-6 py-10 text-center text-slate-400 dark:text-slate-500">
                No hay pagos que coincidan.
              </td></tr>
            )}
            {filtrados.map((p) => (
              <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/40">
                <td className="px-6 py-4 font-medium text-slate-800 dark:text-slate-100">
                  {p.comprobantes?.unidades?.numero_apartamento ?? '—'}
                </td>
                <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                  {p.comprobantes?.unidades?.usuarios?.nombre ?? '—'}
                </td>
                <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                  {p.monto_extraido_ves ? `Bs. ${p.monto_extraido_ves}` : '--'}
                </td>
                <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                  {p.monto_equivalente_usd ? `$${p.monto_equivalente_usd}` : '--'}
                </td>
                <td className="px-6 py-4 text-slate-500 dark:text-slate-400">
                  {new Date(p.fecha).toLocaleDateString('es-VE')}
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${ESTADO_STYLES[p.estado]}`}>
                    {ESTADO_LABEL[p.estado]}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}