export default function DashboardPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-6 fade-in">
      <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Resumen Financiero</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-5">
          <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Total cobrado este mes</h3>
          <p className="text-3xl font-bold text-slate-800 dark:text-white mt-2">$4,250.00</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-5">
          <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">% de morosidad</h3>
          <p className="text-3xl font-bold text-slate-800 dark:text-white mt-2">14.5%</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-5">
          <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Alícuota promedio</h3>
          <p className="text-3xl font-bold text-slate-800 dark:text-white mt-2">$65.00</p>
        </div>
      </div>
    </div>
  );
}