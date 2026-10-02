import { useContext, useEffect } from 'react';
import { CatalogContext } from '../context/catalogStore';

/**
 * Pide uno o varios catálogos y los devuelve desde la caché compartida.
 *
 *   const { sedes, niveles, loading } = useCatalogos(['sedes', 'niveles']);
 *
 * Los nombres válidos son las claves de CATALOG_LOADERS en catalogStore.js.
 */
export function useCatalogos(nombres = []) {
  const context = useContext(CatalogContext);
  if (!context) throw new Error('useCatalogos debe usarse dentro de un CatalogProvider');

  const { catalogos, errores, cargar, refrescar } = context;
  // `nombres` suele llegar como literal inline. Se depende de la clave de texto
  // y no del array para no re-disparar el efecto en cada render (ver la nota de
  // `deps` en src/hooks/useFetch.js).
  const clave = nombres.join(',');

  useEffect(() => {
    if (!clave) return;
    for (const nombre of clave.split(',')) {
      if (catalogos[nombre] === undefined) cargar(nombre);
    }
  }, [clave, catalogos, cargar]);

  const resultado = { loading: false, errores, refrescar };
  for (const nombre of nombres) {
    resultado[nombre] = catalogos[nombre] ?? [];
    if (catalogos[nombre] === undefined) resultado.loading = true;
  }
  return resultado;
}
