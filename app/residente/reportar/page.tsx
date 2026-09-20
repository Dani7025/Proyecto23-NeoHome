'use client';

import { useState } from 'react';
import Link from 'next/link';
import { supabase } from '../../lib/supabase';

const WEBHOOK_URL = 'https://dani0725.app.n8n.cloud/webhook/conciliar';

type Resultado = {
  estado: 'conciliado' | 'discrepancia' | 'en_revision' | 'abono_parcial';
  monto_extraido?: number | null;
  monto_usd?: number | null;
  referencia?: string | null;
  fecha?: string | null;
  mensaje: string;
};

function UploadIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <path d="M17 8l-5-5-5 5" />
      <path d="M12 3v12" />
    </svg>
  );
}

function DocumentIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6" />
      <path d="M16 13H8M16 17H8M10 9H8" />
    </svg>
  );
}

function CheckCircleIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <path d="M22 4L12 14.01l-3-3" />
    </svg>
  );
}

function BanknoteIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="6" width="20" height="12" rx="2" />
      <circle cx="12" cy="12" r="2" />
      <path d="M6 12h.01M18 12h.01" />
    </svg>
  );
}

function AlertTriangleIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
    </svg>
  );
}

function ArrowLeftIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M19 12H5" />
      <path d="M12 19l-7-7 7-7" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
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

function formatBytes(bytes: number) {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

const TIPOS_PERMITIDOS = ['image/jpeg', 'image/png', 'application/pdf'];

export default function ReportarPagoPage() {
  const [file, setFile] = useState<File | null>(null);
  const [subiendo, setSubiendo] = useState(false);
  const [resultado, setResultado] = useState<Resultado | null>(null);
  const [error, setError] = useState('');

  function handleFileChange(selected: File | null) {
    setError('');
    if (!selected) {
      setFile(null);
      return;
    }
    if (!TIPOS_PERMITIDOS.includes(selected.type)) {
      setError('Formato no permitido. Solo se aceptan archivos JPG, PNG o PDF.');
      setFile(null);
      return;
    }
    setFile(selected);
  }

  async function handleUpload() {
    if (!file) return;
    setError('');

    if (!TIPOS_PERMITIDOS.includes(file.type)) {
      setError('Formato no permitido. Solo se aceptan archivos JPG, PNG o PDF.');
      return;
    }

    setSubiendo(true);

    const { data: authData } = await supabase.auth.getUser();
    if (!authData.user) {
      setError('Sesión no válida.');
      setSubiendo(false);
      return;
    }

    const { data: unidad, error: unidadError } = await supabase
      .from('unidades')
      .select('id')
      .eq('usuario_id', authData.user.id)
      .single();

    if (unidadError || !unidad) {
      setError('No se encontró tu unidad asociada.');
      setSubiendo(false);
      return;
    }

    const nombreArchivo = `${authData.user.id}-${Date.now()}-${file.name}`;
    const { data: storageData, error: storageError } = await supabase.storage
      .from('comprobantes')
      .upload(nombreArchivo, file);

    if (storageError) {
      setError('No se pudo subir el archivo: ' + storageError.message);
      setSubiendo(false);
      return;
    }

    const { data: urlData } = supabase.storage.from('comprobantes').getPublicUrl(storageData.path);

    const { data: insertData, error: insertError } = await supabase
      .from('comprobantes')
      .insert({
        imagen_url: urlData.publicUrl,
        unidad_id: unidad.id,
        fecha_carga: new Date().toISOString(),
        estado_extraccion: 'pendiente',
      })
      .select('id')
      .single();

    if (insertError || !insertData) {
      setError('No se pudo registrar el comprobante: ' + (insertError?.message ?? 'Error desconocido'));
      setSubiendo(false);
      return;
    }

    try {
      const res = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          comprobante_id: insertData.id,
          imagen_url: urlData.publicUrl,
          unidad_id: unidad.id,
        }),
      });

      if (!res.ok) {
        throw new Error('El servidor de validación respondió con error');
      }

      const data = await res.json();
      setResultado({
        estado: data.estado,
        monto_extraido: data.monto_extraido,
        monto_usd: data.monto_usd,
        referencia: data.referencia,
        fecha: data.fecha,
        mensaje: data.mensaje || 'Procesado',
      });
    } catch (e) {
      setError('No se pudo validar el comprobante con IA: ' + (e as Error).message);
    }

    setSubiendo(false);
  }

  if (resultado) {
    const estilo = (() => {
      switch (resultado.estado) {
        case 'conciliado':
          return {
            bg: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800',
            icon: 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-400 shadow-emerald-100 dark:shadow-black/20',
            texto: 'text-emerald-700 dark:text-emerald-400',
            Icon: CheckCircleIcon,
            titulo: '¡Pago conciliado!',
          };
        case 'abono_parcial':
          return {
            bg: 'bg-royal-50 dark:bg-royal-900/40 border-royal-200 dark:border-royal-800',
            icon: 'bg-royal-100 dark:bg-royal-900/60 text-royal-600 dark:text-royal-400 shadow-royal-100 dark:shadow-black/20',
            texto: 'text-royal-700 dark:text-royal-400',
            Icon: BanknoteIcon,
            titulo: 'Abono recibido',
          };
        case 'discrepancia':
          return {
            bg: 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800',
            icon: 'bg-amber-100 dark:bg-amber-900/60 text-amber-600 dark:text-amber-400 shadow-amber-100 dark:shadow-black/20',
            texto: 'text-amber-700 dark:text-amber-400',
            Icon: AlertTriangleIcon,
            titulo: 'Discrepancia de monto',
          };
        case 'en_revision':
        default:
          return {
            bg: 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700',
            icon: 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 shadow-slate-100 dark:shadow-black/20',
            texto: 'text-slate-600 dark:text-slate-300',
            Icon: ClockIcon,
            titulo: 'No pudimos leer tu comprobante',
          };
      }
    })();

    const Icono = estilo.Icon;

    return (
      <div className="max-w-xl mx-auto space-y-6 fade-in">
        <Link
          href="/residente"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-brand-700 dark:hover:text-brand-300 transition-colors"
        >
          <ArrowLeftIcon />
          Volver
        </Link>

        <section className="bg-white dark:bg-slate-800 rounded-3xl shadow-card border border-slate-200/70 dark:border-slate-700 overflow-hidden">
          <div className={`p-6 sm:p-9 ${estilo.bg} border-b`}>
            <div className="flex items-start gap-4">
              <span className={`w-14 h-14 shrink-0 rounded-2xl flex items-center justify-center shadow-card ${estilo.icon}`}>
                <Icono />
              </span>
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">{estilo.titulo}</h2>
                <p className={`mt-1 text-sm font-medium ${estilo.texto}`}>{resultado.mensaje}</p>
              </div>
            </div>
          </div>

          {(resultado.monto_extraido != null || resultado.monto_usd != null || resultado.referencia || resultado.fecha) && (
            <div className="px-6 sm:px-9 py-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Información detectada
              </p>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {resultado.monto_extraido != null && (
                  <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 px-4 py-3 sm:col-span-2">
                    <p className="text-xs text-slate-500 dark:text-slate-400">Monto detectado</p>
                    <div className="mt-0.5 flex flex-wrap items-baseline gap-x-3">
                      <p className="text-2xl font-bold text-slate-900 dark:text-white tabular-nums">
                        Bs. {resultado.monto_extraido.toFixed(2)}
                      </p>
                      {resultado.monto_usd != null && (
                        <p className="text-sm text-slate-500 dark:text-slate-400 tabular-nums">
                          ≈ ${resultado.monto_usd.toFixed(2)}
                        </p>
                      )}
                    </div>
                  </div>
                )}
                {resultado.referencia && (
                  <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 px-4 py-3">
                    <p className="text-xs text-slate-500 dark:text-slate-400">Número de referencia</p>
                    <p className="mt-0.5 font-semibold text-slate-800 dark:text-white break-all">{resultado.referencia}</p>
                  </div>
                )}
                {resultado.fecha && (
                  <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 px-4 py-3">
                    <p className="text-xs text-slate-500 dark:text-slate-400">Fecha de pago</p>
                    <p className="mt-0.5 font-semibold text-slate-800 dark:text-white">
                      {(() => {
                        const f = resultado.fecha;
                        if (!f) return '—';
                        if (/^\d{4}-\d{2}-\d{2}$/.test(f)) {
                          const [y, m, d] = f.split('-');
                          return `${d}/${m}/${y}`;
                        }
                        if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(f)) {
                          return f;
                        }
                        return f;
                      })()}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 px-6 sm:px-9 pb-6 pt-1">
            <button
              onClick={() => { setResultado(null); setFile(null); }}
              className="flex-1 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-semibold py-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-sm"
            >
              Reportar otro
            </button>
            <Link
              href="/residente"
              className="flex-1 text-center bg-brand-600 hover:bg-brand-700 text-white font-semibold py-3 rounded-xl shadow-card hover:shadow-card-hover transition-all text-sm"
            >
              Ir al inicio
            </Link>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto space-y-6 fade-in">
      <Link
        href="/residente"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-brand-700 dark:hover:text-brand-300 transition-colors"
      >
        <ArrowLeftIcon />
        Volver
      </Link>

      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Reportar Pago</h1>
        <p className="mt-1.5 text-sm sm:text-base text-slate-500 dark:text-slate-400">
          Sube el comprobante de tu pago y NeoHome lo analizará automáticamente.
        </p>
      </div>

      <section className="bg-white dark:bg-slate-800 rounded-3xl shadow-card border border-slate-200/70 dark:border-slate-700 p-6 sm:p-8 space-y-5">
        {subiendo ? (
          <div className="py-10 text-center fade-in">
            <div className="relative w-16 h-16 mx-auto">
              <div className="absolute inset-0 rounded-full border-2 border-brand-100 dark:border-brand-800 border-t-brand-600 dark:border-t-brand-400 animate-spin"></div>
              <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-600 to-navy-700 text-white flex items-center justify-center shadow-card">
                <DocumentIcon />
              </div>
            </div>
            <h3 className="mt-6 text-lg font-semibold text-slate-900 dark:text-white">Analizando comprobante...</h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Estamos extrayendo y contrastando los datos de tu comprobante.
            </p>
            {file && (
              <p className="mt-3 text-xs text-slate-400 dark:text-slate-500 truncate max-w-xs mx-auto">{file.name}</p>
            )}
            <div className="mt-6 flex justify-center gap-2" aria-hidden="true">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="w-2 h-2 rounded-full bg-brand-600 dark:bg-brand-400 animate-pulse"
                  style={{ animationDelay: `${i * 180}ms` }}
                ></span>
              ))}
            </div>
          </div>
        ) : file ? (
          <div className="fade-in">
            <div className="rounded-2xl border border-brand-200 dark:border-brand-700 bg-brand-50/50 dark:bg-brand-900/10 p-5 flex items-center gap-4">
              <span className="w-12 h-12 shrink-0 rounded-xl bg-white dark:bg-slate-800 text-brand-600 dark:text-brand-400 shadow-sm flex items-center justify-center">
                <DocumentIcon />
              </span>
              <div className="flex-1 min-w-0">
                <p className="truncate font-semibold text-slate-800 dark:text-white text-sm">{file.name}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {(file.type || 'Archivo').toUpperCase()} · {formatBytes(file.size)}
                </p>
              </div>
              <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 text-xs font-semibold shrink-0">
                <CheckCircleIcon />
                <span className="text-[11px] leading-none">Listo para enviar</span>
              </span>
            </div>

            <div className="mt-3 flex items-center justify-between gap-3">
              <p className="sm:hidden text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                Listo para enviar
              </p>
              <label className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer">
                Cambiar archivo
                <input
                  type="file"
                  accept="image/jpeg,image/png,application/pdf"
                  onChange={(e) => handleFileChange(e.target.files?.[0] ?? null)}
                  className="sr-only"
                />
              </label>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border-2 border-dashed border-brand-200 dark:border-brand-700 bg-brand-50/40 dark:bg-brand-900/10 px-6 py-8 sm:py-10 text-center fade-in">
            <div className="mx-auto w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-600 to-navy-700 text-white flex items-center justify-center shadow-card">
              <UploadIcon />
            </div>
            <p className="mt-4 font-semibold text-slate-800 dark:text-white">Selecciona tu comprobante</p>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              Sube la foto o el PDF de tu transferencia, depósito o pago móvil.
            </p>

            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {['JPG', 'PNG', 'PDF'].map((ext) => (
                <span
                  key={ext}
                  className="px-2.5 py-1 rounded-md bg-white dark:bg-slate-800 border border-brand-100 dark:border-brand-800 text-brand-600 dark:text-brand-300 text-xs font-semibold"
                >
                  {ext}
                </span>
              ))}
            </div>

            <label className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold shadow-card hover:shadow-card-hover transition-all cursor-pointer">
              <UploadIcon />
              Seleccionar archivo
              <input
                type="file"
                accept="image/jpeg,image/png,application/pdf"
                onChange={(e) => handleFileChange(e.target.files?.[0] ?? null)}
                className="sr-only"
              />
            </label>
          </div>
        )}

        {error && (
          <div className="rounded-2xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/40 px-4 py-3 flex items-start gap-3 fade-in">
            <span className="mt-0.5 text-red-600 dark:text-red-400 shrink-0">
              <AlertTriangleIcon />
            </span>
            <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
          </div>
        )}

        {!subiendo && (
          <button
            onClick={handleUpload}
            disabled={!file}
            className="w-full inline-flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 disabled:hover:bg-brand-600 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl shadow-card hover:shadow-card-hover transition-all"
          >
            <UploadIcon />
            Enviar comprobante
          </button>
        )}
      </section>

      <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-slate-400 dark:text-slate-500">
        <span className="inline-flex items-center gap-1.5">
          <ShieldIcon />
          Procesado de forma segura
        </span>
        <span className="inline-flex items-center gap-1.5">
          <SparklesIcon />
          Conciliación asistida por IA
        </span>
      </div>
    </div>
  );
}