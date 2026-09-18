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

export default function ReportarPagoPage() {
  const [file, setFile] = useState<File | null>(null);
  const [subiendo, setSubiendo] = useState(false);
  const [resultado, setResultado] = useState<Resultado | null>(null);
  const [error, setError] = useState('');

  async function handleUpload() {
    if (!file) return;
    setError('');
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

    // Llamar al webhook de n8n con los 3 datos
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

  // Vista de resultado (4 escenarios)
  if (resultado) {
    const estilos = {
      conciliado: {
        bg: 'bg-green-50 dark:bg-green-950/40 border-green-200 dark:border-green-800',
        texto: 'text-green-700 dark:text-green-400',
        emoji: '✅',
        titulo: '¡Pago conciliado!',
      },
      abono_parcial: {
        bg: 'bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800',
        texto: 'text-blue-700 dark:text-blue-400',
        emoji: '💰',
        titulo: 'Abono recibido',
      },
      discrepancia: {
        bg: 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800',
        texto: 'text-amber-700 dark:text-amber-400',
        emoji: '⚠️',
        titulo: 'Discrepancia de monto',
      },
      en_revision: {
        bg: 'bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-800',
        texto: 'text-red-700 dark:text-red-400',
        emoji: '❌',
        titulo: 'No pudimos leer tu comprobante',
      },
    };

    const estilo = estilos[resultado.estado] ?? estilos.en_revision;

    return (
      <div className="max-w-md mx-auto space-y-4 fade-in">
        <Link href="/residente" className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 flex items-center gap-1">
          ← Volver
        </Link>

        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 p-6">
          <div className="text-center mb-4">
            <div className="text-4xl mb-2">{estilo.emoji}</div>
            <h2 className="text-lg font-semibold text-slate-800 dark:text-white">{estilo.titulo}</h2>
          </div>

          <div className={`rounded-lg p-4 border ${estilo.bg} mb-4`}>
            {resultado.monto_extraido != null && (
              <div className="mb-2">
                <p className="text-xs text-slate-500 dark:text-slate-400">Monto detectado</p>
                <p className="text-xl font-bold text-slate-800 dark:text-white">
                  Bs. {resultado.monto_extraido.toFixed(2)}
                </p>
                {resultado.monto_usd != null && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    ≈ ${resultado.monto_usd.toFixed(2)}
                  </p>
                )}
              </div>
            )}
            {resultado.referencia && (
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Referencia: {resultado.referencia}
              </p>
            )}
            <p className={`text-sm font-medium mt-3 ${estilo.texto}`}>{resultado.mensaje}</p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => { setResultado(null); setFile(null); }}
              className="flex-1 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-medium py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-sm"
            >
              Reportar otro
            </button>
            <Link
              href="/residente"
              className="flex-1 text-center bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 rounded-lg transition-colors text-sm"
            >
              Ir al inicio
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Vista de subida
  return (
    <div className="max-w-md mx-auto space-y-4 fade-in">
      <Link href="/residente" className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 flex items-center gap-1">
        ← Volver
      </Link>
      <h2 className="text-xl font-bold text-slate-800 dark:text-white">Reportar Pago</h2>

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border-2 border-dashed border-teal-200 dark:border-teal-800 p-8 text-center">
        <div className="text-3xl mb-3">📎</div>
        <p className="font-medium text-slate-800 dark:text-white mb-1">Arrastra o selecciona tu archivo</p>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Acepta JPG, PNG, PDF</p>
        <input
          type="file"
          accept="image/jpeg,image/png,application/pdf"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className="text-sm text-slate-600 dark:text-slate-300 mx-auto"
        />
      </div>

      {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}

      <button
        onClick={handleUpload}
        disabled={!file || subiendo}
        className="w-full bg-teal-600 hover:bg-teal-700 disabled:opacity-60 text-white font-semibold py-2.5 rounded-lg transition-colors"
      >
        {subiendo ? 'Analizando con IA...' : 'Enviar comprobante'}
      </button>
    </div>
  );
}