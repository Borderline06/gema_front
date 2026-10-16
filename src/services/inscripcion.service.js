import apiFetch from '../interceptors/api';
import { API_ROUTES } from '../constants/apiRoutes';
import { parseJsonResponse } from './httpHelpers';

export const inscripcionService = {
    /** Todas las inscripciones del alumno, con su estado (ACTIVO, PENDIENTE_PAGO, FINALIZADO...). */
    listarPorAlumno: async (alumnoId) => {
        const response = await apiFetch.get(API_ROUTES.INSCRIPCIONES.ALUMNO(alumnoId));
        const result = await parseJsonResponse(response, 'Error al cargar las inscripciones');
        return result.data || [];
    },

    /** Inscripciones del alumno que no están FINALIZADAS (incluye el link de deuda con la fecha exacta). */
    listarNoFinalizadas: async (alumnoId) => {
        const response = await apiFetch.get(API_ROUTES.INSCRIPCIONES.ALUMNO_NO_FINALIZADAS(alumnoId));
        const result = await parseJsonResponse(response, 'Error al cargar los horarios del alumno');
        return result.data;
    },

    /**
     * Cambio de horario hecho por el admin.
     * - MENSUAL: solo `horarioId` (cambia el patrón semanal).
     * - CLASE ÚNICA: además `fechaClase` ('YYYY-MM-DD'); mueve esa única clase sin generar ciclo.
     */
    cambiarHorario: async ({ alumnoId, inscripcionId, horarioId, fechaClase, adminId }) => {
        const response = await apiFetch.put(API_ROUTES.INSCRIPCIONES.HORARIO_INSCRIPCION, {
            alumnoId,
            inscripcionId,
            horarioId,
            adminId,
            ...(fechaClase ? { fechaClase } : {}),
        });
        return parseJsonResponse(response, 'Error al procesar el cambio');
    },
};
