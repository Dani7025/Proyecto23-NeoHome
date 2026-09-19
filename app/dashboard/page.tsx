'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

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

  if (loading) {
    return <p className="text-slate-500 dark:text-slate-400">Cargando...</p>;
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 fade-in">
      <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Resumen Financiero</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
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

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-teal-200 dark:border-teal-800 p-5">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Tasa BCV (Bs/USD)</h3>
            {!editandoTasa && (
              <button
                onClick={() => setEditandoTasa(true)}
                className="text-xs text-teal-600 dark:text-teal-400 hover:underline font-medium"
              >
                Editar
              </button>
            )}
          </div>

          {editandoTasa ? (
            <div className="space-y-2">
              <input
                type="number"
                value={tasaBcv}
                onChange={(e) => setTasaBcv(e.target.value)}
                step="0.01"
                className="w-full px-2 py-1.5 text-lg font-bold rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-teal-500"
              />
              <div className="flex gap-2">
                <button
                  onClick={guardarTasa}
                  disabled={guardandoTasa}
                  className="flex-1 text-xs bg-teal-600 hover:bg-teal-700 disabled:opacity-60 text-white font-medium py-1.5 rounded-lg transition-colors"
                >
                  {guardandoTasa ? '...' : 'Guardar'}
                </button>
                <button
                  onClick={() => { setEditandoTasa(false); cargarTasa(); setMensajeTasa(''); }}
                  className="text-xs border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 px-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          ) : (
            <p className="text-3xl font-bold text-teal-600 dark:text-teal-400 mt-2">
              Bs. {Number(tasaBcv || 0).toFixed(2)}
            </p>
          )}

          {mensajeTasa && (
            <p className={`text-xs mt-2 ${mensajeTasa.startsWith('✓') ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {mensajeTasa}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}