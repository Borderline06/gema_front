/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // ─────────────────────────────────────────────────────────────────
        // MOTOR DE REBRANDING
        // Para rebrandear, cambiar SOLO los HEX de este bloque.
        // El comentario de cada token indica su equivalente en la paleta
        // por defecto de Tailwind, que es el valor que hoy está hardcodeado
        // por todo src/. Cada HEX es el color exacto en producción: no
        // alterarlo sin intención de cambiar el diseño.
        // ─────────────────────────────────────────────────────────────────
        brand: {
          // Primario — navy institucional
          primary: '#1e3a8a',        // = blue-900   · 533 usos / 121 archivos
          'primary-dark': '#0f172a', // = slate-900  · hover, gradientes, backdrops
          'primary-soft': '#eff6ff', // = blue-50    · fondos de aviso/info

          // Acento — CTA naranja
          accent: '#f97316',         // = orange-500 · 494 usos / 112 archivos
          'accent-dark': '#ea580c',  // = orange-600 · hover
          'accent-soft': '#fff7ed',  // = orange-50  · fondos de badge/pill

          // Neutros estructurales
          bg: '#f8fafc',             // = slate-50   · fondo de página
          surface: '#ffffff',        // = white      · tarjetas, modales
          'surface-alt': '#f1f5f9',  // = slate-100  · botón neutro, chips
          border: '#e2e8f0',         // = slate-200  · divisor estándar
          'border-soft': '#f1f5f9',  // = slate-100  · divisor sutil

          // Tipografía
          heading: '#0f172a',        // = slate-900  · títulos
          body: '#334155',           // = slate-700  · cuerpo
          muted: '#94a3b8',          // = slate-400  · secundario, placeholders
        },
      },
    },
  },
  plugins: [],
}
