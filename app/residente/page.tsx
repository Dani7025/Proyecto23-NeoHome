'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '../lib/supabase';

export default function ResidentePage() {
  const [saldo, setSaldo] = useState<number | null>(null);
  const [apto, setApto] = useState('');
  const router = useRouter();

  useEffect(() => {
    async function load() {
      const { data: authData } = await supabase.auth.getUser();
      if (!authData.user) { router.push('/login'); return; }

      const { data: unidad } = await supabase
        .from('unidades')
        .select('numero_apartamento, saldo_deudor')
        .eq('usuario_id', authData.user.id)
        .single();

      if (unidad) {
        setSaldo(unidad.saldo_deudor);
        setApto(unidad.numero_apartamento);
      }
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
    </div>
  );
}