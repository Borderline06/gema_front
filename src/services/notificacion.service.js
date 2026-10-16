import apiFetch from '../interceptors/api';
import { API_ROUTES } from '../constants/apiRoutes';
import { parseJsonResponse } from './httpHelpers';

export const notificacionService = {
    listar: async () => {
        const response = await apiFetch.get(API_ROUTES.NOTIFICACIONES.BASE);
        const result = await parseJsonResponse(response, 'Error al cargar las notificaciones');
        return result.data || [];
    },

    contarNoLeidas: async () => {
        const response = await apiFetch.get(`${API_ROUTES.NOTIFICACIONES.BASE}/conteo-no-leidas`);
        const result = await parseJsonResponse(response, 'Error al contar las notificaciones');
        return result.data || 0;
    },

    marcarLeida: async (id) => {
        const response = await apiFetch.patch(API_ROUTES.NOTIFICACIONES.MARCAR_LEIDA(id));
        return parseJsonResponse(response, 'Error al marcar la notificación');
    },
};
