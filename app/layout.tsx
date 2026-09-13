import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NeoHome - Gestión Financiera Residencial",
  description: "Conciliación, morosidad y alícuotas para condominios",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                var saved = localStorage.getItem('neohome-theme');
                var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                if (saved === 'dark' || (!saved && prefersDark)) {
                  document.documentElement.classList.add('dark');
                }
              })();
            `,
          }}
        />
      </head>
      <body className="bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 transition-colors duration-300">
        {children}
      </body>
    </html>
  );
}