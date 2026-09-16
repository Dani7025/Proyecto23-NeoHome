'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export default function DashboardPage() {
  const [totalCobrado, setTotalCobrado] = useState(0);
  const [porcentajeMorosidad, setPorcentajeMorosidad] = useState(0);
  const [alicuotaPromedio, setAlicuotaPromedio] = useState(0);
  const [loading, setLoading] = useState(true);

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
      setLoading(false);
    }
    cargar();
  }, []);

  if (loading) {
    return <p className="text-slate-500 dark:text-slate-400">Cargando...</p>;
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 fade-in">
      <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Resumen Financiero</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-5">
          <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Total cobrado este mes</h3>
          <p className="text-3xl font-bold text-slate-800 dark:text-white mt-2">${totalCobrado.toFixed(2)}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-5">
          <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">% de morosidad</h3>
          <p className="text-3xl font-bold text-slate-800 dark:text-white mt-2">{porcentajeMorosidad}%</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-5">
          <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Alícuota promedio</h3>
          <p className="text-3xl font-bold text-slate-800 dark:text-white mt-2">${alicuotaPromedio.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
}s