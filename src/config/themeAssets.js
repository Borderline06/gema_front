// ─────────────────────────────────────────────────────────────────────────
// MOTOR DE REBRANDING — imágenes maestras
//
// Única fuente de verdad de las rutas de logos e imágenes de marca.
// Para rebrandear, reemplazar los archivos en public/ y, si cambian de
// nombre, ajustar SOLO las rutas de este archivo.
//
// Las claves describen el ROL, no el archivo: dos roles pueden apuntar hoy
// a la misma imagen y divergir en un rebranding futuro sin volver a tocar
// los componentes.
// ─────────────────────────────────────────────────────────────────────────

export const THEME_ASSETS = {
  /** Marca principal. Cabecera de los layouts y favicon. */
  logo: '/logo.png',

  /**
   * Filigrana decorativa: el mismo archivo que `logo`, pero usado de fondo,
   * rotado y a opacidad 0.02–0.05 (layouts, tarjetas de perfil y de pago).
   * Clave aparte para poder darle su propia imagen sin tocar componentes.
   */
  logoWatermark: '/logo.png',

  /** Logo con borde blanco, para superficies oscuras: sidebars, navbars, footer. */
  logoFramed: '/Logo con borde blanco.png',

  /** Marca del sitio público: navbar de landing, login y registro. */
  logoPublic: '/logo_diamante.jpeg',

  /** Fotografía de fondo de las pantallas de login y registro. */
  authBackground: '/bg.jpg',
};
