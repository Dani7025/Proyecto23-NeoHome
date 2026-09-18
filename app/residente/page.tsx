'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '../lib/supabase';

type Pago = {
  id: string;
  monto_equivalente_usd: number | null;
  monto_extraido_ves: number | null;
  referencia: string | null;
  estado: string;
  mensaje: string | null;
  fecha: string;
};

const ESTADOS: Record<string, { label: string; classes: string }> = {
  conciliado: { label: '✓ Conciliado', classes: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800' },
  abono_parcial: { label: 'Abono Parcial', classes: 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800' },
  discrepancia: { label: 'Discrepancia', classes: 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800' },
  en_revision: { label: 'En Revisión', classes: 'bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800' },
  rechazado: { label: 'Rechazado', classes: 'bg-slate-100 dark:bg-slate-700/60 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-600' },
};

export default function ResidentePage() {
  const [saldo, setSaldo] = useState<number | null>(null);
  const [apto, setApto] = useState('');
  const [unidadId, setUnidadId] = useState<string | null>(null);
  const [pagos, setPagos] = useState<Pago[]>([]);
  const [loadingPagos, setLoadingPagos] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function load() {
      const { data: authData } = await supabase.auth.getUser();
      if (!authData.user) { router.push('/login'); return; }

      const { data: unidad } = await supabase
        .from('unidades')
        .select('id, numero_apartamento, saldo_deudor')
        .eq('usuario_id', authData.user.id)
        .single();

      if (unidad) {
        setSaldo(unidad.saldo_deudor);
        setApto(unidad.numero_apartamento);
        setUnidadId(unidad.id);

        const { data: pagosData } = await supabase
          .from('pagos')
          .select(`
            id,
            monto_equivalente_usd,
            monto_extraido_ves,
            referencia,
            estado,
            mensaje,
            fecha,
            comprobantes!inner ( unidad_id )
          `)
          .eq('comprobantes.unidad_id', unidad.id)
          .order('fecha', { ascending: false });

        setPagos((pagosData as unknown as Pago[]) || []);
      }
      setLoadingPagos(false);
    }
    load();
  }, [router]);

  return (
    <div className="max-w-4xl mx-auto space-y-6 fade-in">
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-lg p-8 text-white">
        <h3 className="text-slate-300 font-medium mb-2">
          Saldo actual pendiente {apto && `— Apt ${apto}`}
        </h3>
        <p className="text-5xl font-bold tracking-tight mb-6">
          {saldo === null ? 'Sin datos' : `$${saldo.toFixed(2)}`}
        </p>
        <Link
          href="/residente/reportar"
          className="bg-teal-500 text-white font-semibold py-3 px-6 rounded-xl hover:bg-teal-600 transition-colors inline-block"
        >
          📤 Reportar Pago
        </Link>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-white">Historial de pagos</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Tus últimos comprobantes y su estado de validación
          </p>
        </div>

        {loadingPagos ? (
          <p className="px-6 py-10 text-center text-slate-400 dark:text-slate-500">Cargando...</p>
        ) : pagos.length === 0 ? (
          <p className="px-6 py-10 text-center text-slate-400 dark:text-slate-500">
            Aún no has reportado pagos.
          </p>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-700">
            {pagos.map((p) => {
              const cfg = ESTADOS[p.estado] ?? ESTADOS.rechazado;
              return (
                <div key={p.id} className="px-6 py-4 flex flex-col sm:flex-row sm:items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${cfg.classes}`}>
                        {cfg.label}
                      </span>
                      <span className="text-xs text-slate-400 dark:text-slate-500">
                        {new Date(p.fecha).toLocaleDateString('es-VE', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                    <div className="mt-2 flex items-baseline gap-3">
                      <span className="text-lg font-bold text-slate-800 dark:text-white">
                        {p.monto_extraido_ves != null ? `Bs. ${p.monto_extraido_ves.toFixed(2)}` : '—'}
                      </span>
                      {p.monto_equivalente_usd != null && (
                        <span className="text-sm text-slate-500 dark:text-slate-400">
                          ≈ ${p.monto_equivalente_usd.toFixed(2)}
                        </span>
                      )}
                    </div>
                    {p.referencia && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Ref: {p.referencia}
                      </p>
                    )}
                    {p.mensaje && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 italic">
                        {p.mensaje}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}