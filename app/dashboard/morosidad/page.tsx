'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

interface Moroso {
  numero_apartamento: string;
  saldo_deudor: number;
  usuarios: { nombre: string } | null;
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
    return <p className="text-slate-500 dark:text-slate-400">Cargando...</p>;
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 fade-in">
      <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Reporte de Morosidad</h2>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-700">
              <th className="px-5 py-3 font-medium">Unidad</th>
              <th className="px-5 py-3 font-medium">Residente</th>
              <th className="px-5 py-3 font-medium">Monto adeudado</th>
              <th className="px-5 py-3 font-medium">Acción</th>
            </tr>
          </thead>
          <tbody>
            {morosos.map((u, i) => (
              <tr key={i} className="border-b border-slate-100 dark:border-slate-700 last:border-0">
                <td className="px-5 py-3 font-medium text-red-500 dark:text-red-400">Apt {u.numero_apartamento}</td>
                <td className="px-5 py-3 text-slate-700 dark:text-slate-200">{u.usuarios?.nombre ?? '-'}</td>
                <td className="px-5 py-3 text-slate-700 dark:text-slate-200">${u.saldo_deudor.toFixed(2)}</td>
                <td className="px-5 py-3">
                  <button className="text-xs font-medium px-3 py-1.5 rounded-lg bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-950/70 transition-colors">
                    Enviar recordatorio
                  </button>
                </td>
              </tr>
            ))}
            {morosos.length === 0 && (
              <tr>
                <td colSpan={4} className="px-5 py-8 text-center text-slate-400 dark:text-slate-500">
                  No hay unidades morosas.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}