import apiFetch from '../interceptors/api';
import { API_ROUTES } from '../constants/apiRoutes';
import { parseJsonResponse } from './httpHelpers';

const cajaService = {
    // Detalle de un mes: filas de ingresos consolidados, manuales y egresos.
    // Es la unica fuente con el detalle necesario para las tablas editables.
    obtenerResumenMes: async (mes, anio) => {
        const response = await apiFetch.get(`${API_ROUTES.CAJA.RESUMEN}?mes=${mes}&anio=${anio}`);
        const result = await parseJsonResponse(response, `Error al cargar el mes ${mes}`);
        return result.data;
    },

    // Agregados de los 12 meses (totalIngresos / egresos / balance por mes).
    // Alimenta las cabeceras de los acordeones sin tener que pedir el detalle
    // de cada mes: una peticion en vez de doce.
    obtenerResumenAnual: async (anio) => {
        const response = await apiFetch.get(`${API_ROUTES.CAJA.RESUMEN_ANUAL}?anio=${anio}`);
        const result = await parseJsonResponse(response, 'Error al cargar el resumen anual');
        return result.data || [];
    },

    crear: async (movimiento) => {
        const response = await apiFetch.post(API_ROUTES.CAJA.BASE, movimiento);
        return await parseJsonResponse(response, 'Error al registrar el movimiento');
    },

    actualizar: async (id, movimiento) => {
        const response = await apiFetch.put(API_ROUTES.CAJA.BY_ID(id), movimiento);
        return await parseJsonResponse(response, 'Error al actualizar el movimiento');
    },

    eliminar: async (id) => {
        const response = await apiFetch.delete(API_ROUTES.CAJA.BY_ID(id));
        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.message || 'Error al eliminar el movimiento');
        }
        return response.status === 204 ? { success: true } : await response.json();
    },
};

export default cajaService;
