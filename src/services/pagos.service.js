import apiFetch from '../interceptors/api';
import { API_ROUTES } from '../constants/apiRoutes';
import { parseJsonResponse } from './httpHelpers';

export const pagosService = {
    /** Cuentas por cobrar y pagos del alumno, pedidos en paralelo. */
    getResumenFinanciero: async (alumnoId) => {
        const [resDeudas, resPagos] = await Promise.all([
            apiFetch.get(API_ROUTES.CUENTAS_POR_COBRAR.HISTORIAL(alumnoId)),
            apiFetch.get(API_ROUTES.PAGOS.ALUMNO_HISTORIAL(alumnoId)),
        ]);
        const [deudas, pagos] = await Promise.all([
            parseJsonResponse(resDeudas, 'Error al cargar las deudas'),
            parseJsonResponse(resPagos, 'Error al cargar los pagos'),
        ]);
        return { debts: deudas.data || [], payments: pagos.data || [] };
    },
};
