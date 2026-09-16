'use client';

import { useState } from 'react';
import { supabase } from '../../lib/supabase';

interface Distribucion {
  apartamento: string;
  coeficiente: number;
  monto: number;
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
      .select('id, numero_apartamento, coeficiente');

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
      <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Gestión de Alícuotas</h2>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-5">
        <h3 className="font-semibold text-slate-800 dark:text-white mb-4">Registrar Gasto Común</h3>
        <div className="grid sm:grid-cols-[1fr_180px_auto] gap-4 items-end">
          <div>
            <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Descripción</label>
            <input
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Pintura exterior"
              className="w-full px-3 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white text-sm outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Monto Total ($)</label>
            <input
              type="number"
              value={montoTotal}
              onChange={(e) => setMontoTotal(e.target.value)}
              placeholder="475"
              className="w-full px-3 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white text-sm outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <button
            onClick={generarAlicuotas}
            disabled={generando}
            className="bg-teal-600 hover:bg-teal-700 disabled:opacity-60 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors whitespace-nowrap"
          >
            {generando ? 'Generando...' : '⚡ Generar Alícuotas'}
          </button>
        </div>
        {error && <p className="text-sm text-red-600 dark:text-red-400 mt-3">{error}</p>}
      </div>

      {distribucion.length > 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
          <div className="px-5 py-3 border-b border-slate-100 dark:border-slate-700 font-semibold text-slate-800 dark:text-white">
            Distribución calculada
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-500 dark:text-slate-400">
                <th className="px-5 py-2 font-medium">Unidad</th>
                <th className="px-5 py-2 font-medium">Coeficiente</th>
                <th className="px-5 py-2 font-medium">Monto Asignado</th>
              </tr>
            </thead>
            <tbody>
              {distribucion.map((d, i) => (
                <tr key={i} className="border-t border-slate-100 dark:border-slate-700">
                  <td className="px-5 py-2 text-slate-700 dark:text-slate-200">Apt {d.apartamento}</td>
                  <td className="px-5 py-2 text-slate-700 dark:text-slate-200">{d.coeficiente}</td>
                  <td className="px-5 py-2 text-slate-700 dark:text-slate-200">${d.monto.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}