// ─────────────────────────────────────────────────────────────────────────
// MOTOR DE REBRANDING — paleta de marca
//
// Única fuente de verdad de los colores de marca. La consumen DOS lados:
//   1. tailwind.config.js, que genera las utilidades brand-* y las sombras.
//   2. El código que necesita los colores como valores JS y no como clases
//      (p.ej. los estilos inline de react-hot-toast en App.jsx, o las
//      paletas de Recharts, que reciben el color por prop).
//
// Para rebrandear, cambiar SOLO los HEX de este archivo.
// El comentario de cada token indica su equivalente en la paleta por
// defecto de Tailwind, que es el valor que estaba hardcodeado por todo
// src/ antes de la migración. Cada HEX es el color exacto en producción.
//
// Nota: NO se usa resolveConfig de Tailwind para leer esto desde la app.
// Eso arrastraría el resolvedor de configuración de Tailwind al bundle del
// cliente. Un módulo plano es la dirección correcta de la dependencia: el
// config de Tailwind importa de aquí, no al revés.
// ─────────────────────────────────────────────────────────────────────────

export const BRAND_COLORS = {
  // Primario — navy institucional
  primary: '#1e3a8a',        // = blue-900
  'primary-dark': '#0f172a', // = slate-900  · hover, gradientes, backdrops
  'primary-soft': '#eff6ff', // = blue-50    · fondos de aviso/info

  // Acento — CTA naranja
  accent: '#f97316',         // = orange-500
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
};

/**
 * Convierte un HEX de la paleta en rgba() con la opacidad dada.
 * alpha('#f97316', 0.4) -> 'rgba(249,115,22,0.4)'
 */
export const alpha = (hex, a) => {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
};
