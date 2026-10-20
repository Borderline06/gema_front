/** Quita elementos repetidos por `id`, conservando el primero y el orden original. */
export const uniqueById = (items = []) => {
  const vistos = new Set();
  return items.filter((item) => {
    if (vistos.has(item.id)) return false;
    vistos.add(item.id);
    return true;
  });
};

const claveNombre = (nombre) => String(nombre ?? '').trim().toLowerCase();

/**
 * Sedes sin repetidos para un <select>: por `id` y también por nombre (sin distinguir
 * mayúsculas ni espacios), porque una misma sede cargada dos veces con ids distintos se
 * vería como opciones duplicadas. Conserva la primera y el orden original.
 */
export const uniqueSedes = (sedes = []) => {
  const ids = new Set();
  const nombres = new Set();
  return sedes.filter((sede) => {
    const nombre = claveNombre(sede.nombre);
    if (ids.has(sede.id) || (nombre && nombres.has(nombre))) return false;
    ids.add(sede.id);
    if (nombre) nombres.add(nombre);
    return true;
  });
};
