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

const ESTADOS: Record<string, { label: string; classes: string; dot: string }> = {
  conciliado: {
    label: 'Conciliado',
    classes: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
    dot: 'bg-emerald-500',
  },
  abono_parcial: {
    label: 'Abono Parcial',
    classes: 'bg-royal-50 dark:bg-royal-950/40 text-royal-600 dark:text-royal-400 border-royal-200 dark:border-royal-800',
    dot: 'bg-royal-500',
  },
  discrepancia: {
    label: 'Discrepancia',
    classes: 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800',
    dot: 'bg-amber-500',
  },
  en_revision: {
    label: 'En Revisión',
    classes: 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800',
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

function HomeIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 10.5L12 3l9 7.5" />
      <path d="M5 9.5V21h14V9.5" />
      <path d="M9 21v-6h6v6" />
    </svg>
  );
}

function UploadIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <path d="M17 8l-5-5-5 5M12 3v12" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

function ReceiptIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 2v20l2-1.5L8 22l2-1.5L12 22l2-1.5L16 22l2-1.5L20 22V2l-2 1.5L16 2l-2 1.5L12 2l-2 1.5L8 2 6 3.5 4 2z" />
      <path d="M8 8h8M8 12h8M8 16h5" />
    </svg>
  );
}

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

  const alDia = saldo !== null && saldo <= 0;

  return (
    <div className="space-y-8 fade-in">
      {/* Bienvenida */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Hola, este es el resumen de tu cuenta
        </h1>
        <p className="mt-1.5 text-sm sm:text-base text-slate-500 dark:text-slate-400">
          Consulta tu saldo, revisa tus comprobantes y mantén tu cuenta al día.
        </p>
      </div>

      {/* Tarjeta financiera principal */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-800 via-brand-700 to-navy-900 text-white shadow-card">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(420px 220px at 8% 0%, rgba(150,129,217,0.25), transparent 60%), radial-gradient(480px 240px at 94% 100%, rgba(44,123,145,0.25), transparent 60%)',
          }}
          aria-hidden="true"
        />

        <div className="relative p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center text-lavender-200">
                <HomeIcon />
              </span>
              <div>
                <p className="text-sm font-medium text-brand-100">Saldo actual pendiente</p>
                <p className="text-xs text-brand-200/80 mt-0.5">
                  {apto ? `Apartamento ${apto}` : 'Mi residencia'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {saldo !== null && (
                <span
                  className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${
                    alDia ? 'bg-emerald-400/15 text-emerald-100 border-emerald-300/30' : 'bg-amber-400/15 text-amber-100 border-amber-300/30'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${alDia ? 'bg-emerald-300' : 'bg-amber-300'}`}></span>
                  {alDia ? 'Cuenta al día' : 'Saldo pendiente'}
                </span>
              )}
            </div>
          </div>

          <div className="mt-7 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5">
            <div>
              <p className="text-sm text-brand-200 font-mono tracking-wide">
                {saldo === null ? 'Cargando saldo...' : alDia ? 'Total al día' : 'Total pendiente'}
              </p>
              <p className="mt-1 text-5xl sm:text-6xl font-extrabold tracking-tight tabular-nums">
                {saldo === null ? '—' : `$${saldo.toFixed(2)}`}
              </p>
            </div>

            <Link
              href="/residente/reportar"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white text-brand-800 font-semibold rounded-xl shadow-card hover:bg-brand-50 hover:shadow-card-hover transition-all group"
            >
              <UploadIcon />
              Reportar Pago
              <ArrowRightIcon />
            </Link>
          </div>
        </div>
      </section>

      {/* Historial de pagos */}
      <section className="bg-white dark:bg-slate-800 rounded-2xl shadow-card border border-slate-200/70 dark:border-slate-700 overflow-hidden">
        <div className="px-6 sm:px-7 py-5 border-b border-slate-100 dark:border-slate-700">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Historial de pagos</h2>
            {!loadingPagos && pagos.length > 0 && (
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-brand-50 dark:bg-brand-900/50 text-brand-700 dark:text-brand-300 border border-brand-100 dark:border-brand-800">
                {pagos.length} {pagos.length === 1 ? 'pago' : 'pagos'}
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Tus últimos comprobantes y su estado de validación
          </p>
        </div>

        {loadingPagos ? (
          <div className="p-6 sm:p-7 space-y-5 animate-pulse" aria-hidden="true">
            {[0, 1, 2].map((i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-700 shrink-0"></div>
                <div className="flex-1 space-y-2.5">
                  <div className="h-3 w-32 rounded-full bg-slate-200 dark:bg-slate-700"></div>
                  <div className="h-5 w-44 rounded-lg bg-slate-200 dark:bg-slate-700"></div>
                  <div className="h-3 w-24 rounded-full bg-slate-200 dark:bg-slate-700"></div>
                </div>
              </div>
            ))}
          </div>
        ) : pagos.length === 0 ? (
          <div className="px-6 py-14 text-center">
            <div className="mx-auto w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-700/60 text-slate-400 dark:text-slate-500 flex items-center justify-center">
              <ReceiptIcon />
            </div>
            <h3 className="mt-4 text-base font-semibold text-slate-800 dark:text-white">Aún no has reportado pagos.</h3>
            <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              Cuando reportes tu primer comprobante, verás aquí su estado de validación y su referencia.
            </p>
            <Link
              href="/residente/reportar"
              className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold rounded-xl transition-colors"
            >
              <UploadIcon />
              Reportar Pago
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-700">
            {pagos.map((p) => {
              const cfg = ESTADOS[p.estado] ?? ESTADOS.pendiente;
              return (
                <div key={p.id} className="px-6 sm:px-7 py-5">
                  <div className="flex items-start gap-3.5">
                    <span className={`mt-1 w-2.5 self-stretch rounded-full shrink-0 ${cfg.dot}`}></span>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full border ${cfg.classes}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`}></span>
                          {cfg.label}
                        </span>
                        <span className="text-xs text-slate-400 dark:text-slate-500">
                          {new Date(p.fecha).toLocaleDateString('es-VE', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </span>
                      </div>

                      <div className="mt-2.5 flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
                        <span className="text-lg font-bold text-slate-900 dark:text-white tabular-nums">
                          {p.monto_extraido_ves != null ? `Bs. ${p.monto_extraido_ves.toFixed(2)}` : '—'}
                        </span>
                        {p.monto_equivalente_usd != null && (
                          <span className="text-sm text-slate-500 dark:text-slate-400 tabular-nums">
                            ≈ ${p.monto_equivalente_usd.toFixed(2)}
                          </span>
                        )}
                      </div>

                      {p.referencia && (
                        <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
                          <span className="font-medium text-slate-400 dark:text-slate-500">Referencia:</span> {p.referencia}
                        </p>
                      )}

                      {p.mensaje && (
                        <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400 italic">{p.mensaje}</p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}