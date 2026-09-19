import Link from 'next/link';
import ThemeToggle from './components/ThemeToggle';

function Brand({
  badgeSize = 'w-9 h-9',
  textSize = 'text-lg',
  showTagline = false,
}: {
  badgeSize?: string;
  textSize?: string;
  showTagline?: boolean;
}) {
  return (
    <div className="flex items-center gap-3">
      <img src="/logo-badge.png" alt="NeoHome" className={`${badgeSize} rounded-xl shadow-sm object-cover`} />
      <div className="flex flex-col leading-tight">
        <span className={`${textSize} font-bold text-slate-900 dark:text-white tracking-tight`}>NeoHome</span>
        {showTagline && (
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Gestión Financiera Residencial</span>
        )}
      </div>
    </div>
  );
}

function SparkleIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3z" />
      <path d="M19 15l.9 2.1L22 18l-2.1.9L19 21l-.9-2.1L16 18l2.1-.9L19 15z" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 3l7 3v5c0 4.5-3 8.5-7 10-4-1.5-7-5.5-7-10V6l7-3z" />
      <path d="M12 9v4M12 16h.01" />
    </svg>
  );
}

function CalculatorIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="4" y="3" width="16" height="18" rx="2" />
      <rect x="7" y="7" width="10" height="4" rx="1" />
      <path d="M8 15h.01M12 15h.01M16 15h.01M8 18h.01M12 18h.01M16 18h.01" />
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

function BrainIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M9.8 3.5A3.5 3.5 0 0 0 6 7 3.5 3.5 0 0 0 4 13.2a4 4 0 0 0 6.5 4.8A4 4 0 0 0 14 21a4 4 0 0 0 4-4.2A4.5 4.5 0 0 0 19 9a4 4 0 0 0-3.5-5.4c-1 0-1.9.4-2.5 1.1A3.7 3.7 0 0 0 9.8 3.5z" />
      <path d="M9 12h6M9 15h3" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

const FEATURES = [
  {
    icon: SparkleIcon,
    title: 'Conciliación con IA',
    description: 'Sube un comprobante y el sistema extrae el monto, la fecha y la referencia automáticamente.',
    iconClasses: 'bg-brand-100 dark:bg-brand-900/60 text-brand-700 dark:text-brand-200 ring-brand-200/70 dark:ring-brand-800',
  },
  {
    icon: ShieldIcon,
    title: 'Control de morosidad',
    description: 'Visibilidad inmediata de quién está al día y quién no, con estados claros y accionables.',
    iconClasses: 'bg-teal-100 dark:bg-teal-950/60 text-teal-700 dark:text-teal-200 ring-teal-200/70 dark:ring-teal-800',
  },
  {
    icon: CalculatorIcon,
    title: 'Alícuotas automáticas',
    description: 'Registra el gasto común y el sistema prorratea por coeficiente, sin hojas de cálculo.',
    iconClasses: 'bg-royal-100 dark:bg-royal-950/60 text-royal-700 dark:text-royal-200 ring-royal-200/70 dark:ring-royal-800',
  },
];

const STEPS = [
  {
    icon: UploadIcon,
    step: '01',
    title: 'El residente reporta su pago',
    description: 'Solo sube el comprobante desde su panel. Sin correos, WhatsApp ni planillas.',
  },
  {
    icon: BrainIcon,
    step: '02',
    title: 'La IA lee y concilia',
    description: 'NeoHome extrae monto, fecha y referencia, y cruza el pago contra la alícuota generada.',
  },
  {
    icon: CheckIcon,
    step: '03',
    title: 'Todo queda al día',
    description: 'El saldo de la unidad se actualiza y el historial queda registrado para el residente y el admin.',
  },
];

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <p className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">{value}</p>
      <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">{label}</p>
    </div>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300 overflow-x-hidden">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-slate-200/70 dark:border-slate-800/80 bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="hover:opacity-90 transition-opacity" aria-label="NeoHome - inicio">
            <Brand />
          </Link>
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600 dark:text-slate-300">
            <a href="#funciones" className="hover:text-brand-700 dark:hover:text-brand-200 transition-colors">Funciones</a>
            <a href="#como-funciona" className="hover:text-brand-700 dark:hover:text-brand-200 transition-colors">Cómo funciona</a>
            <a href="#para-quien" className="hover:text-brand-700 dark:hover:text-brand-200 transition-colors">Para quién</a>
          </nav>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link
              href="/login"
              className="hidden sm:inline-flex px-4 py-2 text-sm font-semibold text-brand-700 dark:text-brand-200 border border-brand-200 dark:border-brand-800 rounded-lg hover:bg-brand-50 dark:hover:bg-brand-900/60 transition-colors"
            >
              Iniciar sesión
            </Link>
            <Link
              href="/login"
              className="sm:hidden inline-flex w-9 h-9 items-center justify-center text-brand-700 dark:text-brand-200 border border-brand-200 dark:border-brand-800 rounded-lg hover:bg-brand-50 dark:hover:bg-brand-900/60 transition-colors"
              aria-label="Iniciar sesión"
            >
              <ArrowIcon />
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="relative">
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-[480px]"
            style={{
              background:
                'radial-gradient(600px 240px at 18% 0%, rgba(70,49,129,0.06), transparent 60%), radial-gradient(640px 260px at 82% 0%, rgba(44,123,145,0.07), transparent 60%), radial-gradient(520px 220px at 50% 0%, rgba(150,129,217,0.08), transparent 60%)',
            }}
            aria-hidden="true"
          />
          <div className="relative max-w-6xl mx-auto px-5 sm:px-8 pt-16 sm:pt-24 pb-12 sm:pb-16 text-center">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white dark:bg-slate-800 text-brand-700 dark:text-brand-200 border border-brand-200/70 dark:border-brand-800 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-500"></span>
              Gestión financiera para condominios
            </span>
            <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.08]">
              Conciliación, morosidad y alícuotas,{' '}
              <span className="bg-gradient-to-r from-brand-600 via-navy-600 to-teal-700 dark:from-brand-300 dark:via-lavender-400 dark:to-teal-300 bg-clip-text text-transparent">
                sin planillas ni WhatsApp
              </span>
            </h1>
            <p className="max-w-2xl mx-auto mt-6 text-base sm:text-lg text-slate-500 dark:text-slate-400 leading-relaxed">
              NeoHome usa inteligencia artificial para leer tus comprobantes de pago, conciliarlos
              automáticamente y mantener al día las cuentas de tu condominio.
            </p>
            <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 w-full sm:w-auto justify-center px-7 py-3.5 bg-brand-600 hover:bg-brand-700 dark:bg-brand-500 dark:hover:bg-brand-600 text-white font-semibold rounded-xl shadow-card hover:shadow-card-hover transition-all"
              >
                Comenzar ahora
                <ArrowIcon />
              </Link>
              <Link
                href="#funciones"
                className="inline-flex items-center w-full sm:w-auto justify-center px-7 py-3.5 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold rounded-xl border border-slate-200 dark:border-slate-700 shadow-card hover:shadow-card-hover hover:border-slate-300 dark:hover:border-slate-600 transition-all"
              >
                Ver funciones
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="relative max-w-4xl mx-auto px-5 sm:px-8 pb-14 sm:pb-20">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white dark:bg-slate-800 border border-slate-200/70 dark:border-slate-700 rounded-2xl shadow-card px-6 sm:px-10 py-7">
              <Stat value="Automático" label="Extracción de datos de comprobantes" />
              <div className="hidden sm:block w-px bg-slate-200 dark:bg-slate-700 mx-auto"></div>
              <Stat value="En segundos" label="asistido por inteligencia artificial" />
              <div className="hidden sm:block w-px bg-slate-200 dark:bg-slate-700 mx-auto"></div>
              <Stat value="+ Transparente" label="historial visible para cada residente" />
            </div>
          </div>
        </section>

        {/* Funciones */}
        <section id="funciones" className="max-w-6xl mx-auto px-5 sm:px-8 py-14 sm:py-20">
          <div className="max-w-2xl mx-auto text-center mb-12 sm:mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
              Un solo lugar para la administración de tu condominio
            </h2>
            <p className="mt-4 text-slate-500 dark:text-slate-400 leading-relaxed">
              Todo lo que antes era manual, ahora es automático, ordenado y claro.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="group bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/70 dark:border-slate-700 p-6 shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200"
              >
                <div className={`inline-flex items-center justify-center w-11 h-11 rounded-xl ring-1 ${f.iconClasses} transition-transform duration-200 group-hover:scale-105`}>
                  <f.icon />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-slate-900 dark:text-white">{f.title}</h3>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Cómo funciona */}
        <section id="como-funciona" className="bg-white dark:bg-slate-800/50 border-y border-slate-200/70 dark:border-slate-800">
          <div className="max-w-6xl mx-auto px-5 sm:px-8 py-14 sm:py-20">
            <div className="max-w-2xl mx-auto text-center mb-12 sm:mb-14">
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
                Cómo funciona
              </h2>
              <p className="mt-4 text-slate-500 dark:text-slate-400 leading-relaxed">
                Tres pasos simples para dejar la gestión de cobros en piloto automático.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
              {STEPS.map((s) => (
                <div key={s.step} className="relative bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200/70 dark:border-slate-800 p-6">
                  <span className="absolute top-5 right-6 text-4xl font-extrabold text-slate-200 dark:text-slate-700 select-none" aria-hidden="true">
                    {s.step}
                  </span>
                  <div className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-brand-600 to-navy-600 dark:from-brand-500 dark:to-navy-500 text-white shadow-sm">
                    <s.icon />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold text-slate-900 dark:text-white">{s.title}</h3>
                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{s.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Para quién */}
        <section id="para-quien" className="max-w-6xl mx-auto px-5 sm:px-8 py-14 sm:py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-teal-800 to-navy-900 dark:from-teal-900 dark:to-navy-900 rounded-2xl p-7 sm:p-9 text-white shadow-card">
              <p className="text-xs font-bold uppercase tracking-wider text-teal-200">Para residentes</p>
              <h3 className="mt-3 text-2xl font-bold tracking-tight">Claridad y tranquilidad</h3>
              <p className="mt-3 text-sm text-teal-100/90 leading-relaxed">
                Saber exactamente cuánto debes y verificar que tu pago fue recibido, sin intermediarios.
              </p>
              <ul className="mt-6 space-y-3">
                {['Saldo siempre visible, al día', 'Reporta tu pago en un minuto', 'Seguimiento de cada comprobante'].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm">
                    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-white/15 text-teal-100 shrink-0">
                      <CheckIcon />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-gradient-to-br from-brand-700 to-navy-800 dark:from-brand-800 dark:to-navy-900 rounded-2xl p-7 sm:p-9 text-white shadow-card">
              <p className="text-xs font-bold uppercase tracking-wider text-lavender-300">Para administradores</p>
              <h3 className="mt-3 text-2xl font-bold tracking-tight">Control financiero real</h3>
              <p className="mt-3 text-sm text-lavender-100/90 leading-relaxed">
                Detecta problemas a tiempo y concilia en minutos, no en tardes.
              </p>
              <ul className="mt-6 space-y-3">
                {['Conciliación asistida por IA', 'Morosidad, alícuotas y residentes en un panel', 'Decisiones con datos claros y ordenados'].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm">
                    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-white/15 text-lavender-200 shrink-0">
                      <CheckIcon />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* CTA final */}
        <section className="max-w-6xl mx-auto px-5 sm:px-8 pb-16 sm:pb-24">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-700 via-navy-700 to-teal-800 dark:from-brand-800 dark:via-navy-800 dark:to-teal-900 px-6 sm:px-12 py-12 sm:py-16 text-center shadow-card">
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background: 'radial-gradient(600px 240px at 20% 0%, rgba(150,129,217,0.25), transparent 60%), radial-gradient(640px 260px at 80% 100%, rgba(44,123,145,0.3), transparent 60%)',
              }}
              aria-hidden="true"
            />
            <div className="relative">
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
                Lleva la administración de tu condominio al siguiente nivel
              </h2>
              <p className="max-w-xl mx-auto mt-4 text-brand-100/90 dark:text-white/80 leading-relaxed">
                Únete a la gestión financiera moderna. Ingresa ahora y deja que NeoHome concilie por ti.
              </p>
              <Link
                href="/login"
                className="mt-8 inline-flex items-center gap-2 px-8 py-3.5 bg-white dark:bg-slate-50 text-brand-700 dark:text-brand-800 font-semibold rounded-xl shadow-pop hover:shadow-card-hover hover:scale-[1.02] transition-all"
              >
                Comenzar ahora
                <ArrowIcon />
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200/70 dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Brand badgeSize="w-8 h-8" textSize="text-base" showTagline />
          <p className="text-sm text-slate-500 dark:text-slate-400">
            © {new Date().getFullYear()} NeoHome · Gestión Financiera Residencial
          </p>
        </div>
      </footer>
    </div>
  );
}