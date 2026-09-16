'use client';

import { useState } from 'react';
import Link from 'next/link';
import { supabase } from '../../lib/supabase';

export default function ReportarPagoPage() {
  const [file, setFile] = useState<File | null>(null);
  const [subiendo, setSubiendo] = useState(false);
  const [enviado, setEnviado] = useState(false);
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

    const { error: insertError } = await supabase.from('comprobantes').insert({
      imagen_url: urlData.publicUrl,
      unidad_id: unidad.id,
      fecha_carga: new Date().toISOString(),
      estado_extraccion: 'pendiente',
    });

    if (insertError) {
      setError('No se pudo registrar el comprobante: ' + insertError.message);
      setSubiendo(false);
      return;
    }

    setEnviado(true);
    setSubiendo(false);
  }

  if (enviado) {
    return (
      <div className="max-w-md mx-auto text-center fade-in">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 p-8">
          <div className="text-4xl mb-3">📤</div>
          <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-1">Comprobante enviado</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
            Quedó registrado y pendiente de validación. Te notificaremos cuando se concilie.
          </p>
          <Link href="/residente" className="inline-block bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors">
            Volver a mi cuenta
          </Link>
        </div>
      </div>
    );
  }

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
        {subiendo ? 'Subiendo...' : 'Enviar comprobante'}
      </button>
    </div>
  );
}