'use client';

import { useState, useEffect } from 'react';

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'));
  }, []);

  function toggle() {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('neohome-theme', next ? 'dark' : 'light');
  }

  return (
    <button
      onClick={toggle}
      title="Cambiar tema"
      className="w-9 h-9 rounded-full flex items-center justify-center text-slate-500 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
    >
      {isDark ? '☀️' : '🌙'}
    </button>
  );
}