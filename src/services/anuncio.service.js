import apiFetch from '../interceptors/api';
import { API_ROUTES } from '../constants/apiRoutes';
import { parseJsonResponse } from './httpHelpers';

export const anuncioService = {
    /** Anuncios de beneficios vigentes (carrusel del dashboard del alumno). */
    listarActivos: async () => {
        const response = await apiFetch.get(API_ROUTES.ANUNCIOS_BENEFICIOS.ACTIVOS);
        const result = await parseJsonResponse(response, 'Error al cargar los beneficios');
        return result.data || [];
    },
};
