import { BRAND_COLORS, alpha } from './src/config/themeColors.js';

/** @type {import('tailwindcss').Config} */

// La paleta vive en src/config/themeColors.js porque también la consume el
// código que necesita los colores como valores JS (estilos inline de
// react-hot-toast en App.jsx). Ver ese archivo para rebrandear.
const ACCENT = BRAND_COLORS.accent;

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: BRAND_COLORS,
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
        'accent-glow': `0 0 20px ${alpha(ACCENT, 0.4)}`,         // CTA destacado (sidebars, navbar móvil)
        'accent-glow-hover': `0 0 30px ${alpha(ACCENT, 0.6)}`,   // hover de ese CTA
        'accent-lift': `0 10px 20px -5px ${alpha(ACCENT, 0.4)}`, // botón de envío (auth)
        'accent-card': `0 20px 50px ${alpha(ACCENT, 0.1)}`,      // tarjeta de plan destacada
        'accent-dot': `0 0 10px ${alpha(ACCENT, 0.8)}`,          // punto de notificación
        'accent-dot-sm': `0 0 8px ${alpha(ACCENT, 0.6)}`,        // punto de aviso en lista
        'accent-bar': `0 0 15px ${alpha(ACCENT, 0.4)}`,          // barra decorativa
        'accent-bar-sm': `0 0 8px ${alpha(ACCENT, 0.5)}`,        // barra decorativa fina
      },
    },
  },
  plugins: [],
}
