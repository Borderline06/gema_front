import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const contentSecurityPolicy = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "connect-src 'self' https://clubgemabackend-production.up.railway.app",
  "font-src 'self' data:",
  "object-src 'none'",
  "base-uri 'self'",
  "frame-ancestors 'none'",
  "form-action 'self'",
  'upgrade-insecure-requests',
].join('; ');

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // NO configurar build.rollupOptions.output.manualChunks aqui.
  // Medido en este proyecto (Vite 7 / Rollup 4): cualquier entrada en
  // manualChunks convierte ese chunk en import estatico del entry, aunque solo
  // se alcance por import() dinamico. Con { recharts } el arranque pasaba de
  // 384 kB a 790 kB; con { xlsx } arrastraba 850 kB. El troceado automatico ya
  // deja recharts dentro del chunk async del Dashboard y xlsx en su propio
  // chunk async, asi que ninguno viaja en la carga inicial.
  preview: {
    allowedHosts: true,
    port: process.env.PORT || 8080,
    host: '0.0.0.0',
    headers: {
      'Content-Security-Policy': contentSecurityPolicy,
    },
  },
  server: {
    allowedHosts: true,
  },
});
