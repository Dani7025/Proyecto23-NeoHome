import Link from 'next/link';
import Logo from './components/Logo';
import ThemeToggle from './components/ThemeToggle';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      <header className="flex items-center justify-between px-6 sm:px-10 py-6 max-w-6xl mx-auto">
        <Logo size="small" />
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link
            href="/login"
            className="px-4 py-2 text-sm font-semibold text-teal-700 dark:text-teal-400 border border-teal-200 dark:border-teal-800 rounded-lg hover:bg-teal-50 dark:hover:bg-teal-950 transition-colors"
          >
            Iniciar sesión
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 sm:px-10 pt-10 pb-20 text-center">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-400 border border-teal-200 dark:border-teal-800 mb-6">
          Gestión financiera para condominios
        </span>
        <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white tracking-tight leading-tight">
          Conciliación, morosidad y alícuotas,<br className="hidden sm:block" /> sin planillas ni WhatsApp
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-5 text-lg max-w-2xl mx-auto">
          NeoHome usa inteligencia artificial para leer tus comprobantes de pago,
          conciliarlos automáticamente y mantener al día las cuentas de tu condominio.
        </p>
        <div className="mt-8">
          <Link
            href="/login"
            className="inline-block px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl transition-colors shadow-sm shadow-teal-200 dark:shadow-none"
          >
            Comenzar ahora
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-16 text-left">
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 p-5 shadow-sm">
            <h3 className="font-semibold text-slate-800 dark:text-white mb-1">🪄 Conciliación con IA</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">Sube un comprobante y el sistema extrae el monto, la fecha y la referencia automáticamente.</p>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 p-5 shadow-sm">
            <h3 className="font-semibold text-slate-800 dark:text-white mb-1">⚠️ Control de morosidad</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">Visibilidad inmediata de quién está al día y quién no.</p>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 p-5 shadow-sm">
            <h3 className="font-semibold text-slate-800 dark:text-white mb-1">🧮 Alícuotas automáticas</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">Registra el gasto común y el sistema prorratea por coeficiente.</p>
          </div>
        </div>
      </main>
    </div>
  );
}