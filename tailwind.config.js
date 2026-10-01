/** @type {import('tailwindcss').Config} */

// Acento de marca. Vive en una constante porque lo consumen DOS secciones:
// colors.brand.accent y las sombras de extend.boxShadow, que llevan el color
// dentro del propio valor de box-shadow. Así un rebranding del acento arrastra
// también sus resplandores sin tener que editarlos uno por uno.
const ACCENT = '#f97316'; // = orange-500

// '#f97316' + 0.4 -> 'rgba(249,115,22,0.4)'
const alpha = (hex, a) => {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
};

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
          accent: ACCENT,            // = orange-500 · 494 usos / 112 archivos
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

      // ───────────────────────────────────────────────────────────────────
      // SOMBRAS DE MARCA
      // Las utilidades shadow-<color> de Tailwind no sirven aquí: estas
      // sombras codifican desplazamiento, difuminado Y color en un mismo
      // valor, así que antes vivían como shadow-[0_0_20px_rgba(...)] y
      // quedaban fuera del motor de rebranding.
      // Hay un token por geometría distinta, no uno por rol: dos sombras
      // que solo difieren en la opacidad son colores distintos y
      // unificarlas cambiaría el diseño.
      // ───────────────────────────────────────────────────────────────────
      boxShadow: {
        'accent-glow': `0 0 20px ${alpha(ACCENT, 0.4)}`,        // CTA destacado (sidebars, navbar móvil)
        'accent-glow-hover': `0 0 30px ${alpha(ACCENT, 0.6)}`,  // hover de ese CTA
        'accent-lift': `0 10px 20px -5px ${alpha(ACCENT, 0.4)}`, // botón de envío (auth)
        'accent-card': `0 20px 50px ${alpha(ACCENT, 0.1)}`,     // tarjeta de plan destacada
        'accent-dot': `0 0 10px ${alpha(ACCENT, 0.8)}`,         // punto de notificación
        'accent-dot-sm': `0 0 8px ${alpha(ACCENT, 0.6)}`,       // punto de aviso en lista
        'accent-bar': `0 0 15px ${alpha(ACCENT, 0.4)}`,         // barra decorativa
        'accent-bar-sm': `0 0 8px ${alpha(ACCENT, 0.5)}`,       // barra decorativa fina
      },
    },
  },
  plugins: [],
}
