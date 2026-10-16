// Validación y conversión de imágenes subidas por el admin.
// Solo rasters conocidos: se rechaza SVG a propósito (puede llevar scripts).
const TIPOS_PERMITIDOS = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_BYTES = 2 * 1024 * 1024; // archivo original
const MAX_LADO = 640;              // px, el lado mayor tras reescalar

const leerComoDataUrl = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = () => resolve(reader.result);
  reader.onerror = () => reject(new Error('No se pudo leer la imagen'));
  reader.readAsDataURL(file);
});

const cargarImagen = (src) => new Promise((resolve, reject) => {
  const img = new Image();
  img.onload = () => resolve(img);
  img.onerror = () => reject(new Error('El archivo no es una imagen válida'));
  img.src = src;
});

/**
 * Valida el archivo, lo reescala (máx. MAX_LADO) y lo devuelve como data URL JPEG.
 * Reescalar acota el tamaño del payload y descarta metadatos del archivo original.
 */
export const imageFileToDataUrl = async (file) => {
  if (!TIPOS_PERMITIDOS.includes(file.type)) throw new Error('Solo se permiten imágenes JPG, PNG o WEBP');
  if (file.size > MAX_BYTES) throw new Error('La imagen no debe superar los 2 MB');

  const img = await cargarImagen(await leerComoDataUrl(file));
  const escala = Math.min(1, MAX_LADO / Math.max(img.width, img.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(img.width * escala);
  canvas.height = Math.round(img.height * escala);
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#ffffff'; // PNG con transparencia → fondo blanco en JPEG
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL('image/jpeg', 0.82);
};

/** true solo para data URLs de imagen raster o http(s). Bloquea javascript:, SVG, etc. */
export const isSafeImageUrl = (url) =>
  typeof url === 'string' &&
  (/^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/.test(url) || /^https?:\/\//i.test(url));
