import { createContext } from 'react';
import { apiFetch } from '../interceptors/api';
import { API_ROUTES } from '../constants/apiRoutes';
import { sedeService } from '../services/sede.service';
import horarioService from '../services/horario.service';

/**
 * Pieza no-componente del CatalogContext: el objeto de contexto y los loaders.
 *
 * Vive en su propio archivo para que CatalogContext.jsx exporte solo el provider
 * y useCatalogos.js solo el hook (react-refresh/only-export-components).
 */
export const CatalogContext = createContext(null);

// Cada loader devuelve el array ya en la forma que esperan los consumidores
// actuales, para no cambiar el comportamiento de ninguna vista.
export const CATALOG_LOADERS = {
  sedes: async () => {
    const result = await sedeService.getAll({ activo: true, limit: 100 });
    return result.data || [];
  },
  niveles: async () => {
    const response = await apiFetch.get(API_ROUTES.NIVELES.BASE);
    const result = await response.json();
    return result.data || [];
  },
  horarios: async () => {
    return (await horarioService.obtenerDisponibles()) || [];
  },
  metodosPago: async () => {
    const response = await apiFetch.get(API_ROUTES.METODOS_PAGO.BASE);
    const result = await response.json();
    return result.data || [];
  },
};
