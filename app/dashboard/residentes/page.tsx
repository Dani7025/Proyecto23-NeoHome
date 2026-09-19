'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

type Unidad = {
  id: string;
  numero_apartamento: string;
  usuario_id: string | null;
};

export default function ResidentesPage() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [apartamento, setApartamento] = useState('');
  const [unidades, setUnidades] = useState<Unidad[]>([]);
  const [enviando, setEnviando] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  async function cargarUnidades() {
    const { data } = await supabase
      .from('unidades')
      .select('id, numero_apartamento, usuario_id')
      .is('usuario_id', null)
      .order('numero_apartamento');
    setUnidades(data || []);
  }

  useEffect(() => {
    cargarUnidades();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setMensaje('');
    setEnviando(true);

    const res = await fetch('/api/admin/crear-residente', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, email, password, numero_apartamento: apartamento }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || 'Error al crear residente');
    } else {
      setMensaje('✓ ' + data.mensaje);
      setNombre('');
      setEmail('');
      setPassword('');
      setApartamento('');
      await cargarUnidades();
    }
    setEnviando(false);
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 fade-in">
      <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Registrar Residente</h2>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nombre completo</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej: María González"
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-teal-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="residente@neohome.com"
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-teal-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Contraseña temporal</label>
            <input
              type="text"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Ej: neo123"
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-teal-500"
              required
            />
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Mínimo 6 caracteres. Compártela con el residente.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Apartamento (solo unidades libres)
            </label>
            <select
              value={apartamento}
              onChange={(e) => setApartamento(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-teal-500"
              required
            >
              <option value="">Selecciona una unidad...</option>
              {unidades.map((u) => (
                <option key={u.id} value={u.numero_apartamento}>
                  Apt {u.numero_apartamento}
                </option>
              ))}
            </select>
            {unidades.length === 0 && (
              <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                No hay unidades libres. Todas están asignadas.
              </p>
            )}
          </div>

          {error && (
            <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          {mensaje && (
            <p className="text-sm text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/40 border border-green-200 dark:border-green-800 rounded-lg px-3 py-2">
              {mensaje}
            </p>
          )}

          <button
            type="submit"
            disabled={enviando}
            className="w-full bg-teal-600 hover:bg-teal-700 disabled:opacity-60 text-white font-semibold py-2.5 rounded-lg transition-colors"
          >
            {enviando ? 'Creando...' : 'Crear residente'}
          </button>
        </form>
      </div>
    </div>
  );
}