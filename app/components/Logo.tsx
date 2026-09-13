export default function Logo({ size = 'normal' }: { size?: 'normal' | 'small' }) {
  const badgeSize = size === 'small' ? 'w-9 h-9' : 'w-14 h-14';
  const textSize = size === 'small' ? 'text-lg' : 'text-3xl';

  return (
    <div className="flex flex-col items-center">
      <img
        src="/logo-badge.png"
        alt="NeoHome"
        className={`${badgeSize} rounded-xl shadow-sm object-cover mb-2`}
      />
      <h1 className={`${textSize} font-bold text-slate-900 dark:text-white tracking-tight`}>NeoHome</h1>
      {size === 'normal' && (
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Gestión Financiera Residencial</p>
      )}
    </div>
  );
}